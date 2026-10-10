import React from 'react';
import { 
  Printer, 
  FileText, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import Modal from '../common/Modal';
import { useCycle } from '../../context/CycleContext';
import './PrintableReportModal.css';

export default function PrintableReportModal({ isOpen, onClose }) {
  const { metrics, settings, cycleHistory, symptomLogs } = useCycle();
  const { averageCycleLength, irregularityInfo, lastPeriodStart, nextPeriodStart } = metrics;

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  // Aggregate symptoms statistics from user logs
  const totalLogs = symptomLogs.length;
  const painScores = symptomLogs.map(s => s.painLevel || 1);
  const avgPain = totalLogs > 0 ? (painScores.reduce((a, b) => a + b, 0) / totalLogs).toFixed(1) : '1.0';

  const moodCounts = {};
  symptomLogs.forEach(s => {
    if (Array.isArray(s.moods)) {
      s.moods.forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });
    }
  });

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([mood, count]) => `${mood} (${count}x)`)
    .join(', ') || 'None recorded';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cycle & Health Summary Report"
      maxWidth="680px"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </>
      }
    >
      <div className="health-report-container">
        {/* Report Header */}
        <div className="report-header-sheet">
          <div>
            <span className="report-brand">SheSync</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Personal Menstrual Health & Cycle Log Summary
            </div>
          </div>
          <div className="report-meta-timestamp">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div style={{ color: 'var(--accent-sage)', fontWeight: 600 }}>100% Client-Side Private</div>
          </div>
        </div>

        {/* High-level metrics */}
        <div className="report-stats-grid">
          <div className="report-stat-box">
            <span className="report-stat-label">Average Cycle</span>
            <span className="report-stat-val">{averageCycleLength} Days</span>
          </div>
          <div className="report-stat-box">
            <span className="report-stat-label">Bleeding Duration</span>
            <span className="report-stat-val">{settings.periodDuration || 5} Days</span>
          </div>
          <div className="report-stat-box">
            <span className="report-stat-label">Avg. Cramp Rating</span>
            <span className="report-stat-val">{avgPain} / 5</span>
          </div>
        </div>

        {/* Dates Breakdown */}
        <div style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid var(--border-color)' }}>
          <div><strong>Last Recorded Period Start:</strong> {settings.lastPeriodStart || 'Not recorded'}</div>
          <div><strong>Estimated Next Cycle Start:</strong> {metrics.nextPeriodStart ? metrics.nextPeriodStart.toLocaleDateString() : 'Awaiting data'}</div>
          <div><strong>Frequent Moods / Symptoms:</strong> {topMoods}</div>
        </div>

        {/* Cycle History Table */}
        <div>
          <h4 style={{ fontSize: '0.98rem', marginBottom: '8px' }}>Recorded Cycle History</h4>
          {cycleHistory.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)' }}>No historical cycle intervals recorded.</p>
          ) : (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Cycle Duration</th>
                    <th>User Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cycleHistory.map((item) => (
                    <tr key={item.id}>
                      <td>{item.startDate}</td>
                      <td>{item.endDate || '—'}</td>
                      <td>{item.cycleLength} Days</td>
                      <td>{item.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Symptom Logs */}
        <div>
          <h4 style={{ fontSize: '0.98rem', marginBottom: '8px' }}>Recent Daily Symptom Logs (Last 5 entries)</h4>
          {symptomLogs.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)' }}>No symptom entries logged yet.</p>
          ) : (
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Flow</th>
                    <th>Pain (1-5)</th>
                    <th>Energy</th>
                    <th>Moods</th>
                  </tr>
                </thead>
                <tbody>
                  {symptomLogs.slice(0, 5).map((log) => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td>{log.flow}</td>
                      <td>Level {log.painLevel}</td>
                      <td>{log.energy}</td>
                      <td>{log.moods && log.moods.length > 0 ? log.moods.join(', ') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Medical Advisory Note */}
        <div style={{ padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', marginTop: '6px' }}>
          <strong>Doctor Consultation Advisory:</strong> This document reflects personal self-reported logs and rhythm calculations entered into SheSync. It is not an automated medical diagnosis. Please share this data directly with your gynaecologist or healthcare provider to assist in clinical evaluation.
        </div>
      </div>
    </Modal>
  );
}
