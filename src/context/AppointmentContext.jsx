import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/storage';
import { DOCTORS_CATALOG, getDoctorById } from '../data/doctorsData';

const AppointmentContext = createContext();

/**
 * Standard Approved Time Slots for Simulated Appointments.
 */
export const APPROVED_TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM'
];

/**
 * Formats a Date object to "YYYY-MM-DD" local date string.
 * @param {Date} date 
 * @returns {string}
 */
export function formatDateToYYYYMMDD(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Dynamic calculation of the earliest allowed booking date (tomorrow).
 * @param {Date} [baseDate=new Date()]
 * @returns {string} "YYYY-MM-DD"
 */
export function getMinBookingDate(baseDate = new Date()) {
  const tomorrow = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1);
  return formatDateToYYYYMMDD(tomorrow);
}

/**
 * Dynamic calculation of the latest allowed booking date (30 days ahead).
 * @param {Date} [baseDate=new Date()]
 * @param {number} [daysAhead=30]
 * @returns {string} "YYYY-MM-DD"
 */
export function getMaxBookingDate(baseDate = new Date(), daysAhead = 30) {
  const maxDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + daysAhead);
  return formatDateToYYYYMMDD(maxDate);
}

/**
 * Validates an appointment date string against Gregorian calendar rules and allowed booking window.
 * 
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {Date} [baseDate=new Date()] - Current date reference
 * @returns {{ isValid: boolean, error?: string, year?: number, month?: number, day?: number }}
 */
export function validateAppointmentDate(dateStr, baseDate = new Date()) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return { isValid: false, error: 'Please enter a valid date in YYYY-MM-DD format.' };
  }

  const [yearStr, monthStr, dayStr] = dateStr.trim().split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month in appointment date.' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: `Invalid day in appointment date (Month ${month} has ${daysInMonth} days).` };
  }

  const minDateStr = getMinBookingDate(baseDate);
  const maxDateStr = getMaxBookingDate(baseDate, 30);

  if (dateStr < minDateStr) {
    return { isValid: false, error: 'Appointments must be scheduled at least 1 day in advance (tomorrow onwards).' };
  }

  if (dateStr > maxDateStr) {
    return { isValid: false, error: 'Appointments can only be scheduled up to 30 days in advance.' };
  }

  return { isValid: true, year, month, day };
}

/**
 * Validates a selected time slot string.
 * 
 * @param {string} slotStr 
 * @param {string[]} [allowedSlots=APPROVED_TIME_SLOTS] 
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateTimeSlot(slotStr, allowedSlots = APPROVED_TIME_SLOTS) {
  if (typeof slotStr !== 'string' || !allowedSlots.includes(slotStr.trim())) {
    return { isValid: false, error: `Invalid time slot. Please choose an available slot.` };
  }
  return { isValid: true };
}

/**
 * Checks whether an active booking already exists for the given doctor, date, and slot.
 * Cancelled bookings do NOT reserve slots and are ignored.
 * 
 * @param {Array} appointments 
 * @param {Object} query 
 * @param {string} query.doctorId 
 * @param {string} query.date 
 * @param {string} query.timeSlot 
 * @param {string} [query.excludeAppointmentId=null] - ID to exclude (used during rescheduling)
 * @returns {boolean} True if an active conflicting booking exists
 */
export function checkDuplicateActiveBooking(appointments, { doctorId, date, timeSlot, excludeAppointmentId = null }) {
  if (!Array.isArray(appointments)) return false;
  return appointments.some((apt) => {
    if (!apt || typeof apt !== 'object') return false;
    if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
    const isActive = apt.status === 'confirmed' || apt.status === 'rescheduled';
    return isActive && apt.doctorId === doctorId && apt.date === date && apt.timeSlot === timeSlot;
  });
}

/**
 * Sanitizes and validates appointments loaded from storage to prevent crashes on malformed data.
 * 
 * @param {*} rawList 
 * @returns {Array} Clean array of valid appointment objects
 */
export function sanitizeLoadedAppointments(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.filter((item) => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.doctorId === 'string' &&
      typeof item.date === 'string' &&
      typeof item.timeSlot === 'string' &&
      ['confirmed', 'rescheduled', 'cancelled'].includes(item.status)
    );
  });
}

/**
 * AppointmentProvider: Manages simulated doctor appointment bookings with local storage persistence.
 */
export function AppointmentProvider({ children }) {
  // Initial state: strictly empty array []. Never pre-seed demo bookings.
  const [appointments, setAppointments] = useState(() => {
    const stored = storage.get('appointments', []);
    return sanitizeLoadedAppointments(stored);
  });

  // Persist appointments to localStorage whenever they change
  useEffect(() => {
    storage.set('appointments', appointments);
  }, [appointments]);

  // Reset in-memory state to pristine empty array
  const resetAppointmentState = useCallback(() => {
    setAppointments([]);
  }, []);

  // Split into Upcoming (Active) and Past/Cancelled appointments
  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.status === 'confirmed' || apt.status === 'rescheduled')
      .sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot));
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.status === 'cancelled')
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [appointments]);

  /**
   * Helper to check if a specific slot is available for booking.
   */
  const isSlotAvailable = useCallback((doctorId, date, timeSlot, excludeAppointmentId = null) => {
    return !checkDuplicateActiveBooking(appointments, { doctorId, date, timeSlot, excludeAppointmentId });
  }, [appointments]);

  /**
   * Look up an appointment by its ID.
   */
  const getAppointmentById = useCallback((appointmentId) => {
    if (!appointmentId) return null;
    return appointments.find((apt) => apt.id === appointmentId) || null;
  }, [appointments]);

  /**
   * Book a new simulated demo appointment with full validation and duplicate prevention.
   */
  const bookAppointment = useCallback(({ doctorId, date, timeSlot, mode = 'video', patientName = 'Demo Patient' }) => {
    // 1. Doctor existence check
    const doctor = getDoctorById(doctorId);
    if (!doctor) {
      return { success: false, error: 'Selected specialist profile could not be found.' };
    }

    // 2. Mode validation
    if (!['video', 'in_clinic'].includes(mode) || !doctor.supportedModes.includes(mode)) {
      return { success: false, error: `The selected consultation mode (${mode}) is not supported by this specialist.` };
    }

    // 3. Date validation
    const dateValidation = validateAppointmentDate(date);
    if (!dateValidation.isValid) {
      return { success: false, error: dateValidation.error };
    }

    // 4. Time slot validation
    const slotValidation = validateTimeSlot(timeSlot);
    if (!slotValidation.isValid) {
      return { success: false, error: slotValidation.error };
    }

    // 5. Duplicate active booking check
    if (checkDuplicateActiveBooking(appointments, { doctorId, date, timeSlot })) {
      return {
        success: false,
        error: `This time slot (${timeSlot} on ${date}) is already booked with ${doctor.name}. Please select another slot.`
      };
    }

    // 6. Assemble clean, minimized demo appointment record
    const nowIso = new Date().toISOString();
    const newAppointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialtyLabel,
      title: doctor.title,
      mode,
      date,
      timeSlot,
      simulatedFee: doctor.simulatedFee,
      simulatedFeeFormatted: doctor.simulatedFeeFormatted,
      clinicName: mode === 'in_clinic' ? doctor.clinicName : 'Online Tele-Suite (Simulated)',
      clinicLocation: mode === 'in_clinic' ? doctor.clinicLocation : 'Telehealth Video Consultation (Simulated Demo)',
      patientName: (patientName || 'Demo Patient').trim() || 'Demo Patient',
      status: 'confirmed',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // 7. Commit state
    setAppointments((prev) => [newAppointment, ...prev]);

    return {
      success: true,
      appointment: newAppointment,
      message: `Demo appointment confirmed with ${doctor.name} on ${date} at ${timeSlot}!`
    };
  }, [appointments]);

  /**
   * Cancel an existing active appointment.
   * Cancelling updates status to 'cancelled' and frees the slot.
   */
  const cancelAppointment = useCallback((appointmentId, reasonNote = '') => {
    if (!appointmentId) {
      return { success: false, error: 'Invalid appointment ID provided.' };
    }

    const existing = appointments.find((apt) => apt.id === appointmentId);
    if (!existing) {
      return { success: false, error: 'Appointment record not found.' };
    }

    if (existing.status === 'cancelled') {
      return { success: false, error: 'This appointment is already cancelled.' };
    }

    const nowIso = new Date().toISOString();
    let updatedRecord = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          updatedRecord = {
            ...apt,
            status: 'cancelled',
            cancelReason: reasonNote.trim() || 'Cancelled by demo user',
            updatedAt: nowIso
          };
          return updatedRecord;
        }
        return apt;
      })
    );

    return {
      success: true,
      appointment: updatedRecord,
      message: `Demo appointment with ${existing.doctorName} has been cancelled.`
    };
  }, [appointments]);

  /**
   * Atomically reschedule an existing appointment to a new date and/or time slot.
   * Retains the existing appointment ID and guarantees atomic failure without mutating original state if conflict occurs.
   */
  const rescheduleAppointment = useCallback((appointmentId, { date, timeSlot, mode }) => {
    if (!appointmentId) {
      return { success: false, error: 'Invalid appointment ID.' };
    }

    const existing = appointments.find((apt) => apt.id === appointmentId);
    if (!existing) {
      return { success: false, error: 'Appointment not found.' };
    }

    if (existing.status === 'cancelled') {
      return { success: false, error: 'Cannot reschedule a cancelled appointment. Please book a new consultation.' };
    }

    const targetDate = date || existing.date;
    const targetSlot = timeSlot || existing.timeSlot;
    const targetMode = mode || existing.mode;

    const doctor = getDoctorById(existing.doctorId);
    if (!doctor) {
      return { success: false, error: 'Associated doctor profile not found.' };
    }

    // Validate mode
    if (!['video', 'in_clinic'].includes(targetMode) || !doctor.supportedModes.includes(targetMode)) {
      return { success: false, error: `The consultation mode (${targetMode}) is not supported by ${doctor.name}.` };
    }

    // Validate target date
    const dateValidation = validateAppointmentDate(targetDate);
    if (!dateValidation.isValid) {
      return { success: false, error: dateValidation.error };
    }

    // Validate target time slot
    const slotValidation = validateTimeSlot(targetSlot);
    if (!slotValidation.isValid) {
      return { success: false, error: slotValidation.error };
    }

    // Check duplicate conflict (excluding current appointment ID)
    if (checkDuplicateActiveBooking(appointments, {
      doctorId: existing.doctorId,
      date: targetDate,
      timeSlot: targetSlot,
      excludeAppointmentId: appointmentId
    })) {
      return {
        success: false,
        error: `Slot conflict: ${doctor.name} already has an active booking on ${targetDate} at ${targetSlot}. Original appointment remains unchanged.`
      };
    }

    // Atomic update
    const nowIso = new Date().toISOString();
    let updatedRecord = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          updatedRecord = {
            ...apt,
            date: targetDate,
            timeSlot: targetSlot,
            mode: targetMode,
            clinicName: targetMode === 'in_clinic' ? doctor.clinicName : 'Online Tele-Suite (Simulated)',
            clinicLocation: targetMode === 'in_clinic' ? doctor.clinicLocation : 'Telehealth Video Consultation (Simulated Demo)',
            status: 'rescheduled',
            updatedAt: nowIso
          };
          return updatedRecord;
        }
        return apt;
      })
    );

    return {
      success: true,
      appointment: updatedRecord,
      message: `Demo appointment rescheduled to ${targetDate} at ${targetSlot}!`
    };
  }, [appointments]);

  return (
    <AppointmentContext.Provider value={{
      appointments,
      upcomingAppointments,
      pastAppointments,
      isSlotAvailable,
      getAppointmentById,
      bookAppointment,
      cancelAppointment,
      rescheduleAppointment,
      resetAppointmentState
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

/**
 * Custom hook to access AppointmentContext.
 */
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
