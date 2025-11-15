/**
 * Date and Time Utilities
 * 
 * Comprehensive date formatting and manipulation functions.
 * Provides consistent date handling throughout the application.
 */

/**
 * Format date to ISO string
 * @param {Date|string|number} date - Date to format
 * @returns {string} - ISO date string
 */
export function toISOString(date) {
  if (!date) {
    return new Date().toISOString();
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString();
  }

  return dateObj.toISOString();
}

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const {
    includeTime = true,
    includeSeconds = false,
    locale = 'en-US',
    timeZone = 'UTC'
  } = options;

  if (!date) {
    return 'Unknown';
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone
    };

    if (includeTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
      
      if (includeSeconds) {
        formatOptions.second = '2-digit';
      }
    }

    return dateObj.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.error('[DateUtils] Format error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date to relative time (e.g., "2 minutes ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) {
    return 'Unknown';
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const now = new Date();
    const diffMs = now - dateObj;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('[DateUtils] Relative time error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date to time string (HH:MM:SS)
 * @param {Date|string|number} date - Date to format
 * @param {boolean} includeSeconds - Whether to include seconds
 * @returns {string} - Time string
 */
export function formatTime(date, includeSeconds = false) {
  if (!date) {
    return '00:00';
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    if (includeSeconds) {
      const seconds = dateObj.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('[DateUtils] Time format error:', error);
    return 'Invalid Time';
  }
}

/**
 * Get start of day
 * @param {Date} date - Date object
 * @returns {Date} - Start of day
 */
export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 * @param {Date} date - Date object
 * @returns {Date} - End of day
 */
export function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} - True if date is today
 */
export function isToday(date) {
  if (!date) {
    return false;
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    const today = new Date();
    
    return dateObj.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Check if date is yesterday
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} - True if date is yesterday
 */
export function isYesterday(date) {
  if (!date) {
    return false;
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return dateObj.toDateString() === yesterday.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Get days difference between two dates
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date (defaults to now)
 * @returns {number} - Number of days difference
 */
export function daysDifference(date1, date2 = new Date()) {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    const diffMs = Math.abs(d2 - d1);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
}

