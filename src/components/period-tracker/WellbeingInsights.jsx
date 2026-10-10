import React from 'react';
import { 
  Heart, 
  Zap, 
  Apple, 
  Dumbbell, 
  ShieldCheck, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { useCycle } from '../../context/CycleContext';

export default function WellbeingInsights() {
  const { metrics } = useCycle();
  const { currentPhase, cycleDay } = metrics;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
          <Sparkles size={20} color="var(--accent-primary)" />
          Phase-Aligned Wellbeing Guidance
        </h3>
        <span className={`badge ${currentPhase.badgeClass}`}>
          {currentPhase.title} (Day {cycleDay || '—'})
        </span>
      </div>

      <div className="grid-2">
        {/* Nutrition Focus */}
        <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-sage)' }}>
            <Apple size={16} /> Nutrition & Hormonal Fuel
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentPhase.nutrition}
          </p>
        </div>

        {/* Movement & Workouts */}
        <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-lavender-deep)' }}>
            <Dumbbell size={16} /> Movement & Exercise
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentPhase.exercise}
          </p>
        </div>

        {/* Energy Levels */}
        <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)' }}>
            <Zap size={16} /> Energy & Focus Rhythm
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentPhase.energy}
          </p>
        </div>

        {/* Cramp & Self-Care */}
        <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)' }}>
            <Heart size={16} /> Soothing & Cramp Support
          </h4>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentPhase.crampCare}
          </p>
        </div>
      </div>

      <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start', border: '1px solid var(--border-color)' }}>
        <Info size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          * Educational Guidance Only: Phase recommendations are based on peer-reviewed hormonal research and general nutritional guidelines. Adapt practices to your individual comfort.
        </span>
      </div>
    </div>
  );
}
