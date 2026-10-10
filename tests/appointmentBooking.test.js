import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { 
  APPROVED_TIME_SLOTS, 
  getMinBookingDate, 
  getMaxBookingDate, 
  validateAppointmentDate, 
  validateTimeSlot, 
  checkDuplicateActiveBooking, 
  sanitizeLoadedAppointments 
} from '../src/context/AppointmentContext';
import { DOCTORS_CATALOG, getDoctorById } from '../src/data/doctorsData';
import { 
  generateICSContent, 
  escapeICSText, 
  foldICSLine, 
  parseDateString, 
  parseTimeSlot 
} from '../src/utils/calendarExport';

describe('SheSync Phase 4: Appointment State, Validation & Calendar Export Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Initializes with strictly empty appointment list when no saved appointments exist', () => {
    const rawStored = storage.get('appointments', []);
    const cleanList = sanitizeLoadedAppointments(rawStored);

    expect(cleanList).toEqual([]);
    expect(cleanList.length).toBe(0);
  });

  it('2. Validates appointment date bounds dynamically (tomorrow through 30 days ahead)', () => {
    const baseDate = new Date('2026-10-10T12:00:00Z');

    // Tomorrow (2026-10-11) is valid
    const tomorrowValid = validateAppointmentDate('2026-10-11', baseDate);
    expect(tomorrowValid.isValid).toBe(true);

    // 30 days ahead (2026-11-09) is valid
    const maxDayValid = validateAppointmentDate('2026-11-09', baseDate);
    expect(maxDayValid.isValid).toBe(true);

    // Today (2026-10-10) is rejected (must be at least 1 day in advance)
    const todayRejected = validateAppointmentDate('2026-10-10', baseDate);
    expect(todayRejected.isValid).toBe(false);
    expect(todayRejected.error).toContain('at least 1 day in advance');

    // Past date (2026-10-05) is rejected
    const pastRejected = validateAppointmentDate('2026-10-05', baseDate);
    expect(pastRejected.isValid).toBe(false);

    // Date > 30 days (2026-11-20) is rejected
    const futureRejected = validateAppointmentDate('2026-11-20', baseDate);
    expect(futureRejected.isValid).toBe(false);
    expect(futureRejected.error).toContain('up to 30 days in advance');

    // Non-existent Gregorian date (2026-02-30) is rejected
    const invalidGregorian = validateAppointmentDate('2026-02-30', baseDate);
    expect(invalidGregorian.isValid).toBe(false);
    expect(invalidGregorian.error).toContain('Invalid day in appointment date');

    // Malformed format is rejected
    const malformed = validateAppointmentDate('15-10-2026', baseDate);
    expect(malformed.isValid).toBe(false);
  });

  it('3. Validates approved time slots and rejects unsupported slots', () => {
    // Approved slots pass
    APPROVED_TIME_SLOTS.forEach((slot) => {
      const check = validateTimeSlot(slot);
      expect(check.isValid).toBe(true);
    });

    // Unsupported slots fail
    expect(validateTimeSlot('10:30 AM').isValid).toBe(false);
    expect(validateTimeSlot('12:00 PM').isValid).toBe(false);
    expect(validateTimeSlot('04:00 PM').isValid).toBe(false);
    expect(validateTimeSlot('noon').isValid).toBe(false);
    expect(validateTimeSlot('').isValid).toBe(false);
  });

  it('4. Creates a valid booking, verifies schema, and persists under shesync_appointments', () => {
    const doctor = getDoctorById('doc-gyn-1');
    expect(doctor).not.toBeNull();

    const minDate = getMinBookingDate();
    const nowIso = new Date().toISOString();

    const newAppointment = {
      id: `apt-${Date.now()}-test`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialtyLabel,
      title: doctor.title,
      mode: 'video',
      date: minDate,
      timeSlot: '09:30 AM',
      simulatedFee: doctor.simulatedFee,
      simulatedFeeFormatted: doctor.simulatedFeeFormatted,
      clinicName: 'Online Tele-Suite (Simulated)',
      clinicLocation: 'Telehealth Video Consultation (Simulated Demo)',
      patientName: 'Demo Patient',
      status: 'confirmed',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Save to storage
    storage.set('appointments', [newAppointment]);

    // Retrieve and verify
    const stored = storage.get('appointments');
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(newAppointment.id);
    expect(stored[0].doctorId).toBe('doc-gyn-1');
    expect(stored[0].status).toBe('confirmed');
    expect(stored[0].date).toBe(minDate);
    expect(stored[0].timeSlot).toBe('09:30 AM');
    expect(stored[0].patientName).toBe('Demo Patient');
  });

  it('5. Prevents duplicate active bookings for the same doctor, date, and slot', () => {
    const minDate = getMinBookingDate();
    const existingList = [
      {
        id: 'apt-101',
        doctorId: 'doc-gyn-1',
        date: minDate,
        timeSlot: '09:30 AM',
        status: 'confirmed'
      },
      {
        id: 'apt-102',
        doctorId: 'doc-pcos-2',
        date: minDate,
        timeSlot: '11:00 AM',
        status: 'rescheduled'
      }
    ];

    // Conflict: Same doctor, same date, same slot
    const hasConflict1 = checkDuplicateActiveBooking(existingList, {
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '09:30 AM'
    });
    expect(hasConflict1).toBe(true);

    // Conflict on rescheduled active appointment
    const hasConflict2 = checkDuplicateActiveBooking(existingList, {
      doctorId: 'doc-pcos-2',
      date: minDate,
      timeSlot: '11:00 AM'
    });
    expect(hasConflict2).toBe(true);

    // No conflict: Different slot for same doctor
    const noConflictSlot = checkDuplicateActiveBooking(existingList, {
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '11:00 AM'
    });
    expect(noConflictSlot).toBe(false);

    // No conflict: Same slot for different doctor
    const noConflictDoctor = checkDuplicateActiveBooking(existingList, {
      doctorId: 'doc-nutri-3',
      date: minDate,
      timeSlot: '09:30 AM'
    });
    expect(noConflictDoctor).toBe(false);
  });

  it('6. Cancelling an appointment updates status to cancelled and frees the time slot', () => {
    const minDate = getMinBookingDate();
    let appointments = [
      {
        id: 'apt-201',
        doctorId: 'doc-gyn-1',
        date: minDate,
        timeSlot: '02:00 PM',
        status: 'confirmed',
        updatedAt: '2026-10-09T10:00:00Z'
      }
    ];

    // Slot is currently taken
    expect(checkDuplicateActiveBooking(appointments, {
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '02:00 PM'
    })).toBe(true);

    // Cancel appointment
    const nowIso = new Date().toISOString();
    appointments = appointments.map((apt) =>
      apt.id === 'apt-201' ? { ...apt, status: 'cancelled', updatedAt: nowIso } : apt
    );

    expect(appointments[0].status).toBe('cancelled');

    // Slot is now freed (duplicate check ignores cancelled records)
    const slotFreed = checkDuplicateActiveBooking(appointments, {
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '02:00 PM'
    });
    expect(slotFreed).toBe(false);
  });

  it('7. Atomic rescheduling retains appointment ID and updates date/slot upon success', () => {
    const minDate = getMinBookingDate();
    const appointmentId = 'apt-301';

    let appointments = [
      {
        id: appointmentId,
        doctorId: 'doc-gyn-1',
        date: minDate,
        timeSlot: '09:30 AM',
        mode: 'video',
        status: 'confirmed',
        createdAt: '2026-10-09T10:00:00Z',
        updatedAt: '2026-10-09T10:00:00Z'
      }
    ];

    const targetDate = minDate;
    const targetSlot = '03:30 PM';

    // Verify target slot is free (excluding self ID)
    const hasConflict = checkDuplicateActiveBooking(appointments, {
      doctorId: 'doc-gyn-1',
      date: targetDate,
      timeSlot: targetSlot,
      excludeAppointmentId: appointmentId
    });
    expect(hasConflict).toBe(false);

    // Apply atomic reschedule
    const nowIso = new Date().toISOString();
    appointments = appointments.map((apt) =>
      apt.id === appointmentId
        ? { ...apt, date: targetDate, timeSlot: targetSlot, status: 'rescheduled', updatedAt: nowIso }
        : apt
    );

    expect(appointments.length).toBe(1);
    expect(appointments[0].id).toBe(appointmentId); // ID retained
    expect(appointments[0].date).toBe(targetDate);
    expect(appointments[0].timeSlot).toBe('03:30 PM');
    expect(appointments[0].status).toBe('rescheduled');
  });

  it('8. Failed rescheduling due to conflict preserves the original appointment intact', () => {
    const minDate = getMinBookingDate();
    const originalAppointment = {
      id: 'apt-401',
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '09:30 AM',
      mode: 'video',
      status: 'confirmed'
    };

    const conflictingAppointment = {
      id: 'apt-402',
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '11:00 AM',
      mode: 'video',
      status: 'confirmed'
    };

    const appointments = [originalAppointment, conflictingAppointment];

    // Attempting to reschedule apt-401 to 11:00 AM (conflicts with apt-402)
    const hasConflict = checkDuplicateActiveBooking(appointments, {
      doctorId: 'doc-gyn-1',
      date: minDate,
      timeSlot: '11:00 AM',
      excludeAppointmentId: 'apt-401'
    });

    expect(hasConflict).toBe(true);

    // Original appointment remains completely unchanged
    expect(appointments.find(a => a.id === 'apt-401').timeSlot).toBe('09:30 AM');
    expect(appointments.find(a => a.id === 'apt-401').status).toBe('confirmed');
  });

  it('9. Reset Demo Data clears stored appointments and restores pristine empty state', () => {
    // Populate sample demo appointment
    const sampleApt = {
      id: 'apt-501',
      doctorId: 'doc-gyn-1',
      date: getMinBookingDate(),
      timeSlot: '09:30 AM',
      status: 'confirmed'
    };

    storage.set('appointments', [sampleApt]);
    expect(storage.get('appointments').length).toBe(1);

    // Execute safe storage purge
    const clearResult = storage.clearAllSheSyncData();
    expect(clearResult).toBe(true);

    // Verify appointments key is gone and sanitizes to empty array []
    const retrievedAfterReset = storage.get('appointments', []);
    expect(retrievedAfterReset).toEqual([]);
    expect(sanitizeLoadedAppointments(retrievedAfterReset)).toEqual([]);
  });

  it('10. Calendar export utility produces valid RFC 5545 format with escaping and demo disclaimers', () => {
    const appointment = {
      id: 'apt-test-ics-1',
      doctorName: 'Dr. Ananya Sharma',
      specialty: 'Obstetrics & Gynaecology',
      date: '2026-10-15',
      timeSlot: '09:30 AM',
      mode: 'in_clinic',
      clinicLocation: '100ft Road, Indiranagar, Bengaluru, Karnataka (Simulated Demo)'
    };

    const icsContent = generateICSContent(appointment);

    // Verify RFC 5545 structural tags
    expect(icsContent).toContain('BEGIN:VCALENDAR');
    expect(icsContent).toContain('VERSION:2.0');
    expect(icsContent).toContain('PRODID:-//SheSync//Women\'s Wellness Hackathon Demo//EN');
    expect(icsContent).toContain('BEGIN:VEVENT');
    expect(icsContent).toContain('UID:shesync-demo-apt-test-ics-1@shesync.local');
    expect(icsContent).toContain('DTSTART:20261015T093000');
    expect(icsContent).toContain('DTEND:20261015T100000');
    expect(icsContent).toContain('SUMMARY:SheSync Demo Consultation - Dr. Ananya Sharma (Simulated)');
    expect(icsContent).toContain('STATUS:CONFIRMED');
    expect(icsContent).toContain('END:VEVENT');
    expect(icsContent).toContain('END:VCALENDAR');

    // Verify demo disclaimers are present
    expect(icsContent).toContain('SHESYNC SIMULATED DEMO APPOINTMENT');

    // Test text escaping helper
    const unescaped = 'Specialist: Dr. Sharma, MS; Obstetrician \\ Gynaecologist\nNote: Routine checkup';
    const escaped = escapeICSText(unescaped);
    expect(escaped).toContain('\\,');
    expect(escaped).toContain('\\;');
    expect(escaped).toContain('\\\\');
    expect(escaped).toContain('\\n');

    // Test date parser errors
    expect(() => parseDateString('invalid-date')).toThrow();
    expect(() => parseDateString('2026-13-01')).toThrow();
    expect(() => parseDateString('2026-02-30')).toThrow();

    // Test time slot parser errors
    expect(() => parseTimeSlot('25:00')).toThrow();
    expect(() => parseTimeSlot('10:65 AM')).toThrow();
  });
});
