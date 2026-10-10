import React from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  RotateCcw, 
  XCircle, 
  CalendarPlus, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import './AppointmentsUI.css';

/**
 * Formats ISO date "YYYY-MM-DD" to human readable "Thu, 15 Oct 2026".
 */
function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(n => parseInt(n, 10));
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function AppointmentCard({ appointment, onReschedule, onCancel, onExportCalendar }) {
  if (!appointment) return null;

  const isCancelled = appointment.status === 'cancelled';
  const isRescheduled = appointment.status === 'rescheduled';

  return (
    <div className={`appointment-card ${isCancelled ? 'appointment-card-cancelled' : ''}`}>
      {/* Header Row: Doctor Info & Status Badge */}
      <div className="apt-header-row">
        <div>
          <h3 className="apt-doctor-title">{appointment.doctorName}</h3>
          <p className="apt-specialty-sub">{appointment.specialty}</p>
        </div>

        <div>
          {isCancelled ? (
            <span className="badge badge-rose">
              <XCircle size={12} /> Cancelled (Demo)
            </span>
          ) : isRescheduled ? (
            <span className="badge badge-amber">
              <RotateCcw size={12} /> Rescheduled (Demo)
            </span>
          ) : (
            <span className="badge badge-sage">
              <CheckCircle2 size={12} /> Confirmed (Demo)
            </span>
          )}
        </div>
      </div>

      {/* Details Box: Date, Time, Mode, Location */}
      <div className="apt-details-box">
        <div className="apt-detail-line">
          <Calendar size={15} color="var(--accent-primary)" />
          <span><strong>Date:</strong> {formatReadableDate(appointment.date)} ({appointment.date})</span>
        </div>
        <div className="apt-detail-line">
          <Clock size={15} color="var(--accent-sage)" />
          <span><strong>Time Slot:</strong> {appointment.timeSlot}</span>
        </div>
        <div className="apt-detail-line">
          {appointment.mode === 'in_clinic' ? (
            <>
              <MapPin size={15} color="var(--accent-amber)" />
              <span><strong>Mode:</strong> In-Clinic — {appointment.clinicLocation}</span>
            </>
          ) : (
            <>
              <Video size={15} color="var(--accent-lavender-deep)" />
              <span><strong>Mode:</strong> Video Consultation (Simulated Demo Link)</span>
            </>
          )}
        </div>
        <div className="apt-detail-line">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            <strong>Demo Fee:</strong> {appointment.simulatedFeeFormatted || `₹${appointment.simulatedFee} (Demo)`}
          </span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="apt-actions-row">
        {/* Calendar Export is available for active appointments */}
        {!isCancelled && (
          <button
            className="btn btn-outline"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => onExportCalendar && onExportCalendar(appointment)}
            title="Download RFC 5545 .ics calendar invite"
            aria-label={`Export .ics calendar invite for consultation with ${appointment.doctorName}`}
          >
            <CalendarPlus size={14} /> Add to Calendar (.ics)
          </button>
        )}

        {/* Reschedule & Cancel actions for active appointments */}
        {!isCancelled && (
          <>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => onReschedule && onReschedule(appointment)}
              aria-label={`Reschedule appointment with ${appointment.doctorName}`}
            >
              <RotateCcw size={14} /> Reschedule
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--accent-rose)' }}
              onClick={() => onCancel && onCancel(appointment)}
              aria-label={`Cancel appointment with ${appointment.doctorName}`}
            >
              <XCircle size={14} /> Cancel
            </button>
          </>
        )}

        {/* Cancelled badge label if cancelled */}
        {isCancelled && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            Slot released on {appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleDateString() : 'earlier'}
          </span>
        )}
      </div>
    </div>
  );
}
