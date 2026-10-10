/**
 * SheSync — RFC 5545 Calendar File (.ics) Generator for Simulated Consultations
 * 
 * IMPORTANT DEMO & PRIVACY SAFEGUARDS:
 * 1. All generated calendar events are strictly labeled as "(Simulated Demo)".
 * 2. Data Minimization: Zero patient names, contact numbers, emails, symptoms, or
 *    personal identifiers are embedded in calendar files.
 * 3. Date-Time Semantics: Uses RFC 5545 Floating Local Time format (YYYYMMDDTHHMMSS)
 *    which ensures imported events render at the exact local time selected by the
 *    user across all calendar clients (Apple Calendar, Google Calendar, Outlook)
 *    without unexpected timezone conversion offsets.
 * 4. Pure Function: Completely decoupled from browser DOM / window APIs for full
 *    testability in Node / Vitest and browser environments.
 */

/**
 * Escapes characters per RFC 5545 Section 3.3.11 (Text).
 * Backslashes, semicolons, commas, and line breaks are safely escaped.
 * 
 * @param {string} text - Raw string
 * @returns {string} Escaped string
 */
export function escapeICSText(text = '') {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\n|\r/g, '\\n');
}

/**
 * Folds lines exceeding 75 octets per RFC 5545 Section 3.1.
 * Inserts CRLF followed by a single space.
 * 
 * @param {string} line - Single unfolded iCalendar line
 * @returns {string} Folded line
 */
export function foldICSLine(line = '') {
  const MAX_LINE_LENGTH = 75;
  if (line.length <= MAX_LINE_LENGTH) {
    return line;
  }

  let folded = '';
  let remaining = line;

  // First chunk up to 75 characters
  folded += remaining.slice(0, MAX_LINE_LENGTH);
  remaining = remaining.slice(MAX_LINE_LENGTH);

  // Subsequent chunks up to 74 characters (because of leading space)
  while (remaining.length > 0) {
    folded += '\r\n ' + remaining.slice(0, MAX_LINE_LENGTH - 1);
    remaining = remaining.slice(MAX_LINE_LENGTH - 1);
  }

  return folded;
}

/**
 * Parses time strings formatted as "HH:MM AM/PM" into 24-hour { hours, minutes }.
 * 
 * @param {string} timeSlotStr - e.g. "09:30 AM", "02:00 PM"
 * @returns {{ hours: number, minutes: number }}
 * @throws {Error} If time string format is invalid
 */
export function parseTimeSlot(timeSlotStr) {
  if (typeof timeSlotStr !== 'string') {
    throw new Error(`Invalid time slot: expected string, got ${typeof timeSlotStr}`);
  }

  const match = timeSlotStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time slot format: "${timeSlotStr}". Expected "HH:MM AM/PM" (e.g. "10:30 AM")`);
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    throw new Error(`Time slot out of valid range: "${timeSlotStr}"`);
  }

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  } else if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

/**
 * Validates a date string in "YYYY-MM-DD" format and returns validated components.
 * 
 * @param {string} dateStr - e.g. "2026-10-15"
 * @returns {{ year: number, month: number, day: number }}
 * @throws {Error} If date format or calendar date is invalid
 */
export function parseDateString(dateStr) {
  if (typeof dateStr !== 'string') {
    throw new Error(`Invalid date: expected string, got ${typeof dateStr}`);
  }

  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid date format: "${dateStr}". Expected "YYYY-MM-DD"`);
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month in date: "${dateStr}"`);
  }

  // Check days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    throw new Error(`Invalid day in date: "${dateStr}" (month ${month} has ${daysInMonth} days)`);
  }

  return { year, month, day };
}

/**
 * Formats components into RFC 5545 Floating Local Time format: YYYYMMDDTHHMMSS
 * 
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {number} hours 
 * @param {number} minutes 
 * @param {number} seconds 
 * @returns {string} e.g. "20261015T103000"
 */
export function formatICSDateTime(year, month, day, hours, minutes, seconds = 0) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = String(year).padStart(4, '0');
  const m = pad(month);
  const d = pad(day);
  const h = pad(hours);
  const min = pad(minutes);
  const s = pad(seconds);
  return `${y}${m}${d}T${h}${min}${s}`;
}

/**
 * Generates an RFC 5545 standard .ics file string for a simulated appointment.
 * 
 * @param {Object} appointment
 * @param {string} appointment.id - Appointment ID
 * @param {string} appointment.doctorName - Doctor name
 * @param {string} [appointment.specialty] - Specialty description
 * @param {string} appointment.date - "YYYY-MM-DD"
 * @param {string} appointment.timeSlot - "HH:MM AM/PM"
 * @param {string} [appointment.mode] - "video" | "in_clinic"
 * @param {string} [appointment.clinicLocation] - Clinic address if in-clinic
 * @param {number} [appointment.durationMinutes=30] - Duration in minutes (default: 30)
 * @returns {string} Valid RFC 5545 .ics text content
 */
export function generateICSContent(appointment) {
  if (!appointment || typeof appointment !== 'object') {
    throw new Error('generateICSContent: appointment object is required');
  }

  const {
    id = `apt-${Date.now()}`,
    doctorName = 'Specialist',
    specialty = 'Women’s Health Consultation',
    date,
    timeSlot,
    mode = 'video',
    clinicLocation = '',
    durationMinutes = 30
  } = appointment;

  // Validate date and slot explicitly
  const { year, month, day } = parseDateString(date);
  const { hours: startHours, minutes: startMinutes } = parseTimeSlot(timeSlot);

  // Calculate start and end times in local representation
  const startDate = new Date(year, month - 1, day, startHours, startMinutes, 0);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const dtStart = formatICSDateTime(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
    0
  );

  const dtEnd = formatICSDateTime(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
    0
  );

  // Create deterministic or current DTSTAMP
  const now = new Date();
  const dtStamp = formatICSDateTime(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ) + 'Z';

  const uid = `shesync-demo-${id}@shesync.local`;
  const summary = `SheSync Demo Consultation - ${doctorName} (Simulated)`;

  const modeLabel = mode === 'in_clinic' ? 'In-Clinic (Simulated Demo)' : 'Video Consultation (Simulated Demo)';
  const locationText = mode === 'in_clinic' && clinicLocation 
    ? clinicLocation 
    : 'Simulated Video Tele-Consultation (SheSync Demo)';

  const description = [
    '=== SHESYNC SIMULATED DEMO APPOINTMENT ===',
    'Demonstration consultation scheduled for the SITAMS x HackSphere hackathon.',
    'NOTICE: No real medical consultation, telemedicine service, or healthcare visit is provided.',
    '',
    `Specialist: ${doctorName}`,
    `Specialty: ${specialty}`,
    `Consultation Mode: ${modeLabel}`,
    `Location: ${locationText}`,
    '',
    'This is a local demonstration reminder created by SheSync.'
  ].join('\n');

  // Build RFC 5545 lines
  const rawLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SheSync//Women\'s Wellness Hackathon Demo//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSText(summary)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(locationText)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  // Fold each line if exceeding 75 characters, and join with CRLF per RFC 5545
  const foldedLines = rawLines.map((line) => foldICSLine(line));
  return foldedLines.join('\r\n') + '\r\n';
}
