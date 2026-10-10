import React from 'react';
import { 
  Star, 
  Video, 
  MapPin, 
  Clock, 
  Languages, 
  Award, 
  CalendarDays, 
  AlertTriangle, 
  ShieldAlert 
} from 'lucide-react';
import Modal from '../common/Modal';
import './AppointmentsUI.css';

function getDoctorInitials(name = '') {
  const parts = name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DoctorDetailModal({ isOpen, onClose, doctor, onBook }) {
  if (!isOpen || !doctor) return null;

  const initials = getDoctorInitials(doctor.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Specialist Profile (Simulated Demo)"
      maxWidth="620px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              if (onBook) onBook(doctor);
            }}
          >
            <CalendarDays size={16} /> Book Demo Consultation ({doctor.simulatedFeeFormatted})
          </button>
        </>
      }
    >
      <div className="doctor-detail-container">
        {/* Hero Banner */}
        <div className="doctor-detail-hero">
          <div className="doctor-detail-avatar" aria-hidden="true">
            {initials}
          </div>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '4px' }}>
              Simulated Specialist Profile
            </span>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{doctor.name}</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{doctor.title}</p>
          </div>
        </div>

        {/* Clinical Biography */}
        <div className="detail-section">
          <div className="detail-section-title">
            <Award size={15} /> Clinical Focus & Bio
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {doctor.bio}
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            {doctor.credentials}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="detail-meta-grid">
          <div className="detail-meta-card">
            <div className="detail-meta-card-label">Experience</div>
            <div className="detail-meta-card-value">{doctor.experienceYears}</div>
          </div>
          <div className="detail-meta-card">
            <div className="detail-meta-card-label">Simulated Rating</div>
            <div className="detail-meta-card-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} color="var(--accent-amber)" fill="var(--accent-amber)" />
              {doctor.rating}
            </div>
          </div>
          <div className="detail-meta-card">
            <div className="detail-meta-card-label">Languages</div>
            <div className="detail-meta-card-value">{doctor.languages.join(', ')}</div>
          </div>
          <div className="detail-meta-card">
            <div className="detail-meta-card-label">Consultation Fee</div>
            <div className="detail-meta-card-value" style={{ color: 'var(--accent-primary)' }}>
              {doctor.simulatedFeeFormatted}
            </div>
          </div>
        </div>

        {/* Clinic Location & Supported Modes */}
        <div className="detail-section">
          <div className="detail-section-title">
            <MapPin size={15} /> Consultation Modes & Location
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem' }}>
            <div>
              <strong>Supported Modes:</strong>{' '}
              {doctor.supportedModes.map(m => m === 'in_clinic' ? 'In-Clinic (Simulated)' : 'Video Consultation (Simulated)').join(' & ')}
            </div>
            <div>
              <strong>Simulated Location:</strong> {doctor.clinicLocation}
            </div>
          </div>
        </div>

        {/* Available Sample Time Slots */}
        <div className="detail-section">
          <div className="detail-section-title">
            <Clock size={15} /> Approved Demo Slots
          </div>
          <div className="slots-chips-wrap">
            {doctor.availableSlots.map((slot) => (
              <span key={slot} className="slot-preview-chip">
                {slot}
              </span>
            ))}
          </div>
        </div>

        {/* Simulation Disclaimer Alert */}
        <div className="demo-disclaimer-box">
          <ShieldAlert size={18} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Educational Demonstration Only:</strong> This profile, hospital affiliation, medical credentials, and consultation slots are entirely simulated for the SITAMS × HackSphere hackathon. No real clinical consultations, doctor verifications, or medical diagnosis services are provided.
          </div>
        </div>
      </div>
    </Modal>
  );
}
