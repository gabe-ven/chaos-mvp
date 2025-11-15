import { useEffect } from 'react';

/**
 * useKeyboardShortcuts Hook
 * 
 * Handles keyboard shortcuts throughout the application
 * Provides a clean way to register and handle keyboard events
 * 
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {Array} deps - Dependencies array for the effect
 * 
 * @example
 * useKeyboardShortcuts({
 *   'Escape': () => handleClose(),
 *   'Ctrl+K': (e) => { e.preventDefault(); handleSearch(); },
 *   'Enter': () => handleSubmit()
 * });
 */
export function useKeyboardShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleKeyDown = (event) => {
      // Build key string (e.g., "Ctrl+K", "Escape", "Enter")
      let keyString = '';
      
      if (event.ctrlKey || event.metaKey) {
        keyString += 'Ctrl+';
      }
      if (event.shiftKey) {
        keyString += 'Shift+';
      }
      if (event.altKey) {
        keyString += 'Alt+';
      }
      
      // Add the actual key
      if (event.key === ' ') {
        keyString += 'Space';
      } else if (event.key.length === 1) {
        keyString += event.key.toUpperCase();
      } else {
        keyString += event.key;
      }

      // Check if we have a handler for this key combination
      const handler = shortcuts[keyString];
      
      if (handler) {
        // Prevent default if handler returns false or doesn't explicitly allow it
        const result = handler(event);
        if (result === false || result === undefined) {
          event.preventDefault();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, ...deps]);
}

/**
 * Common keyboard shortcuts for the application
 */
export const COMMON_SHORTCUTS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  CTRL_K: 'Ctrl+K',
  CTRL_ENTER: 'Ctrl+Enter',
  CTRL_S: 'Ctrl+S',
  CTRL_E: 'Ctrl+E'
};

