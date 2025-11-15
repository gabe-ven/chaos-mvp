import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Debounces a value, delaying updates until after a specified delay.
 * Useful for search inputs, API calls, and other scenarios where you want
 * to wait for the user to stop typing before performing an action.
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {*} - Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes before delay completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

