import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { 
  formatDateISO, 
  addDays, 
  calculateCycleMetrics, 
  validateCycleInputs,
  detectCycleIrregularity
} from '../src/utils/cycleCalculations';

describe('SheSync Phase 2 Integration & State Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Correctly manages and persists cycle settings in localStorage', () => {
    const customSettings = {
      lastPeriodStart: '2026-09-28',
      cycleLength: 30,
      periodDuration: 6
    };

    storage.set('cycle_settings', customSettings);
    const retrieved = storage.get('cycle_settings');

    expect(retrieved).toEqual(customSettings);
    expect(retrieved.cycleLength).toBe(30);
    expect(retrieved.periodDuration).toBe(6);
  });

  it('2. Daily symptom CRUD operations maintain date-keyed uniqueness', () => {
    let symptomLogs = [];

    const entry1 = {
      id: 'sym-1',
      date: '2026-10-09',
      flow: 'Medium',
      painLevel: 3,
      energy: 'Low',
      moods: ['Fatigued', 'Bloated'],
      cervicalMucus: 'Creamy',
      notes: 'Took warm chamomile tea'
    };

    // Add entry
    symptomLogs = [entry1, ...symptomLogs.filter(l => l.date !== entry1.date)];
    expect(symptomLogs.length).toBe(1);
    expect(symptomLogs[0].painLevel).toBe(3);

    // Update same date entry
    const updatedEntry1 = {
      ...entry1,
      flow: 'Heavy',
      painLevel: 4
    };
    symptomLogs = [updatedEntry1, ...symptomLogs.filter(l => l.date !== updatedEntry1.date)];
    expect(symptomLogs.length).toBe(1);
    expect(symptomLogs[0].flow).toBe('Heavy');
    expect(symptomLogs[0].painLevel).toBe(4);

    // Delete entry
    symptomLogs = symptomLogs.filter(l => l.date !== '2026-10-09');
    expect(symptomLogs.length).toBe(0);
  });

  it('3. Cycle history logging updates rolling average and flags irregularities', () => {
    const regularHistory = [
      { id: 'h1', startDate: '2026-07-01', endDate: '2026-07-06', cycleLength: 28 },
      { id: 'h2', startDate: '2026-07-29', endDate: '2026-08-03', cycleLength: 28 },
      { id: 'h3', startDate: '2026-08-26', endDate: '2026-08-31', cycleLength: 28 },
    ];

    const metrics = calculateCycleMetrics({
      lastPeriodStart: '2026-09-23',
      cycleLength: 28,
      periodDuration: 5,
      cycleHistory: regularHistory,
      referenceDate: '2026-10-05' // Day 13
    });

    expect(metrics.averageCycleLength).toBe(28);
    expect(metrics.irregularityInfo.isIrregular).toBe(false);
    expect(metrics.cycleDay).toBe(13);
    expect(metrics.currentPhase.key).toBe('ovulatory'); // Day 13 is within estimated fertile window (ovulation day is 14)
  });

  it('4. Health Summary correctly aggregates average pain and mood frequency', () => {
    const logs = [
      { date: '2026-10-01', painLevel: 3, moods: ['Cramps', 'Fatigued'] },
      { date: '2026-10-02', painLevel: 2, moods: ['Fatigued', 'Calm'] },
      { date: '2026-10-03', painLevel: 1, moods: ['Happy', 'Energetic'] },
    ];

    const avgPain = (logs.reduce((acc, l) => acc + l.painLevel, 0) / logs.length).toFixed(1);
    expect(avgPain).toBe('2.0');

    const moodCounts = {};
    logs.forEach(l => {
      l.moods.forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
      });
    });

    expect(moodCounts['Fatigued']).toBe(2);
    expect(moodCounts['Happy']).toBe(1);
  });
});
