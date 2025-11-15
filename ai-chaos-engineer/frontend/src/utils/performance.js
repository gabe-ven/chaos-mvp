/**
 * Performance Utilities
 * 
 * Functions for measuring and monitoring application performance.
 * Useful for debugging and optimization.
 */

/**
 * Performance measurement marker
 * Creates a performance mark for measuring execution time.
 * 
 * @param {string} name - Marker name
 * @returns {Function} - Function to end measurement and log result
 * 
 * @example
 * const endMeasure = startPerformanceMeasure('test-execution');
 * // ... do work ...
 * endMeasure(); // Logs: "test-execution took Xms"
 */
export function startPerformanceMeasure(name) {
  if (typeof performance === 'undefined' || !performance.mark) {
    // Fallback for environments without Performance API
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      console.log(`[Performance] ${name} took ${duration}ms`);
    };
  }

  performance.mark(`${name}-start`);

  return () => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`[Performance] ${name} took ${measure.duration.toFixed(2)}ms`);
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
  };
}

/**
 * Measure async function execution time
 * Wraps an async function and measures its execution time.
 * 
 * @param {string} name - Measurement name
 * @param {Function} fn - Async function to measure
 * @returns {Function} - Wrapped function
 * 
 * @example
 * const measuredFetch = measureAsync('api-call', fetch);
 * const result = await measuredFetch('/api/data');
 */
export function measureAsync(name, fn) {
  return async (...args) => {
    const endMeasure = startPerformanceMeasure(name);
    try {
      const result = await fn(...args);
      endMeasure();
      return result;
    } catch (error) {
      endMeasure();
      throw error;
    }
  };
}

/**
 * Get memory usage (if available)
 * Returns current memory usage in bytes.
 * 
 * @returns {Object|null} - Memory usage object or null if not available
 */
export function getMemoryUsage() {
  if (typeof performance === 'undefined' || !performance.memory) {
    return null;
  }

  return {
    used: performance.memory.usedJSHeapSize,
    total: performance.memory.totalJSHeapSize,
    limit: performance.memory.jsHeapSizeLimit
  };
}

/**
 * Log memory usage
 * Logs current memory usage to console.
 */
export function logMemoryUsage() {
  const memory = getMemoryUsage();
  if (memory) {
    console.log('[Performance] Memory Usage:', {
      used: `${(memory.used / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.total / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.limit / 1024 / 1024).toFixed(2)} MB`
    });
  } else {
    console.log('[Performance] Memory usage not available');
  }
}

/**
 * Throttle function calls based on frame rate
 * Limits function execution to once per animation frame.
 * 
 * @param {Function} fn - Function to throttle
 * @returns {Function} - Throttled function
 */
export function throttleByFrame(fn) {
  let rafId = null;
  let lastArgs = null;

  return function executedFunction(...args) {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        fn(...lastArgs);
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

/**
 * Check if page is visible
 * Returns whether the page is currently visible to the user.
 * 
 * @returns {boolean} - True if page is visible
 */
export function isPageVisible() {
  if (typeof document === 'undefined') {
    return true; // Assume visible on server
  }

  return !document.hidden;
}

/**
 * Monitor page visibility changes
 * Calls callback when page visibility changes.
 * 
 * @param {Function} callback - Callback function
 * @returns {Function} - Cleanup function
 */
export function onVisibilityChange(callback) {
  if (typeof document === 'undefined') {
    return () => {}; // No-op on server
  }

  const handleVisibilityChange = () => {
    callback(!document.hidden);
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

