/**
 * SheSync Safe LocalStorage Utility
 * Isolates demo keys with a 'shesync_' prefix and handles errors gracefully.
 */

const STORAGE_PREFIX = 'shesync_';

export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) return fallback;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[SheSync Storage] Failed to read ${key}:`, err);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[SheSync Storage] Failed to write ${key}:`, err);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (err) {
      console.error(`[SheSync Storage] Failed to remove ${key}:`, err);
      return false;
    }
  },

  /**
   * Clears ONLY keys beginning with 'shesync_' to protect other browser storage.
   */
  clearAllSheSyncData: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (err) {
      console.error('[SheSync Storage] Failed to clear demo data:', err);
      return false;
    }
  }
};
