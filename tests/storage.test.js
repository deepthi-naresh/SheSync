import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../src/utils/storage';

describe('SheSync Safe Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly sets and retrieves data with shesync_ prefix', () => {
    storage.set('theme', 'dark');
    expect(localStorage.getItem('shesync_theme')).toBe(JSON.stringify('dark'));
    expect(storage.get('theme')).toBe('dark');
  });

  it('returns fallback value if key does not exist', () => {
    expect(storage.get('non_existent_key', 'default_value')).toBe('default_value');
  });

  it('safely clears only shesync_ keys without touching other browser keys', () => {
    // Set shesync demo keys
    storage.set('cycles', [{ day: 1 }]);
    storage.set('cart', [{ id: 'prod-1' }]);

    // Set unrelated browser keys
    localStorage.setItem('other_app_user', 'alice123');
    localStorage.setItem('analytics_session', '987654');

    // Run SheSync clean
    const result = storage.clearAllSheSyncData();
    expect(result).toBe(true);

    // Verify SheSync keys are gone
    expect(storage.get('cycles')).toBe(null);
    expect(storage.get('cart')).toBe(null);

    // Verify unrelated keys are intact
    expect(localStorage.getItem('other_app_user')).toBe('alice123');
    expect(localStorage.getItem('analytics_session')).toBe('987654');
  });
});
