/**
 * SheSync Deterministic Cycle Calculation Engine
 * 
 * Medical Advisory:
 * Biological cycles vary due to hormonal variations, stress, and lifestyle factors.
 * All outputs are mathematically calculated estimates based on standard gynecological models
 * and must NOT be used for natural contraception or medical diagnosis.
 */

/**
 * Safely parses a Date or YYYY-MM-DD string into a normalized local Date object (midnight).
 */
export function normalizeDate(input) {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input.getTime())) {
    const d = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    return d;
  }
  if (typeof input === 'string') {
    const parts = input.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(input);
    if (!isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
  }
  return null;
}

/**
 * Formats a Date object to YYYY-MM-DD standard format.
 */
export function formatDateISO(date) {
  const d = normalizeDate(date);
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns difference in whole calendar days between two dates (date2 - date1).
 */
export function getDaysDifference(date1, date2) {
  const d1 = normalizeDate(date1);
  const d2 = normalizeDate(date2);
  if (!d1 || !d2) return 0;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Adds whole calendar days to a date.
 */
export function addDays(date, days) {
  const d = normalizeDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates rolling average cycle length from recorded cycle history.
 */
export function calculateAverageCycleLength(cycleHistory = [], defaultLength = 28) {
  if (!Array.isArray(cycleHistory) || cycleHistory.length < 2) {
    return defaultLength;
  }

  // Sort history chronologically
  const sorted = [...cycleHistory].sort((a, b) => {
    return normalizeDate(a.startDate).getTime() - normalizeDate(b.startDate).getTime();
  });

  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = getDaysDifference(sorted[i - 1].startDate, sorted[i].startDate);
    // Ignore unreasonable outliers (< 15 days or > 60 days)
    if (diff >= 18 && diff <= 55) {
      intervals.push(diff);
    }
  }

  if (intervals.length === 0) return defaultLength;

  const sum = intervals.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / intervals.length);
}

/**
 * Detects whether historical cycle variation exceeds standard bounds (> 7-9 days).
 */
export function detectCycleIrregularity(cycleHistory = []) {
  if (!Array.isArray(cycleHistory) || cycleHistory.length < 3) {
    return { isIrregular: false, variationDays: 0, reason: 'Insufficient history (minimum 3 cycles required)' };
  }

  const sorted = [...cycleHistory].sort((a, b) => {
    return normalizeDate(a.startDate).getTime() - normalizeDate(b.startDate).getTime();
  });

  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = getDaysDifference(sorted[i - 1].startDate, sorted[i].startDate);
    if (diff >= 15 && diff <= 60) {
      intervals.push(diff);
    }
  }

  if (intervals.length < 2) {
    return { isIrregular: false, variationDays: 0, reason: 'Insufficient consistent intervals' };
  }

  const min = Math.min(...intervals);
  const max = Math.max(...intervals);
  const variationDays = max - min;
  const isIrregular = variationDays >= 8;

  return {
    isIrregular,
    variationDays,
    minInterval: min,
    maxInterval: max,
    reason: isIrregular 
      ? `Cycle length varied by ${variationDays} days across recent cycles (ranges between ${min} and ${max} days).`
      : `Cycle length is consistent with normal physiological variance (${variationDays} days variation).`
  };
}

/**
 * Phase content and educational wellbeing insights mapped to each biological phase.
 */
export const PHASE_INSIGHTS = {
  menstrual: {
    key: 'menstrual',
    title: 'Menstrual Phase',
    subtitle: 'Rest, Replenish & Reset',
    colorToken: 'var(--accent-rose)',
    badgeClass: 'badge-rose',
    description: 'Estrogen and progesterone are at baseline levels. The uterine lining sheds.',
    energy: 'Lower energy levels — ideal for restorative activities and introspection.',
    nutrition: 'Focus on iron-rich foods (lentils, spinach, beets), vitamin C to enhance iron absorption, and warm herbal teas like ginger or chamomile.',
    exercise: 'Gentle stretching, restorative yoga, relaxed walks. Prioritize deep rest.',
    crampCare: 'Apply a warm heat patch, stay well-hydrated, and practice gentle pelvic tilts.'
  },
  follicular: {
    key: 'follicular',
    title: 'Follicular Phase',
    subtitle: 'Rising Energy & Creativity',
    colorToken: 'var(--accent-sage)',
    badgeClass: 'badge-sage',
    description: 'Follicle-stimulating hormone (FSH) stimulates ovarian follicles; estrogen begins its steady rise.',
    energy: 'Surging energy, mental clarity, optimism, and increased social drive.',
    nutrition: 'Fermented foods (kimchi, kefir), sprouted grains, fresh vibrant salads, and lean proteins to support follicular growth.',
    exercise: 'Strength training, cardio, hiking, and exploring new fitness challenges.',
    crampCare: 'Energy is typically at its highest; cramps are uncommon in this phase.'
  },
  ovulatory: {
    key: 'ovulatory',
    title: 'Estimated Fertile Window & Ovulation',
    subtitle: 'Peak Hormonal Vitality (Estimate)',
    colorToken: 'var(--accent-lavender-deep)',
    badgeClass: 'badge-lavender',
    description: 'Luteinizing Hormone (LH) surges triggering egg release. High estrogen levels promote cervical mucus changes.',
    energy: 'Peak physical stamina, confidence, communication, and high libido.',
    nutrition: 'Antioxidant-dense berries, cruciferous vegetables (broccoli, cabbage), and hydration to aid liver hormone clearance.',
    exercise: 'High-intensity intervals (HIIT), brisk running, dynamic dance, or heavy resistance sets.',
    crampCare: 'Some individuals experience mild mid-cycle discomfort (Mittelschmerz).'
  },
  luteal: {
    key: 'luteal',
    title: 'Luteal Phase',
    subtitle: 'Progesterone Dominance & Nurturing',
    colorToken: 'var(--accent-amber)',
    badgeClass: 'badge-amber',
    description: 'Progesterone peaks to support the uterine lining, then declines if conception does not occur.',
    energy: 'Energy gradually winds down. Focus on grounding tasks and stress management.',
    nutrition: 'Complex slow-burning carbohydrates (sweet potatoes, oats), magnesium-rich dark chocolate, and pumpkin seeds.',
    exercise: 'Pilates, moderate resistance training, swimming, and mindful breathwork.',
    crampCare: 'Reduce excess sodium and caffeine to minimize bloating, tender breasts, and premenstrual mood shifts.'
  },
  late: {
    key: 'late',
    title: 'Cycle Delayed / Overdue',
    subtitle: 'Awaiting Next Cycle',
    colorToken: 'var(--text-tertiary)',
    badgeClass: 'badge-plum',
    description: 'Your estimated cycle duration has passed without a logged period.',
    energy: 'Variable energy levels depending on stress, sleep, and lifestyle factors.',
    nutrition: 'Warm hydrating broths, whole foods, and stress-reducing herbal teas.',
    exercise: 'Gentle mindful movement to reduce tension and support natural circulation.',
    crampCare: 'Track any spotting or symptoms. If delays persist $> 14$ days, consult a healthcare professional.'
  }
};

/**
 * Computes all cycle dates, active phase, fertility window, and days countdown.
 */
export function calculateCycleMetrics({
  lastPeriodStart,
  cycleLength = 28,
  periodDuration = 5,
  cycleHistory = [],
  referenceDate = new Date()
}) {
  const refDate = normalizeDate(referenceDate) || normalizeDate(new Date());
  const startDate = normalizeDate(lastPeriodStart);

  // If no start date has been logged yet
  if (!startDate) {
    return {
      hasData: false,
      cycleDay: null,
      daysUntilNextPeriod: null,
      currentPhase: PHASE_INSIGHTS.follicular,
      nextPeriodStart: null,
      ovulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      averageCycleLength: cycleLength,
      irregularityInfo: detectCycleIrregularity(cycleHistory),
      isDelayed: false
    };
  }

  // Use rolling average if historical cycles are provided
  const effectiveCycleLength = calculateAverageCycleLength(cycleHistory, cycleLength);
  const effectiveDuration = Math.max(2, Math.min(10, periodDuration));

  // Current cycle day: 1-indexed (Day 1 is start date)
  const diffFromStart = getDaysDifference(startDate, refDate);
  const cycleDay = diffFromStart >= 0 ? diffFromStart + 1 : 1;

  // Next estimated period start
  const nextPeriodStart = addDays(startDate, effectiveCycleLength);
  const daysUntilNextPeriod = getDaysDifference(refDate, nextPeriodStart);

  // Estimated ovulation: typically 14 days before next period
  const ovulationDayIndex = Math.max(effectiveDuration + 2, effectiveCycleLength - 14);
  const ovulationDate = addDays(startDate, ovulationDayIndex - 1);

  // Fertile window: 5 days before ovulation to 1 day after ovulation
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  // Determine current active phase
  let currentPhase = PHASE_INSIGHTS.follicular;
  let isDelayed = false;

  if (cycleDay <= effectiveDuration) {
    currentPhase = PHASE_INSIGHTS.menstrual;
  } else if (cycleDay > effectiveCycleLength) {
    currentPhase = PHASE_INSIGHTS.late;
    isDelayed = true;
  } else {
    // Check fertile window bounds (inclusive)
    const diffFromFertileStart = getDaysDifference(fertileWindowStart, refDate);
    const diffFromFertileEnd = getDaysDifference(refDate, fertileWindowEnd);

    if (diffFromFertileStart >= 0 && diffFromFertileEnd >= 0) {
      currentPhase = PHASE_INSIGHTS.ovulatory;
    } else if (cycleDay < ovulationDayIndex - 5) {
      currentPhase = PHASE_INSIGHTS.follicular;
    } else {
      currentPhase = PHASE_INSIGHTS.luteal;
    }
  }

  const irregularityInfo = detectCycleIrregularity(cycleHistory);

  return {
    hasData: true,
    cycleDay,
    daysUntilNextPeriod,
    currentPhase,
    lastPeriodStart: startDate,
    nextPeriodStart,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    averageCycleLength: effectiveCycleLength,
    periodDuration: effectiveDuration,
    irregularityInfo,
    isDelayed
  };
}

/**
 * Validates user cycle settings inputs with helpful error strings.
 */
export function validateCycleInputs({ cycleLength, periodDuration, startDate }) {
  const errors = {};

  if (!startDate) {
    errors.startDate = 'Please select your most recent period start date.';
  } else {
    const d = normalizeDate(startDate);
    const today = normalizeDate(new Date());
    if (!d) {
      errors.startDate = 'Invalid date format.';
    } else if (d > today) {
      errors.startDate = 'Start date cannot be in the future.';
    }
  }

  const numCycle = parseInt(cycleLength, 10);
  if (isNaN(numCycle) || numCycle < 21 || numCycle > 50) {
    errors.cycleLength = 'Average cycle length must be between 21 and 50 days (standard physiological range).';
  }

  const numPeriod = parseInt(periodDuration, 10);
  if (isNaN(numPeriod) || numPeriod < 2 || numPeriod > 10) {
    errors.periodDuration = 'Period bleeding duration must be between 2 and 10 days.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
