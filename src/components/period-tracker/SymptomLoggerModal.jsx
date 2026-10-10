import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Calendar 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCycle } from '../../context/CycleContext';
import { useToast } from '../../context/ToastContext';
import { formatDateISO } from '../../utils/cycleCalculations';
import './SymptomLogger.css';

const FLOW_OPTIONS = ['None', 'Spotting', 'Light', 'Medium', 'Heavy'];
const ENERGY_OPTIONS = ['High', 'Moderate', 'Low', 'Drained'];
const CERVICAL_MUCUS_OPTIONS = ['None', 'Dry', 'Sticky', 'Creamy', 'Egg-White / Fertile', 'Watery'];
const MOOD_OPTIONS = [
  'Happy', 'Calm', 'Focused', 'Energetic', 
  'Sensitive', 'Irritable', 'Anxious', 'Fatigued', 
  'Bloated', 'Cramps', 'Headache', 'Cravings'
];

export default function SymptomLoggerModal({ isOpen, onClose, initialDate }) {
  const { logDailySymptom, deleteSymptomLog, getSymptomForDate } = useCycle();
  const { showToast } = useToast();

  const [date, setDate] = useState(() => formatDateISO(initialDate || new Date()));
  const [flow, setFlow] = useState('None');
  const [painLevel, setPainLevel] = useState(1);
  const [energy, setEnergy] = useState('Moderate');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [cervicalMucus, setCervicalMucus] = useState('None');
  const [notes, setNotes] = useState('');
  const [existingId, setExistingId] = useState(null);

  // When modal opens or date changes, load existing log if present
  useEffect(() => {
    if (initialDate) {
      const formatted = formatDateISO(initialDate);
      setDate(formatted);
      loadDateData(formatted);
    }
  }, [initialDate, isOpen]);

  const loadDateData = (targetDate) => {
    const existing = getSymptomForDate(targetDate);
    if (existing) {
      setExistingId(existing.id);
      setFlow(existing.flow || 'None');
      setPainLevel(existing.painLevel || 1);
      setEnergy(existing.energy || 'Moderate');
      setSelectedMoods(Array.isArray(existing.moods) ? existing.moods : []);
      setCervicalMucus(existing.cervicalMucus || 'None');
      setNotes(existing.notes || '');
    } else {
      setExistingId(null);
      setFlow('None');
      setPainLevel(1);
      setEnergy('Moderate');
      setSelectedMoods([]);
      setCervicalMucus('None');
      setNotes('');
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    loadDateData(newDate);
  };

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!date) {
      showToast('Please select a valid date.', 'error');
      return;
    }

    const success = logDailySymptom({
      id: existingId,
      date,
      flow,
      painLevel,
      energy,
      moods: selectedMoods,
      cervicalMucus,
      notes
    });

    if (success) {
      showToast(`Daily wellness log saved for ${date}!`, 'success');
      onClose();
    } else {
      showToast('Failed to save symptom log.', 'error');
    }
  };

  const handleDelete = () => {
    if (existingId || date) {
      deleteSymptomLog(date);
      showToast(`Log for ${date} removed.`, 'info');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Symptom & Mood Logger"
      maxWidth="580px"
      footer={
        <>
          {existingId && (
            <button 
              type="button" 
              className="btn btn-danger" 
              style={{ marginRight: 'auto' }}
              onClick={handleDelete}
            >
              <Trash2 size={16} /> Delete Entry
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <CheckCircle2 size={16} /> Save Daily Log
          </button>
        </>
      }
    >
      <form className="symptom-form" onSubmit={handleSave}>
        {/* Date Selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="symptom-date-input">
            <span>Date</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>100% Private Device Storage</span>
          </label>
          <input
            id="symptom-date-input"
            type="date"
            className="form-input-date"
            value={date}
            max={formatDateISO(new Date())}
            onChange={handleDateChange}
            required
          />
        </div>

        {/* Menstrual Flow Level */}
        <div className="form-group">
          <label className="form-label">Menstrual Flow Intensity</label>
          <div className="chip-selector-group">
            {FLOW_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`selector-chip ${flow === opt ? 'active' : ''}`}
                onClick={() => setFlow(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cramp & Pain Severity Scale */}
        <div className="form-group">
          <label className="form-label">
            <span>Cramp & Pain Severity (Level {painLevel})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
              {painLevel === 1 && '1 - No Pain'}
              {painLevel === 2 && '2 - Mild'}
              {painLevel === 3 && '3 - Moderate'}
              {painLevel === 4 && '4 - Severe'}
              {painLevel === 5 && '5 - Very Intense'}
            </span>
          </label>
          <div className="pain-scale-container">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`pain-scale-btn ${painLevel === lvl ? 'active' : ''}`}
                onClick={() => setPainLevel(lvl)}
              >
                <span style={{ fontSize: '1rem' }}>{lvl}</span>
                <span>{lvl === 1 ? 'None' : lvl === 5 ? 'Max' : `Lvl ${lvl}`}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="form-group">
          <label className="form-label">Energy Level</label>
          <div className="chip-selector-group">
            {ENERGY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`selector-chip ${energy === opt ? 'active' : ''}`}
                onClick={() => setEnergy(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cervical Mucus / Fluid */}
        <div className="form-group">
          <label className="form-label">Cervical Fluid Observation</label>
          <div className="chip-selector-group">
            {CERVICAL_MUCUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`selector-chip ${cervicalMucus === opt ? 'active' : ''}`}
                onClick={() => setCervicalMucus(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Mood & Body Symptoms */}
        <div className="form-group">
          <label className="form-label">Mood & Physical Sensations</label>
          <div className="chip-selector-group">
            {MOOD_OPTIONS.map((mood) => {
              const isActive = selectedMoods.includes(mood);
              return (
                <button
                  key={mood}
                  type="button"
                  className={`selector-chip ${isActive ? 'active' : ''}`}
                  onClick={() => toggleMood(mood)}
                >
                  {isActive ? `✓ ${mood}` : mood}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="symptom-notes">Personal Notes & Observations</label>
          <textarea
            id="symptom-notes"
            className="form-textarea"
            placeholder="Log medication, sleep quality, stress levels, or reflections..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
