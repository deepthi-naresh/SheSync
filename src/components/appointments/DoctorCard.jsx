import React from 'react';
import { 
  Star, 
  Video, 
  MapPin, 
  Clock, 
  UserCheck, 
  Info, 
  ShieldCheck, 
  CalendarDays 
} from 'lucide-react';
import './AppointmentsUI.css';

/**
 * Extracts initials from doctor name (e.g. "Dr. Ananya Sharma" -> "AS").
 */
function getDoctorInitials(name = '') {
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DoctorCard({ doctor, onViewProfile, onBookAppointment }) {
  if (!doctor) return null;

  const initials = getDoctorInitials(doctor.name);

  return (
    <div className="doctor-card">
      {/* Top Section: Avatar & Header */}
      <div className="doctor-card-top">
        <div className="doctor-avatar-initials" aria-hidden="true">
          {initials}
        </div>
        <div className="doctor-info-header">
          <div className="doctor-demo-tag">
            <span className="badge badge-amber">Simulated Profile</span>
          </div>
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-title-text">{doctor.title}</p>
        </div>
      </div>

      {/* Meta Row: Experience, Rating, Modes */}
      <div className="doctor-meta-row">
        <div className="doctor-meta-item" title="Simulated Clinical Experience">
          <span className="badge badge-plum">{doctor.experienceYears}</span>
        </div>
        <div className="doctor-meta-item">
          <Star size={13} color="var(--accent-amber)" fill="var(--accent-amber)" />
          <span>{doctor.rating}</span>
        </div>
        <div className="doctor-meta-item">
          {doctor.supportedModes.includes('in_clinic') ? (
            <span className="badge badge-sage" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={11} /> In-Clinic & Video
            </span>
          ) : (
            <span className="badge badge-lavender" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Video size={11} /> Video Call Only
            </span>
          )}
        </div>
      </div>

      {/* Bio Snippet */}
      <p className="doctor-bio-snippet">{doctor.bio}</p>

      {/* Available Slots Preview */}
      <div className="doctor-slots-preview">
        <span className="slots-preview-label">Sample Demo Slots:</span>
        <div className="slots-chips-wrap">
          {doctor.availableSlots && doctor.availableSlots.slice(0, 4).map((slot) => (
            <span key={slot} className="slot-preview-chip">
              {slot}
            </span>
          ))}
          {doctor.availableSlots && doctor.availableSlots.length > 4 && (
            <span className="slot-preview-chip" style={{ opacity: 0.7 }}>
              +{doctor.availableSlots.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Fee & Action Buttons */}
      <div className="doctor-card-footer">
        <div className="doctor-fee-box">
          <span className="fee-label">Consultation Fee</span>
          <span className="fee-amount">{doctor.simulatedFeeFormatted}</span>
        </div>

        <div className="doctor-actions-group">
          <button
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
            onClick={() => onViewProfile && onViewProfile(doctor)}
            aria-label={`View profile for ${doctor.name}`}
          >
            <Info size={14} /> Profile
          </button>
          <button
            className="btn btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            onClick={() => onBookAppointment && onBookAppointment(doctor)}
            aria-label={`Book demo consultation with ${doctor.name}`}
          >
            <CalendarDays size={14} /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}
