/**
 * LocalStorage Utilities
 * 
 * Wrapper functions for localStorage with error handling and type safety
 * Used for persisting user preferences, test history, and other client-side data
 */

const STORAGE_KEYS = {
  TEST_HISTORY: 'chaos_engineer_test_history',
  USER_PREFERENCES: 'chaos_engineer_preferences',
  RECENT_URLS: 'chaos_engineer_recent_urls'
};

/**
 * Checks if localStorage is available
 * @returns {boolean} - True if localStorage is available
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Safely gets an item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Stored value or default value
 */
export function getStorageItem(key, defaultValue = null) {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`[Storage] Failed to get item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely sets an item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export function setStorageItem(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to set item "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - True if successful, false otherwise
 */
export function removeStorageItem(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to remove item "${key}":`, error);
    return false;
  }
}

/**
 * Gets test history from localStorage
 * @param {number} limit - Maximum number of items to return (default: 10)
 * @returns {Array} - Array of test history items
 */
export function getTestHistory(limit = 10) {
  const history = getStorageItem(STORAGE_KEYS.TEST_HISTORY, []);
  return Array.isArray(history) ? history.slice(0, limit) : [];
}

/**
 * Adds a test result to history
 * @param {Object} testResult - Test result object
 * @param {number} maxHistory - Maximum history items to keep (default: 50)
 * @returns {boolean} - True if successful
 */
export function addToTestHistory(testResult, maxHistory = 50) {
  const history = getTestHistory(maxHistory * 2); // Get more than needed
  
  // Add new result at the beginning
  const newHistory = [
    {
      ...testResult,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    },
    ...history
  ].slice(0, maxHistory); // Keep only the most recent items

  return setStorageItem(STORAGE_KEYS.TEST_HISTORY, newHistory);
}

/**
 * Clears test history
 * @returns {boolean} - True if successful
 */
export function clearTestHistory() {
  return removeStorageItem(STORAGE_KEYS.TEST_HISTORY);
}

/**
 * Gets recent URLs from localStorage
 * @param {number} limit - Maximum number of URLs to return (default: 5)
 * @returns {Array<string>} - Array of recent URLs
 */
export function getRecentUrls(limit = 5) {
  const urls = getStorageItem(STORAGE_KEYS.RECENT_URLS, []);
  return Array.isArray(urls) ? urls.slice(0, limit) : [];
}

/**
 * Adds a URL to recent URLs list
 * @param {string} url - URL to add
 * @param {number} maxUrls - Maximum URLs to keep (default: 10)
 * @returns {boolean} - True if successful
 */
export function addToRecentUrls(url, maxUrls = 10) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const recent = getRecentUrls(maxUrls * 2);
  
  // Remove if already exists
  const filtered = recent.filter(u => u !== url);
  
  // Add to beginning
  const newRecent = [url, ...filtered].slice(0, maxUrls);

  return setStorageItem(STORAGE_KEYS.RECENT_URLS, newRecent);
}

/**
 * Gets user preferences from localStorage
 * @returns {Object} - User preferences object
 */
export function getUserPreferences() {
  return getStorageItem(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'dark',
    animations: true,
    notifications: true
  });
}

/**
 * Updates user preferences
 * @param {Object} preferences - Preferences object to merge
 * @returns {boolean} - True if successful
 */
export function updateUserPreferences(preferences) {
  const current = getUserPreferences();
  const updated = { ...current, ...preferences };
  return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, updated);
}

export { STORAGE_KEYS };

