/**
 * Validation Utilities
 * 
 * Comprehensive validation functions for form inputs, data, and user input.
 * Provides reusable validation logic with clear error messages.
 */

/**
 * Email validation regex pattern
 * Matches standard email format
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation regex pattern
 * Matches HTTP/HTTPS URLs
 */
const URL_PATTERN = /^https?:\/\/.+/;

/**
 * GitHub repository URL pattern
 * Matches GitHub repository URLs
 */
const GITHUB_PATTERN = /^https?:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+/;

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Email cannot be empty'
    };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long (maximum 254 characters)'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'URL is required'
    };
  }

  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'URL cannot be empty'
    };
  }

  if (trimmed.length > 2048) {
    return {
      isValid: false,
      error: 'URL is too long (maximum 2048 characters)'
    };
  }

  if (!URL_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      error: 'URL must start with http:// or https://'
    };
  }

  try {
    const urlObj = new URL(trimmed);
    
    // Validate hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return {
        isValid: false,
        error: 'URL must have a valid hostname'
      };
    }

    // Block localhost and private IPs (SSRF protection)
    const hostname = urlObj.hostname.toLowerCase();
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    
    if (blockedHosts.includes(hostname)) {
      return {
        isValid: false,
        error: 'Localhost and private IPs are not allowed for security reasons'
      };
    }

    // Block private IP ranges
    if (hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        (hostname.startsWith('172.') && 
         parseInt(hostname.split('.')[1]) >= 16 && 
         parseInt(hostname.split('.')[1]) <= 31)) {
      return {
        isValid: false,
        error: 'Private IP addresses are not allowed for security reasons'
      };
    }

    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid URL format'
    };
  }
}

/**
 * Validates a GitHub repository URL
 * @param {string} url - URL to validate
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateGitHubUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'GitHub URL is required'
    };
  }

  const trimmed = url.trim();

  if (!GITHUB_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates a string length
 * @param {string} value - String to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum length
 * @param {number} options.max - Maximum length
 * @param {string} options.fieldName - Field name for error messages
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateLength(value, options = {}) {
  const { min = 0, max = Infinity, fieldName = 'Field' } = options;

  if (typeof value !== 'string') {
    return {
      isValid: false,
      error: `${fieldName} must be a string`
    };
  }

  const length = value.trim().length;

  if (length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} character${min !== 1 ? 's' : ''}`
    };
  }

  if (length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max} character${max !== 1 ? 's' : ''}`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates a number
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {boolean} options.integer - Whether value must be an integer
 * @param {string} options.fieldName - Field name for error messages
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateNumber(value, options = {}) {
  const { min = -Infinity, max = Infinity, integer = false, fieldName = 'Number' } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (integer && !Number.isInteger(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be an integer`
    };
  }

  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max}`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error messages
 * @returns {{isValid: boolean, error: string|null}} - Validation result
 */
export function validateRequired(value, fieldName = 'Field') {
  if (value === null || value === undefined) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty`
    };
  }

  if (Array.isArray(value) && value.length === 0) {
    return {
      isValid: false,
      error: `${fieldName} must have at least one item`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates multiple fields at once
 * @param {Object} fields - Object mapping field names to validation functions
 * @returns {{isValid: boolean, errors: Object}} - Validation result
 */
export function validateFields(fields) {
  const errors = {};
  let isValid = true;

  for (const [fieldName, validator] of Object.entries(fields)) {
    const result = typeof validator === 'function' ? validator() : validator;
    
    if (!result.isValid) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  }

  return {
    isValid,
    errors
  };
}

