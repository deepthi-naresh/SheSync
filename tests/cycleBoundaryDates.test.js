import { describe, it, expect } from 'vitest';
import {
  normalizeDate,
  formatDateISO,
  getDaysDifference,
  addDays,
  calculateCycleMetrics,
  validateCycleInputs,
  calculateAverageCycleLength,
  detectCycleIrregularity
} from '../src/utils/cycleCalculations';

describe('SheSync Cycle Engine: Boundary Dates & Edge Cases', () => {
  it('1. Correctly identifies leap year February 29th vs non-leap year February 28th', () => {
    // 2028 is a leap year (Feb 29 exists)
    const leapDate = normalizeDate('2028-02-29');
    expect(leapDate).not.toBeNull();
    expect(leapDate.getFullYear()).toBe(2028);
    expect(leapDate.getMonth()).toBe(1); // February
    expect(leapDate.getDate()).toBe(29);
    expect(formatDateISO(leapDate)).toBe('2028-02-29');

    // Adding 1 day to 2028-02-28 yields 2028-02-29
    const feb28Leap = normalizeDate('2028-02-28');
    const plusOneLeap = addDays(feb28Leap, 1);
    expect(formatDateISO(plusOneLeap)).toBe('2028-02-29');

    // Adding 1 day to 2026-02-28 (non-leap year) yields 2026-03-01
    const feb28NonLeap = normalizeDate('2026-02-28');
    const plusOneNonLeap = addDays(feb28NonLeap, 1);
    expect(formatDateISO(plusOneNonLeap)).toBe('2026-03-01');
  });

  it('2. Handles year-end transitions seamlessly (Dec 31 to Jan 1)', () => {
    const dec31 = normalizeDate('2026-12-31');
    const jan1 = addDays(dec31, 1);
    expect(formatDateISO(jan1)).toBe('2027-01-01');
    expect(getDaysDifference(dec31, jan1)).toBe(1);

    const jan28 = addDays(dec31, 28);
    expect(formatDateISO(jan28)).toBe('2027-01-28');
    expect(getDaysDifference(dec31, jan28)).toBe(28);
  });

  it('3. Rejects future dates and boundary violations in validateCycleInputs', () => {
    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowIso = formatDateISO(tomorrow);

    const futureCheck = validateCycleInputs({
      startDate: tomorrowIso,
      cycleLength: 28,
      periodDuration: 5
    });
    expect(futureCheck.isValid).toBe(false);
    expect(futureCheck.errors.startDate).toContain('cannot be in the future');

    // Cycle length below 21 or above 50
    const shortCycle = validateCycleInputs({
      startDate: '2026-09-01',
      cycleLength: 19,
      periodDuration: 5
    });
    expect(shortCycle.isValid).toBe(false);
    expect(shortCycle.errors.cycleLength).toContain('between 21 and 50 days');

    const longCycle = validateCycleInputs({
      startDate: '2026-09-01',
      cycleLength: 55,
      periodDuration: 5
    });
    expect(longCycle.isValid).toBe(false);

    // Period bleeding duration < 2 or > 10
    const invalidPeriod = validateCycleInputs({
      startDate: '2026-09-01',
      cycleLength: 28,
      periodDuration: 12
    });
    expect(invalidPeriod.isValid).toBe(false);
    expect(invalidPeriod.errors.periodDuration).toContain('between 2 and 10 days');
  });

  it('4. Correctly computes cycle metrics across minimal (21d) and maximal (50d) cycle lengths', () => {
    // Minimal physiological cycle: 21 days
    const minMetrics = calculateCycleMetrics({
      lastPeriodStart: '2026-10-01',
      cycleLength: 21,
      periodDuration: 3,
      referenceDate: '2026-10-01'
    });
    expect(minMetrics.hasData).toBe(true);
    expect(minMetrics.cycleDay).toBe(1);
    expect(formatDateISO(minMetrics.nextPeriodStart)).toBe('2026-10-22');
    expect(minMetrics.daysUntilNextPeriod).toBe(21);
    expect(minMetrics.currentPhase.key).toBe('menstrual');

    // Maximal physiological cycle: 50 days
    const maxMetrics = calculateCycleMetrics({
      lastPeriodStart: '2026-10-01',
      cycleLength: 50,
      periodDuration: 7,
      referenceDate: '2026-10-01'
    });
    expect(maxMetrics.hasData).toBe(true);
    expect(formatDateISO(maxMetrics.nextPeriodStart)).toBe('2026-11-20');
    expect(maxMetrics.daysUntilNextPeriod).toBe(50);
  });

  it('5. Transitions gracefully into Late/Delayed phase when days exceed cycle duration', () => {
    // Period was 35 days ago for a 28-day cycle
    const delayedMetrics = calculateCycleMetrics({
      lastPeriodStart: '2026-08-01',
      cycleLength: 28,
      periodDuration: 5,
      referenceDate: '2026-09-05' // 35 days later
    });
    expect(delayedMetrics.hasData).toBe(true);
    expect(delayedMetrics.isDelayed).toBe(true);
    expect(delayedMetrics.currentPhase.key).toBe('late');
    expect(delayedMetrics.cycleDay).toBe(36);
  });

  it('6. Handles null, empty, or undefined cycle history gracefully', () => {
    expect(calculateAverageCycleLength(null, 30)).toBe(30);
    expect(calculateAverageCycleLength([], 30)).toBe(30);
    expect(calculateAverageCycleLength([{ startDate: '2026-01-01' }], 28)).toBe(28);

    const irregularity = detectCycleIrregularity(null);
    expect(irregularity.isIrregular).toBe(false);
    expect(irregularity.reason).toContain('Insufficient history');
  });
});
