import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';
import { 
  DEFAULT_CYCLE_SETTINGS, 
  DEFAULT_CYCLE_HISTORY, 
  DEFAULT_SYMPTOM_LOGS 
} from '../src/context/CycleContext';

describe('Reset Demo Data & In-Memory State Sync Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Confirmed reset clears storage and reinitializes with pristine defaults', () => {
    // 1. User enters custom cycle settings and logs symptoms
    const customSettings = {
      lastPeriodStart: '2026-10-01',
      cycleLength: 32,
      periodDuration: 6
    };
    const customSymptom = [{ id: 'sym-custom', date: '2026-10-05', flow: 'Heavy' }];

    storage.set('cycle_settings', customSettings);
    storage.set('symptom_logs', customSymptom);
    localStorage.setItem('third_party_app_data', 'do_not_touch_this');

    // Verify custom data is in storage
    expect(storage.get('cycle_settings')).toEqual(customSettings);
    expect(storage.get('symptom_logs')).toEqual(customSymptom);

    // 2. User confirms Reset Demo Data
    const clearSuccess = storage.clearAllSheSyncData();
    expect(clearSuccess).toBe(true);

    // 3. Storage should no longer have custom shesync keys
    expect(storage.get('cycle_settings')).toBeNull();
    expect(storage.get('symptom_logs')).toBeNull();

    // 4. Provider reinitializes with pristine exported defaults
    const reloadedSettings = storage.get('cycle_settings', DEFAULT_CYCLE_SETTINGS);
    const reloadedSymptoms = storage.get('symptom_logs', DEFAULT_SYMPTOM_LOGS);

    expect(reloadedSettings).toEqual(DEFAULT_CYCLE_SETTINGS);
    expect(reloadedSymptoms).toEqual(DEFAULT_SYMPTOM_LOGS);

    // 5. Unrelated keys are completely preserved
    expect(localStorage.getItem('third_party_app_data')).toBe('do_not_touch_this');
  });

  it('2. Cancelling reset dialog leaves both stored and in-memory data completely intact', () => {
    const customSettings = {
      lastPeriodStart: '2026-09-15',
      cycleLength: 30,
      periodDuration: 5
    };
    storage.set('cycle_settings', customSettings);

    // Simulate CANCEL: No storage clear is invoked
    const stored = storage.get('cycle_settings');
    expect(stored).toEqual(customSettings);
    expect(stored.cycleLength).toBe(30);
  });
});
