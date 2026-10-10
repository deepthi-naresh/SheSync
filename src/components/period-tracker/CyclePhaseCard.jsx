import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  PlusCircle, 
  SlidersHorizontal, 
  FileText, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useCycle } from '../../context/CycleContext';
import './CyclePhaseCard.css';

export default function CyclePhaseCard({ onOpenLogModal, onOpenSettingsModal, onOpenReportModal }) {
  const { metrics, settings } = useCycle();
  const { currentPhase, cycleDay, daysUntilNextPeriod, averageCycleLength, isDelayed } = metrics;

  return (
    <section className="cycle-phase-hero" aria-label="Current Cycle Status">
      <div className="cycle-hero-top">
        <div className="cycle-hero-badges">
          <span className="badge badge-plum">
            <Sparkles size={13} /> Periods & Wellbeing
          </span>
          <span className={`badge ${currentPhase.badgeClass}`}>
            {currentPhase.title} (Estimate)
          </span>
          {isDelayed && (
            <span className="badge badge-amber">
              <AlertCircle size={13} /> Overdue by {Math.abs(daysUntilNextPeriod)} Days
            </span>
          )}
        </div>

        <button 
          className="btn btn-outline" 
          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          onClick={onOpenSettingsModal}
          aria-label="Edit cycle settings"
        >
          <SlidersHorizontal size={14} /> Cycle Settings ({settings.cycleLength}d)
        </button>
      </div>

      <div className="cycle-hero-main">
        <div className="cycle-hero-info">
          <h1 className="cycle-day-title">
            {metrics.hasData ? `Cycle Day ${cycleDay}` : 'Welcome to SheSync'}
          </h1>
          <div className="cycle-phase-name">
            <span>{currentPhase.subtitle}</span>
          </div>
          <p className="cycle-phase-desc">
            {currentPhase.description}
          </p>
        </div>

        <div className="cycle-countdown-card">
          {isDelayed ? (
            <>
              <span className="countdown-number" style={{ color: 'var(--accent-amber)' }}>
                +{Math.abs(daysUntilNextPeriod)}
              </span>
              <span className="countdown-label">Days Past Estimate</span>
            </>
          ) : (
            <>
              <span className="countdown-number">
                {daysUntilNextPeriod !== null ? Math.max(0, daysUntilNextPeriod) : '—'}
              </span>
              <span className="countdown-label">
                {daysUntilNextPeriod === 1 ? 'Day until next cycle' : 'Days until next cycle (Est.)'}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="cycle-hero-actions">
        <button 
          className="btn btn-primary"
          onClick={() => onOpenLogModal(new Date())}
        >
          <PlusCircle size={17} /> Log Daily Symptoms
        </button>

        <button 
          className="btn btn-secondary"
          onClick={onOpenSettingsModal}
        >
          <Calendar size={16} /> Update Period Start Date
        </button>

        <button 
          className="btn btn-outline"
          onClick={onOpenReportModal}
        >
          <FileText size={16} /> View Health Summary
        </button>
      </div>
    </section>
  );
}
