/**
 * Formatting Utilities
 * 
 * Common formatting functions for dates, numbers, durations, and other data
 * Used throughout the application for consistent data presentation
 */

/**
 * Formats a duration in milliseconds to a human-readable string
 * @param {number} ms - Duration in milliseconds
 * @param {boolean} showMs - Whether to show milliseconds (default: false for > 1s)
 * @returns {string} - Formatted duration string
 */
export function formatDuration(ms) {
  if (typeof ms !== 'number' || isNaN(ms) || ms < 0) {
    return '0s';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  if (seconds > 0) {
    return `${seconds}s`;
  }

  return `${ms}ms`;
}

/**
 * Formats a number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted number string
 */
export function formatNumber(num, decimals = 0) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Formats a percentage value
 * @param {number} value - Value between 0 and 100
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} - Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a date to a readable string
 * @param {Date|string|number} date - Date to format
 * @param {boolean} includeTime - Whether to include time (default: true)
 * @returns {string} - Formatted date string
 */
export function formatDate(date, includeTime = true) {
  if (!date) {
    return 'Unknown';
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Formats a relative time (e.g., "2 minutes ago")
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

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateObj, false);
    }
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Formats bytes to human-readable size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted size string
 */
export function formatBytes(bytes, decimals = 2) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    return '0 B';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncates a string to a maximum length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
export function truncate(str, maxLength = 50) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + '...';
}

