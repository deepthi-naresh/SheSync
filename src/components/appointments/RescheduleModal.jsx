import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Clock, 
  Video, 
  MapPin, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';
import Modal from '../common/Modal';
import { 
  useAppointments, 
  getMinBookingDate, 
  getMaxBookingDate, 
  APPROVED_TIME_SLOTS 
} from '../../context/AppointmentContext';
import { getDoctorById } from '../../data/doctorsData';
import { useToast } from '../../context/ToastContext';
import './AppointmentsUI.css';

export default function RescheduleModal({ isOpen, onClose, appointment, onRescheduleSuccess }) {
  const { rescheduleAppointment } = useAppointments();
  const { showToast } = useToast();

  const minDate = getMinBookingDate();
  const maxDate = getMaxBookingDate();

  const [selectedMode, setSelectedMode] = useState('video');
  const [selectedDate, setSelectedDate] = useState(minDate);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve associated doctor record to get supported modes and available slots
  const doctor = appointment ? getDoctorById(appointment.doctorId) : null;

  useEffect(() => {
    if (appointment) {
      setSelectedMode(appointment.mode || 'video');
      setSelectedDate(appointment.date >= minDate ? appointment.date : minDate);
      setSelectedSlot(appointment.timeSlot || '');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [appointment, isOpen, minDate]);

  if (!isOpen || !appointment || !doctor) return null;

  const validDoctorSlots = (doctor.availableSlots || []).filter((s) => APPROVED_TIME_SLOTS.includes(s));

  const handleRescheduleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!selectedDate) {
      setErrorMessage('Please select a new appointment date.');
      return;
    }

    if (!selectedSlot) {
      setErrorMessage('Please choose an available time slot.');
      return;
    }

    setIsSubmitting(true);

    const result = rescheduleAppointment(appointment.id, {
      date: selectedDate,
      timeSlot: selectedSlot,
      mode: selectedMode
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    showToast(result.message, 'success');
    if (onRescheduleSuccess) {
      onRescheduleSuccess(result.appointment);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Demo Consultation"
      maxWidth="540px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleRescheduleSubmit}
            disabled={isSubmitting || !selectedDate || !selectedSlot}
          >
            <RotateCcw size={16} /> Confirm Reschedule
          </button>
        </>
      }
    >
      <form className="booking-form-wrap" onSubmit={handleRescheduleSubmit}>
        {/* Doctor Context Banner */}
        <div className="booking-doctor-banner">
          <div>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem', marginBottom: '2px' }}>
              Rescheduling Consultation
            </span>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {doctor.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Current: {appointment.date} at {appointment.timeSlot} ({appointment.mode === 'in_clinic' ? 'In-Clinic' : 'Video Call'})
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

        {/* Mode Selector */}
        {doctor.supportedModes.length > 1 && (
          <div className="form-group-custom">
            <label className="form-label-custom">Select Consultation Mode:</label>
            <div className="mode-pills-row">
              {doctor.supportedModes.includes('video') && (
                <button
                  type="button"
                  className={`mode-pill-btn ${selectedMode === 'video' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('video')}
                >
                  <Video size={16} /> Video Call (Simulated)
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
        )}

        {/* New Date Selection */}
        <div className="form-group-custom">
          <label htmlFor="reschedule-date-input" className="form-label-custom">
            Select New Date (Tomorrow through 30 days ahead):
          </label>
          <input
            id="reschedule-date-input"
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

        {/* New Time Slot Picker */}
        <div className="form-group-custom">
          <label className="form-label-custom">Select New Time Slot:</label>
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

        {/* Reschedule Safety Notice */}
        <div className="demo-disclaimer-box">
          <ShieldCheck size={16} color="var(--accent-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.78rem' }}>
            <strong>Atomic Reschedule Guarantee:</strong> If the chosen slot has a conflict with an active booking, the reschedule will be safely rejected and your existing appointment will remain unchanged.
          </div>
        </div>
      </form>
    </Modal>
  );
}
