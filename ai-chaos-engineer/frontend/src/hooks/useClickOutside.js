import { useEffect, useRef } from 'react';

/**
 * useClickOutside Hook
 * 
 * Detects clicks outside of a specified element.
 * Useful for closing modals, dropdowns, and other overlay components.
 * 
 * @param {Function} handler - Callback function when click outside is detected
 * @param {Array} dependencies - Dependencies array for the effect
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * const ref = useClickOutside(() => setIsOpen(false));
 * 
 * return (
 *   <div ref={ref}>
 *     {isOpen && <Dropdown />}
 *   </div>
 * );
 */
export function useClickOutside(handler, dependencies = []) {
  const ref = useRef(null);

  useEffect(() => {
    /**
     * Handle click outside
     * @param {MouseEvent} event - Click event
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, ...dependencies]);

  return ref;
}

