import { describe, it, expect } from 'vitest';
import {
  normalizeDate,
  formatDateISO,
  getDaysDifference,
  addDays,
  calculateAverageCycleLength,
  detectCycleIrregularity,
  calculateCycleMetrics,
  validateCycleInputs,
  PHASE_INSIGHTS
} from '../src/utils/cycleCalculations';

describe('SheSync Cycle Calculation Engine', () => {
  it('normalizes and formats dates accurately', () => {
    const d = normalizeDate('2026-10-01');
    expect(d).not.toBeNull();
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(9); // 0-indexed October
    expect(d.getDate()).toBe(1);

    expect(formatDateISO(d)).toBe('2026-10-01');
    expect(formatDateISO(null)).toBe('');
  });

  it('calculates days difference correctly between dates', () => {
    expect(getDaysDifference('2026-10-01', '2026-10-05')).toBe(4);
    expect(getDaysDifference('2026-10-10', '2026-10-05')).toBe(-5);
    expect(getDaysDifference('2026-10-01', '2026-10-01')).toBe(0);
  });

  it('adds days across month and year boundaries', () => {
    const start = normalizeDate('2026-10-28');
    const nextMonth = addDays(start, 5);
    expect(formatDateISO(nextMonth)).toBe('2026-11-02');

    const yearEnd = normalizeDate('2026-12-30');
    const nextYear = addDays(yearEnd, 3);
    expect(formatDateISO(nextYear)).toBe('2027-01-02');
  });

  it('calculates rolling average cycle length ignoring abnormal intervals', () => {
    const history = [
      { startDate: '2026-06-01' },
      { startDate: '2026-06-29' }, // 28 days
      { startDate: '2026-07-28' }, // 29 days
      { startDate: '2026-08-25' }, // 28 days
    ];
    const avg = calculateAverageCycleLength(history, 28);
    expect(avg).toBe(28); // (28 + 29 + 28) / 3 = 28.33 -> 28
  });

  it('detects cycle irregularity when variance exceeds threshold', () => {
    const regularHistory = [
      { startDate: '2026-04-01' },
      { startDate: '2026-04-29' }, // 28 days
      { startDate: '2026-05-28' }, // 29 days
      { startDate: '2026-06-25' }, // 28 days
    ];
    const regCheck = detectCycleIrregularity(regularHistory);
    expect(regCheck.isIrregular).toBe(false);

    const irregularHistory = [
      { startDate: '2026-04-01' },
      { startDate: '2026-04-22' }, // 21 days
      { startDate: '2026-05-25' }, // 33 days (variance = 12)
      { startDate: '2026-06-20' }, // 26 days
    ];
    const irregCheck = detectCycleIrregularity(irregularHistory);
    expect(irregCheck.isIrregular).toBe(true);
    expect(irregCheck.variationDays).toBe(12);
  });

  describe('calculateCycleMetrics Phase Predictions', () => {
    it('identifies Menstrual Phase on Day 2 of a 28-day cycle', () => {
      const metrics = calculateCycleMetrics({
        lastPeriodStart: '2026-10-01',
        cycleLength: 28,
        periodDuration: 5,
        referenceDate: '2026-10-02' // Day 2
      });

      expect(metrics.hasData).toBe(true);
      expect(metrics.cycleDay).toBe(2);
      expect(metrics.currentPhase.key).toBe('menstrual');
      expect(formatDateISO(metrics.nextPeriodStart)).toBe('2026-10-29');
    });

    it('identifies Follicular Phase on Day 7 of a 28-day cycle', () => {
      const metrics = calculateCycleMetrics({
        lastPeriodStart: '2026-10-01',
        cycleLength: 28,
        periodDuration: 5,
        referenceDate: '2026-10-07' // Day 7
      });

      expect(metrics.cycleDay).toBe(7);
      expect(metrics.currentPhase.key).toBe('follicular');
    });

    it('identifies Estimated Fertile / Ovulatory Window on Day 14 of a 28-day cycle', () => {
      const metrics = calculateCycleMetrics({
        lastPeriodStart: '2026-10-01',
        cycleLength: 28,
        periodDuration: 5,
        referenceDate: '2026-10-14' // Day 14 (Ovulation Day)
      });

      expect(metrics.cycleDay).toBe(14);
      expect(metrics.currentPhase.key).toBe('ovulatory');
      expect(formatDateISO(metrics.ovulationDate)).toBe('2026-10-14');
      expect(formatDateISO(metrics.fertileWindowStart)).toBe('2026-10-09');
      expect(formatDateISO(metrics.fertileWindowEnd)).toBe('2026-10-15');
    });

    it('identifies Luteal Phase on Day 22 of a 28-day cycle', () => {
      const metrics = calculateCycleMetrics({
        lastPeriodStart: '2026-10-01',
        cycleLength: 28,
        periodDuration: 5,
        referenceDate: '2026-10-22' // Day 22
      });

      expect(metrics.cycleDay).toBe(22);
      expect(metrics.currentPhase.key).toBe('luteal');
      expect(metrics.daysUntilNextPeriod).toBe(7);
    });

    it('identifies Delayed/Overdue status when cycleDay exceeds cycleLength', () => {
      const metrics = calculateCycleMetrics({
        lastPeriodStart: '2026-09-01',
        cycleLength: 28,
        periodDuration: 5,
        referenceDate: '2026-10-05' // Day 35
      });

      expect(metrics.isDelayed).toBe(true);
      expect(metrics.currentPhase.key).toBe('late');
    });
  });

  describe('validateCycleInputs', () => {
    it('accepts valid cycle parameters', () => {
      const result = validateCycleInputs({
        startDate: '2026-10-01',
        cycleLength: 28,
        periodDuration: 5
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('rejects future start date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      const result = validateCycleInputs({
        startDate: formatDateISO(future),
        cycleLength: 28,
        periodDuration: 5
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.startDate).toBeDefined();
    });

    it('rejects out-of-range cycle length or period duration', () => {
      const result = validateCycleInputs({
        startDate: '2026-10-01',
        cycleLength: 15, // too short (< 21)
        periodDuration: 15 // too long (> 10)
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.cycleLength).toBeDefined();
      expect(result.errors.periodDuration).toBeDefined();
    });
  });
});
