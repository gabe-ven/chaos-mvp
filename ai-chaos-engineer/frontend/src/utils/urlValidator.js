/**
 * URL Validation Utilities
 * 
 * Comprehensive URL validation and normalization functions
 * Used throughout the application for input validation and URL processing
 */

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 * @param {string} url - The URL string to validate
 * @returns {boolean} - True if URL is valid, false otherwise
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim();
  
  // Basic protocol check
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }

  try {
    const urlObj = new URL(trimmed);
    
    // Ensure it has a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }

    // Block localhost and private IPs for security (SSRF protection)
    const hostname = urlObj.hostname.toLowerCase();
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1'
    ];

    if (blockedHosts.includes(hostname)) {
      return false;
    }

    // Block private IP ranges
    if (hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.16.') ||
        hostname.startsWith('172.17.') ||
        hostname.startsWith('172.18.') ||
        hostname.startsWith('172.19.') ||
        hostname.startsWith('172.20.') ||
        hostname.startsWith('172.21.') ||
        hostname.startsWith('172.22.') ||
        hostname.startsWith('172.23.') ||
        hostname.startsWith('172.24.') ||
        hostname.startsWith('172.25.') ||
        hostname.startsWith('172.26.') ||
        hostname.startsWith('172.27.') ||
        hostname.startsWith('172.28.') ||
        hostname.startsWith('172.29.') ||
        hostname.startsWith('172.30.') ||
        hostname.startsWith('172.31.')) {
      return false;
    }

    return true;
  } catch (error) {
    // URL constructor throws if invalid
    return false;
  }
}

/**
 * Normalizes a URL by adding protocol if missing and trimming whitespace
 * @param {string} url - The URL string to normalize
 * @returns {string|null} - Normalized URL or null if invalid
 */
export function normalizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  
  if (trimmed.length === 0) {
    return null;
  }

  // Add https:// if no protocol specified
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Extracts domain from a URL
 * @param {string} url - The URL string
 * @returns {string|null} - Domain name or null if invalid
 */
export function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
}

/**
 * Validates and normalizes a URL, returning both the normalized URL and validation result
 * @param {string} url - The URL string to process
 * @returns {{isValid: boolean, normalized: string|null, error: string|null}} - Validation result
 */
export function validateAndNormalizeUrl(url) {
  const normalized = normalizeUrl(url);
  
  if (!normalized) {
    return {
      isValid: false,
      normalized: null,
      error: 'Please enter a valid URL'
    };
  }

  if (!isValidUrl(normalized)) {
    return {
      isValid: false,
      normalized: normalized,
      error: 'URL must be a valid HTTP/HTTPS address. Localhost and private IPs are not allowed for security reasons.'
    };
  }

  return {
    isValid: true,
    normalized: normalized,
    error: null
  };
}

