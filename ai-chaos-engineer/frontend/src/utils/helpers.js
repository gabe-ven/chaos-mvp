/**
 * General Helper Functions
 * 
 * Utility functions used throughout the application.
 * Provides common operations and data transformations.
 */

/**
 * Debounce function
 * Delays function execution until after a specified time has passed
 * since the last time it was invoked.
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately on first call
 * @returns {Function} - Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => {
 *   performSearch(query);
 * }, 300);
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function
 * Limits function execution to at most once per specified time period.
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   handleScroll();
 * }, 100);
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone an object
 * Creates a deep copy of an object, handling nested objects and arrays.
 * 
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 * 
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} - True if value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' && value.trim().length === 0) {
    return true;
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  
  return false;
}

/**
 * Get nested object property safely
 * Returns the value at the given path, or a default value if the path doesn't exist.
 * 
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-separated path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} - Value at path or default value
 * 
 * @example
 * const user = { profile: { name: 'John' } };
 * const name = getNestedValue(user, 'profile.name', 'Unknown');
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  if (!obj || typeof obj !== 'object') {
    return defaultValue;
  }
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Generate a unique ID
 * Creates a unique identifier using timestamp and random number.
 * 
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Unique ID string
 * 
 * @example
 * const id = generateId('test'); // 'test-1234567890-abc123'
 */
export function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Sleep/delay function
 * Returns a promise that resolves after the specified time.
 * 
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that resolves after the delay
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * Retries a function a specified number of times with increasing delays.
 * 
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise} - Result of the function
 * 
 * @example
 * const result = await retryWithBackoff(
 *   () => fetchData(),
 *   3, // max attempts
 *   1000 // initial delay
 * );
 */
export async function retryWithBackoff(fn, maxAttempts = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        const delay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[Retry] Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Format file size from bytes
 * Converts bytes to human-readable file size.
 * 
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted file size
 * 
 * @example
 * formatFileSize(1024); // '1 KB'
 * formatFileSize(1048576); // '1 MB'
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Sanitize HTML string
 * Removes potentially dangerous HTML tags and attributes.
 * 
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (typeof html !== 'string') {
    return '';
  }
  
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Check if code is running in browser environment
 * @returns {boolean} - True if running in browser
 */
export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if code is running in development mode
 * @returns {boolean} - True if in development
 */
export function isDevelopment() {
  return import.meta.env.DEV || process.env.NODE_ENV === 'development';
}

/**
 * Check if code is running in production mode
 * @returns {boolean} - True if in production
 */
export function isProduction() {
  return import.meta.env.PROD || process.env.NODE_ENV === 'production';
}

/**
 * Get environment variable with fallback
 * @param {string} key - Environment variable key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Environment variable value or default
 */
export function getEnv(key, defaultValue = null) {
  if (isBrowser() && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
}

/**
 * Class name utility
 * Combines class names, filtering out falsy values.
 * 
 * @param {...(string|Object)} classes - Class names or objects
 * @returns {string} - Combined class names
 * 
 * @example
 * cn('foo', 'bar', { 'baz': true, 'qux': false }); // 'foo bar baz'
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') {
        return cls;
      }
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Parse query string parameters from URL
 * @param {string} queryString - Query string (defaults to window.location.search)
 * @returns {Object} - Parsed query parameters
 * 
 * @example
 * const params = parseQueryString('?foo=bar&baz=qux');
 * // { foo: 'bar', baz: 'qux' }
 */
export function parseQueryString(queryString = '') {
  if (isBrowser() && !queryString) {
    queryString = window.location.search;
  }
  
  const params = {};
  const searchParams = new URLSearchParams(queryString);
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} - Query string
 * 
 * @example
 * const query = buildQueryString({ foo: 'bar', baz: 'qux' });
 * // '?foo=bar&baz=qux'
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

