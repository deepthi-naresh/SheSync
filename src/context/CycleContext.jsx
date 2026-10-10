import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '../utils/storage';
import { 
  calculateCycleMetrics, 
  formatDateISO, 
  addDays, 
  normalizeDate 
} from '../utils/cycleCalculations';

const CycleContext = createContext();

export const DEFAULT_CYCLE_SETTINGS = {
  lastPeriodStart: formatDateISO(addDays(new Date(), -12)), // Defaults to Day 13 (Follicular/Ovulation transition)
  cycleLength: 28,
  periodDuration: 5
};

export const DEFAULT_CYCLE_HISTORY = [
  {
    id: 'hist-1',
    startDate: formatDateISO(addDays(new Date(), -40)),
    endDate: formatDateISO(addDays(new Date(), -35)),
    cycleLength: 28,
    notes: 'Regular flow, mild day 1 cramps.'
  },
  {
    id: 'hist-2',
    startDate: formatDateISO(addDays(new Date(), -68)),
    endDate: formatDateISO(addDays(new Date(), -63)),
    cycleLength: 28,
    notes: 'Hydrated well, normal fatigue.'
  }
];

export const DEFAULT_SYMPTOM_LOGS = [
  {
    id: 'sym-1',
    date: formatDateISO(new Date()),
    flow: 'None',
    painLevel: 1,
    energy: 'High',
    moods: ['Happy', 'Focused'],
    cervicalMucus: 'Creamy',
    notes: 'Felt energetic during morning workout.'
  },
  {
    id: 'sym-2',
    date: formatDateISO(addDays(new Date(), -12)),
    flow: 'Medium',
    painLevel: 3,
    energy: 'Low',
    moods: ['Sensitive', 'Fatigued'],
    cervicalMucus: 'Dry',
    notes: 'Day 1 period onset. Used warm compress.'
  }
];

export function CycleProvider({ children }) {
  const [settings, setSettings] = useState(() => storage.get('cycle_settings', DEFAULT_CYCLE_SETTINGS));
  const [cycleHistory, setCycleHistory] = useState(() => storage.get('cycle_history', DEFAULT_CYCLE_HISTORY));
  const [symptomLogs, setSymptomLogs] = useState(() => storage.get('symptom_logs', DEFAULT_SYMPTOM_LOGS));

  // Reset all in-memory cycle state to pristine defaults
  const resetCycleState = useCallback(() => {
    setSettings(DEFAULT_CYCLE_SETTINGS);
    setCycleHistory(DEFAULT_CYCLE_HISTORY);
    setSymptomLogs(DEFAULT_SYMPTOM_LOGS);
  }, []);

  // Sync to local storage
  useEffect(() => {
    storage.set('cycle_settings', settings);
  }, [settings]);

  useEffect(() => {
    storage.set('cycle_history', cycleHistory);
  }, [cycleHistory]);

  useEffect(() => {
    storage.set('symptom_logs', symptomLogs);
  }, [symptomLogs]);

  // Dynamically calculate metrics and phase predictions
  const metrics = useMemo(() => {
    return calculateCycleMetrics({
      lastPeriodStart: settings.lastPeriodStart,
      cycleLength: settings.cycleLength,
      periodDuration: settings.periodDuration,
      cycleHistory
    });
  }, [settings, cycleHistory]);

  // Update Settings
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Log a new Period Start
  const logPeriodStart = useCallback((startDate, endDate = null, notes = '', cycleLengthOverride = null) => {
    const formattedStart = formatDateISO(startDate);
    if (!formattedStart) return false;

    const currentDuration = settings.periodDuration || 5;
    const formattedEnd = endDate ? formatDateISO(endDate) : formatDateISO(addDays(formattedStart, currentDuration - 1));
    const effectiveCycleLength = cycleLengthOverride ? Number(cycleLengthOverride) : (settings.cycleLength || 28);

    // Update current active start date
    setSettings((prev) => ({
      ...prev,
      lastPeriodStart: formattedStart,
      ...(cycleLengthOverride ? { cycleLength: effectiveCycleLength } : {})
    }));

    // Add entry to history
    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      startDate: formattedStart,
      endDate: formattedEnd,
      cycleLength: effectiveCycleLength,
      notes: notes || 'Logged cycle entry'
    };

    setCycleHistory((prev) => [newHistoryItem, ...prev.filter(h => h.startDate !== formattedStart)]);
    return true;
  }, [settings]);

  // Delete a cycle history entry
  const deleteHistoryEntry = useCallback((id) => {
    setCycleHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Daily Symptom Logging
  const logDailySymptom = useCallback((entry) => {
    const formattedDate = formatDateISO(entry.date);
    if (!formattedDate) return false;

    setSymptomLogs((prev) => {
      const filtered = prev.filter((item) => item.date !== formattedDate);
      const newEntry = {
        id: entry.id || `sym-${Date.now()}`,
        date: formattedDate,
        flow: entry.flow || 'None',
        painLevel: Number(entry.painLevel) || 1,
        energy: entry.energy || 'Moderate',
        moods: Array.isArray(entry.moods) ? entry.moods : [],
        cervicalMucus: entry.cervicalMucus || 'None',
        notes: entry.notes || ''
      };
      return [newEntry, ...filtered];
    });
    return true;
  }, []);

  // Delete a daily symptom log
  const deleteSymptomLog = useCallback((dateOrId) => {
    setSymptomLogs((prev) => prev.filter((item) => item.id !== dateOrId && item.date !== dateOrId));
  }, []);

  // Get symptom entry for specific date
  const getSymptomForDate = useCallback((date) => {
    const formatted = formatDateISO(date);
    return symptomLogs.find((log) => log.date === formatted) || null;
  }, [symptomLogs]);

  return (
    <CycleContext.Provider value={{
      settings,
      cycleHistory,
      symptomLogs,
      metrics,
      updateSettings,
      logPeriodStart,
      deleteHistoryEntry,
      logDailySymptom,
      deleteSymptomLog,
      getSymptomForDate,
      resetCycleState
    }}>
      {children}
    </CycleContext.Provider>
  );
}

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}
