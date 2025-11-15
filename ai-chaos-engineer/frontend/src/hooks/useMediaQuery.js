import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 
 * Tracks whether a media query matches the current viewport.
 * Useful for responsive design and conditional rendering based on screen size.
 * 
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - True if media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileView /> : <DesktopView />}
 *   </div>
 * );
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    /**
     * Update matches when media query changes
     * @param {MediaQueryListEvent} event - Media query change event
     */
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Common media query hooks for convenience
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)');

