import React from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  CalendarDays 
} from 'lucide-react';
import { useCycle } from '../../context/CycleContext';
import { useToast } from '../../context/ToastContext';
import './CycleHistoryList.css';

export default function CycleHistoryList({ onOpenSettingsModal }) {
  const { cycleHistory, deleteHistoryEntry, metrics } = useCycle();
  const { showToast } = useToast();
  const { irregularityInfo } = metrics;

  const handleDelete = (id, startDate) => {
    deleteHistoryEntry(id);
    showToast(`Cycle starting ${startDate} removed from history.`, 'info');
  };

  return (
    <div className="glass-card cycle-history-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
          <CalendarDays size={20} color="var(--accent-primary)" />
          Cycle History & Variations
        </h3>
        <button 
          className="btn btn-secondary" 
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          onClick={onOpenSettingsModal}
        >
          <PlusCircle size={14} /> Log Past Cycle
        </button>
      </div>

      {/* Irregularity Warning / Regularity Feedback Banner */}
      {irregularityInfo && irregularityInfo.variationDays > 0 && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: irregularityInfo.isIrregular ? 'var(--accent-amber-subtle)' : 'var(--accent-sage-subtle)',
          border: `1px solid ${irregularityInfo.isIrregular ? 'var(--accent-amber)' : 'var(--accent-sage)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          {irregularityInfo.isIrregular ? (
            <AlertTriangle size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <CheckCircle2 size={20} color="var(--accent-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
            <strong>{irregularityInfo.isIrregular ? 'Cycle Variance Notice:' : 'Consistent Rhythm:'}</strong>
            <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
              {irregularityInfo.reason}
            </p>
          </div>
        </div>
      )}

      {/* History Items List */}
      {cycleHistory.length === 0 ? (
        <div className="empty-history-box">
          <CalendarDays size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
          <p style={{ fontWeight: 600 }}>No past cycles logged yet.</p>
          <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>
            Logging 2 or more cycles calculates your personalized rolling average cycle duration.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {cycleHistory.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-dates">
                <span className="history-main-date">
                  Started: {item.startDate} {item.endDate ? `→ Ended: ${item.endDate}` : ''}
                </span>
                {item.notes && <span className="history-notes">{item.notes}</span>}
              </div>

              <div className="history-meta">
                <span className="history-length-badge">
                  {item.cycleLength} Days
                </span>
                <button
                  className="btn-delete-history"
                  onClick={() => handleDelete(item.id, item.startDate)}
                  title="Delete cycle entry"
                  aria-label={`Delete cycle starting ${item.startDate}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
