import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCycle } from '../../context/CycleContext';
import { useToast } from '../../context/ToastContext';
import { validateCycleInputs, formatDateISO } from '../../utils/cycleCalculations';

export default function CycleSettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings, logPeriodStart } = useCycle();
  const { showToast } = useToast();

  const [startDate, setStartDate] = useState(settings.lastPeriodStart || '');
  const [cycleLength, setCycleLength] = useState(settings.cycleLength || 28);
  const [periodDuration, setPeriodDuration] = useState(settings.periodDuration || 5);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setStartDate(settings.lastPeriodStart || '');
      setCycleLength(settings.cycleLength || 28);
      setPeriodDuration(settings.periodDuration || 5);
      setErrors({});
    }
  }, [isOpen, settings]);

  const handleSave = (e) => {
    e.preventDefault();

    const validation = validateCycleInputs({
      startDate,
      cycleLength,
      periodDuration
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Please fix the errors in the cycle settings form.', 'warning');
      return;
    }

    // Save settings and log new start date
    updateSettings({
      lastPeriodStart: startDate,
      cycleLength: Number(cycleLength),
      periodDuration: Number(periodDuration)
    });

    logPeriodStart(startDate, null, 'Updated in cycle settings', Number(cycleLength));

    showToast('Cycle settings and start date updated successfully!', 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cycle Settings & Parameters"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <CheckCircle2 size={16} /> Save Cycle Settings
          </button>
        </>
      }
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Most Recent Period Start Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="cycle-start-date">
            <span>Last Period Start Date</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)' }}>* Required</span>
          </label>
          <input
            id="cycle-start-date"
            type="date"
            className="form-input-date"
            value={startDate}
            max={formatDateISO(new Date())}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          {errors.startDate && (
            <span style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '2px' }}>
              {errors.startDate}
            </span>
          )}
        </div>

        {/* Average Cycle Length */}
        <div className="form-group">
          <label className="form-label" htmlFor="cycle-length-input">
            <span>Average Cycle Length (Days)</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {cycleLength} Days
            </span>
          </label>
          <input
            id="cycle-length-input"
            type="number"
            min="21"
            max="50"
            className="form-input-date"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            required
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Normal physiological duration is typically between 21 and 35 days (Standard: 28 days).
          </span>
          {errors.cycleLength && (
            <span style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '2px' }}>
              {errors.cycleLength}
            </span>
          )}
        </div>

        {/* Typical Period Bleeding Duration */}
        <div className="form-group">
          <label className="form-label" htmlFor="period-duration-input">
            <span>Period Bleeding Duration (Days)</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              {periodDuration} Days
            </span>
          </label>
          <input
            id="period-duration-input"
            type="number"
            min="2"
            max="10"
            className="form-input-date"
            value={periodDuration}
            onChange={(e) => setPeriodDuration(e.target.value)}
            required
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Bleeding typically lasts between 3 and 7 days.
          </span>
          {errors.periodDuration && (
            <span style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '2px' }}>
              {errors.periodDuration}
            </span>
          )}
        </div>

        <div style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid var(--border-color)' }}>
          <Info size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            All settings are stored 100% locally on your device. Predictions automatically adjust if you log variations in your cycle history.
          </span>
        </div>
      </form>
    </Modal>
  );
}
