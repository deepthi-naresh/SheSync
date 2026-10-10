import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Video, 
  MapPin, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import Modal from '../common/Modal';
import { 
  useAppointments, 
  getMinBookingDate, 
  getMaxBookingDate, 
  APPROVED_TIME_SLOTS 
} from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import './AppointmentsUI.css';

export default function BookingModal({ isOpen, onClose, doctor, onBookingSuccess }) {
  const { bookAppointment } = useAppointments();
  const { showToast } = useToast();

  const minDate = getMinBookingDate();
  const maxDate = getMaxBookingDate();

  const [selectedMode, setSelectedMode] = useState('video');
  const [selectedDate, setSelectedDate] = useState(minDate);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientLabel, setPatientLabel] = useState('Demo Patient');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form when modal opens or doctor changes
  useEffect(() => {
    if (doctor) {
      const initialMode = doctor.supportedModes.includes('video') ? 'video' : 'in_clinic';
      setSelectedMode(initialMode);
      setSelectedDate(minDate);
      const validSlots = doctor.availableSlots.filter(s => APPROVED_TIME_SLOTS.includes(s));
      setSelectedSlot(validSlots.length > 0 ? validSlots[0] : '');
      setPatientLabel('Demo Patient');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [doctor, isOpen, minDate]);

  if (!isOpen || !doctor) return null;

  const validDoctorSlots = (doctor.availableSlots || []).filter((s) => APPROVED_TIME_SLOTS.includes(s));

  const handleBookingSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!selectedDate) {
      setErrorMessage('Please choose an appointment date.');
      return;
    }

    if (!selectedSlot) {
      setErrorMessage('Please select a preferred time slot.');
      return;
    }

    setIsSubmitting(true);

    const result = bookAppointment({
      doctorId: doctor.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      mode: selectedMode,
      patientName: patientLabel
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    showToast(result.message, 'success');
    if (onBookingSuccess) {
      onBookingSuccess(result.appointment);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Demo Consultation"
      maxWidth="540px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleBookingSubmit}
            disabled={isSubmitting || !selectedDate || !selectedSlot}
          >
            <CalendarDays size={16} /> Confirm Demo Booking ({doctor.simulatedFeeFormatted})
          </button>
        </>
      }
    >
      <form className="booking-form-wrap" onSubmit={handleBookingSubmit}>
        {/* Doctor Summary Banner */}
        <div className="booking-doctor-banner">
          <div>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '2px' }}>
              Simulated Specialist
            </span>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {doctor.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {doctor.specialtyLabel} • {doctor.simulatedFeeFormatted}
            </div>
          </div>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="form-error-alert" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode Selector (if multiple supported) */}
        <div className="form-group-custom">
          <label className="form-label-custom">Select Consultation Mode:</label>
          <div className="mode-pills-row">
            {doctor.supportedModes.includes('video') && (
              <button
                type="button"
                className={`mode-pill-btn ${selectedMode === 'video' ? 'active' : ''}`}
                onClick={() => setSelectedMode('video')}
              >
                <Video size={16} /> Simulated Video Call
              </button>
            )}
            {doctor.supportedModes.includes('in_clinic') && (
              <button
                type="button"
                className={`mode-pill-btn ${selectedMode === 'in_clinic' ? 'active' : ''}`}
                onClick={() => setSelectedMode('in_clinic')}
              >
                <MapPin size={16} /> In-Clinic (Simulated)
              </button>
            )}
          </div>
        </div>

        {/* Date Selection */}
        <div className="form-group-custom">
          <label htmlFor="appointment-date-input" className="form-label-custom">
            Select Date (Tomorrow through 30 days ahead):
          </label>
          <input
            id="appointment-date-input"
            type="date"
            className="input-date-custom"
            min={minDate}
            max={maxDate}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setErrorMessage('');
            }}
            required
          />
        </div>

        {/* Time Slot Picker */}
        <div className="form-group-custom">
          <label className="form-label-custom">Select Available Time Slot:</label>
          <div className="slots-grid-picker">
            {validDoctorSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`slot-select-btn ${selectedSlot === slot ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSlot(slot);
                  setErrorMessage('');
                }}
              >
                <Clock size={13} /> {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Non-Sensitive Patient Display Label */}
        <div className="form-group-custom">
          <label htmlFor="patient-label-input" className="form-label-custom">
            Patient Display Label (Demo):
          </label>
          <input
            id="patient-label-input"
            type="text"
            className="input-text-custom"
            placeholder="e.g. Demo Patient"
            value={patientLabel}
            maxLength={30}
            onChange={(e) => setPatientLabel(e.target.value)}
          />
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
            No phone, email, or clinical information is collected or required.
          </span>
        </div>

        {/* Demo Simulation Safeguard Notice */}
        <div className="demo-disclaimer-box" style={{ marginTop: '4px' }}>
          <ShieldCheck size={16} color="var(--accent-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.78rem' }}>
            <strong>Demonstration Simulation:</strong> No real payment, doctor consultation, or hospital booking is made. This record is stored locally in your browser for hackathon evaluation.
          </div>
        </div>
      </form>
    </Modal>
  );
}
