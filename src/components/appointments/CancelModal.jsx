import React, { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useAppointments } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import './AppointmentsUI.css';

export default function CancelModal({ isOpen, onClose, appointment, onCancelSuccess }) {
  const { cancelAppointment } = useAppointments();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !appointment) return null;

  const handleConfirmCancel = () => {
    setIsSubmitting(true);
    setErrorMessage('');

    // Call cancelAppointment without collecting free-text sensitive data
    const result = cancelAppointment(appointment.id, 'Cancelled via demo interface');
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    showToast(result.message, 'info');
    if (onCancelSuccess) {
      onCancelSuccess(result.appointment);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Demo Consultation"
      maxWidth="480px"
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
            Keep Appointment
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
          >
            <XCircle size={16} /> Confirm Cancellation
          </button>
        </>
      }
    >
      <div className="cancel-dialog-body">
        <p>
          Are you sure you want to cancel your simulated consultation with{' '}
          <strong>{appointment.doctorName}</strong>?
        </p>

        {/* Appointment Snapshot */}
        <div className="booking-doctor-banner">
          <div style={{ fontSize: '0.88rem' }}>
            <div><strong>Specialist:</strong> {appointment.doctorName} ({appointment.specialty})</div>
            <div><strong>Scheduled Date:</strong> {appointment.date} at {appointment.timeSlot}</div>
            <div><strong>Mode:</strong> {appointment.mode === 'in_clinic' ? 'In-Clinic' : 'Video Call'}</div>
          </div>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="form-error-alert" role="alert">
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Informational Notice */}
        <div className="cancel-alert-warning">
          <ShieldCheck size={16} style={{ flexShrink: 0 }} />
          <span>
            Cancelling will mark this demo appointment as cancelled and release the time slot for new bookings. This action affects only your local demonstration state.
          </span>
        </div>
      </div>
    </Modal>
  );
}
