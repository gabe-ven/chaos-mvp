import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Provides a React hook interface for localStorage with automatic synchronization.
 * Handles serialization, error handling, and state updates.
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[*, Function]} - Tuple of [value, setValue]
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 * 
 * // Update theme
 * setTheme('light'); // Automatically saves to localStorage
 */
export function useLocalStorage(key, initialValue) {
  /**
   * Get initial value from localStorage or use provided initial value
   */
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Set value in both state and localStorage
   * @param {*} value - Value to set (can be a function)
   */
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`[useLocalStorage] Error setting key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * Remove value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  /**
   * Listen for changes to this key in other tabs/windows
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`[useLocalStorage] Error parsing storage change for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

