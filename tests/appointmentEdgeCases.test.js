import { describe, it, expect } from 'vitest';
import {
  validateAppointmentDate,
  validateTimeSlot,
  checkDuplicateActiveBooking,
  APPROVED_TIME_SLOTS,
  formatDateToYYYYMMDD,
  getMinBookingDate,
  getMaxBookingDate
} from '../src/context/AppointmentContext';
import {
  generateICSContent,
  escapeICSText,
  foldICSLine,
  parseTimeSlot,
  parseDateString
} from '../src/utils/calendarExport';

describe('SheSync Appointments: Edge Cases & Calendar Integration', () => {
  const baseDate = new Date(2028, 1, 15); // 15 Feb 2028 (Leap Year)

  it('1. Correctly validates leap year February 29th and rejects non-leap year Feb 29th', () => {
    // 2028 is leap year: Feb 29 exists (day 29 of month 2)
    const feb29LeapCheck = validateAppointmentDate('2028-02-29', baseDate);
    expect(feb29LeapCheck.isValid).toBe(true);

    // 2026 is non-leap year: Feb 29 does NOT exist
    const feb29NonLeap = validateAppointmentDate('2026-02-29', new Date(2026, 1, 10));
    expect(feb29NonLeap.isValid).toBe(false);
    expect(feb29NonLeap.error).toContain('Invalid day in appointment date');
  });

  it('2. Enforces booking date window strictly: tomorrow is minimum, today and past dates rejected', () => {
    const todayStr = formatDateToYYYYMMDD(baseDate);
    const minAllowed = getMinBookingDate(baseDate);
    const maxAllowed = getMaxBookingDate(baseDate, 30);

    // Today is rejected
    const todayCheck = validateAppointmentDate(todayStr, baseDate);
    expect(todayCheck.isValid).toBe(false);
    expect(todayCheck.error).toContain('at least 1 day in advance');

    // Tomorrow is valid
    const tomorrowCheck = validateAppointmentDate(minAllowed, baseDate);
    expect(tomorrowCheck.isValid).toBe(true);

    // Max allowed (30 days) is valid
    const maxCheck = validateAppointmentDate(maxAllowed, baseDate);
    expect(maxCheck.isValid).toBe(true);

    // 31 days ahead is rejected
    const overMax = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 31);
    const overMaxCheck = validateAppointmentDate(formatDateToYYYYMMDD(overMax), baseDate);
    expect(overMaxCheck.isValid).toBe(false);
    expect(overMaxCheck.error).toContain('up to 30 days in advance');
  });

  it('3. Cancelling an appointment frees the slot for re-booking with the same doctor', () => {
    const doctorId = 'doc-gyn-1';
    const date = '2028-02-20';
    const timeSlot = '11:00 AM';

    // Active appointment
    const appointments = [
      {
        id: 'apt-1',
        doctorId,
        date,
        timeSlot,
        status: 'confirmed'
      }
    ];

    // Conflict exists
    expect(checkDuplicateActiveBooking(appointments, { doctorId, date, timeSlot })).toBe(true);

    // Status updated to cancelled
    appointments[0].status = 'cancelled';

    // Conflict no longer exists: slot is freed
    expect(checkDuplicateActiveBooking(appointments, { doctorId, date, timeSlot })).toBe(false);
  });

  it('4. Rescheduling safely excludes current appointment ID during slot availability check', () => {
    const doctorId = 'doc-gyn-1';
    const date = '2028-02-20';
    const timeSlot = '11:00 AM';

    const appointments = [
      {
        id: 'apt-1',
        doctorId,
        date,
        timeSlot,
        status: 'confirmed'
      },
      {
        id: 'apt-2',
        doctorId,
        date,
        timeSlot: '02:00 PM',
        status: 'confirmed'
      }
    ];

    // When rescheduling apt-1, keeping its own slot (11:00 AM) is allowed (not treated as self-conflict)
    const selfCheck = checkDuplicateActiveBooking(appointments, {
      doctorId,
      date,
      timeSlot,
      excludeAppointmentId: 'apt-1'
    });
    expect(selfCheck).toBe(false);

    // Attempting to reschedule apt-1 to apt-2's slot (02:00 PM) detects a collision
    const otherConflict = checkDuplicateActiveBooking(appointments, {
      doctorId,
      date,
      timeSlot: '02:00 PM',
      excludeAppointmentId: 'apt-1'
    });
    expect(otherConflict).toBe(true);
  });

  it('5. Generates RFC 5545 compliant .ics output with escaping and line folding', () => {
    const demoApt = {
      id: 'apt-demo-99',
      doctorName: 'Dr. Priya, Specialist; OB-GYN',
      specialty: 'PCOS & Hormonal Health',
      date: '2028-02-25',
      timeSlot: '02:00 PM',
      mode: 'video'
    };

    const ics = generateICSContent(demoApt);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:shesync-demo-apt-demo-99@shesync.local');
    expect(ics).toContain('DTSTART:20280225T140000');
    expect(ics).toContain('DTEND:20280225T143000');
    expect(ics).toContain('STATUS:CONFIRMED');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');

    // Test text escaping
    const textWithSpecialChars = 'Hello, World; Testing \\ and \n newline';
    const escaped = escapeICSText(textWithSpecialChars);
    expect(escaped).toBe('Hello\\, World\\; Testing \\\\ and \\n newline');

    // Test line folding
    const longLine = 'DESCRIPTION:' + 'A'.repeat(100);
    const folded = foldICSLine(longLine);
    expect(folded).toContain('\r\n ');
  });
});
