import { useRef, useEffect } from 'react';

/**
 * usePrevious Hook
 * 
 * Stores the previous value of a variable.
 * Useful for comparing current and previous values, detecting changes, etc.
 * 
 * @param {*} value - Value to track
 * @returns {*} - Previous value
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * useEffect(() => {
 *   if (count > prevCount) {
 *     console.log('Count increased');
 *   }
 * }, [count, prevCount]);
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

