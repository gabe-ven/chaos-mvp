/**
 * Application Constants
 * 
 * Centralized constants used throughout the application.
 * Makes it easy to update values and maintain consistency.
 */

/**
 * Test Configuration Constants
 */
export const TEST_CONFIG = {
  /**
   * Total number of chaos tests that will be run
   */
  TOTAL_TESTS: 8,

  /**
   * Expected duration for all tests to complete (in seconds)
   */
  EXPECTED_DURATION_SECONDS: 90,

  /**
   * Test names in execution order
   */
  TEST_NAMES: [
    'Response Time',
    'Concurrent Load',
    'UI Health Check',
    'Performance Consistency',
    'Heavy Load Stress',
    'Rate Limiting',
    'Error Handling',
    'Endpoint Resilience'
  ],

  /**
   * Test descriptions for UI display
   */
  TEST_DESCRIPTIONS: {
    'Response Time': 'Measures HTTP response latency and timeout handling',
    'Concurrent Load': 'Tests handling of simultaneous requests under load',
    'UI Health Check': 'Validates UI accessibility, structure, and error handling',
    'Performance Consistency': 'Detects memory leaks and response time degradation',
    'Heavy Load Stress': 'Stresses server CPU with large concurrent requests',
    'Rate Limiting': 'Tests rate limiting behavior and graceful degradation',
    'Error Handling': 'Validates error recovery mechanisms and proper error responses',
    'Endpoint Resilience': 'Tests cascading failure scenarios across multiple endpoints'
  }
};

/**
 * Score Thresholds
 * Used for determining status and color coding
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0
};

/**
 * Severity Levels
 * Used for issue classification
 */
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Severity Configuration
 * Maps severity levels to display properties
 */
export const SEVERITY_CONFIG = {
  [SEVERITY_LEVELS.LOW]: {
    label: 'Low',
    color: 'blue',
    penalty: 0
  },
  [SEVERITY_LEVELS.MEDIUM]: {
    label: 'Medium',
    color: 'yellow',
    penalty: 5
  },
  [SEVERITY_LEVELS.HIGH]: {
    label: 'High',
    color: 'orange',
    penalty: 10
  },
  [SEVERITY_LEVELS.CRITICAL]: {
    label: 'Critical',
    color: 'red',
    penalty: 20
  }
};

/**
 * Status Labels
 * Maps score ranges to status labels
 */
export const STATUS_LABELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  UNKNOWN: 'Unknown'
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /**
   * Animation durations (in milliseconds)
   */
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },

  /**
   * Toast notification duration (in milliseconds)
   */
  TOAST_DURATION: {
    SHORT: 2000,
    NORMAL: 3000,
    LONG: 5000
  },

  /**
   * Debounce delays (in milliseconds)
   */
  DEBOUNCE_DELAY: {
    SEARCH: 300,
    INPUT: 500
  }
};

/**
 * Storage Keys
 * Keys used for localStorage
 */
export const STORAGE_KEYS = {
  TEST_HISTORY: 'chaos_engineer_test_history',
  USER_PREFERENCES: 'chaos_engineer_preferences',
  RECENT_URLS: 'chaos_engineer_recent_urls'
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  /**
   * Request timeout in milliseconds
   */
  TIMEOUT: {
    HEALTH_CHECK: 5000,
    CHAOS_TEST: 120000, // 2 minutes for long-running tests
    DEFAULT: 30000
  },

  /**
   * Retry configuration
   */
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000 // Initial delay in milliseconds
  }
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  /**
   * URL validation patterns
   */
  URL_PATTERN: /^https?:\/\/.+/,

  /**
   * Maximum URL length
   */
  MAX_URL_LENGTH: 2048,

  /**
   * Minimum URL length
   */
  MIN_URL_LENGTH: 10
};

/**
 * Error Messages
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  INVALID_URL: 'Please enter a valid URL starting with http:// or https://',
  URL_REQUIRED: 'URL is required',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. The server may be taking too long to respond.',
  UNKNOWN: 'An unexpected error occurred. Please try again.'
};

/**
 * Success Messages
 * User-friendly success messages
 */
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied to clipboard!',
  EXPORTED: 'Report exported successfully!',
  TEST_STARTED: 'Test started successfully',
  TEST_COMPLETED: 'Test completed successfully'
};

