/**
 * API Client
 * 
 * Handles all HTTP communication with the backend API.
 * Provides error handling, retry logic, and request/response transformation.
 */

/**
 * API Base URL Configuration
 * Uses environment variable or defaults to localhost for development
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Request timeout in milliseconds
 * Prevents requests from hanging indefinitely
 */
const REQUEST_TIMEOUT = 120000; // 2 minutes for long-running tests

/**
 * Creates an AbortController with timeout
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {AbortController} - AbortController instance
 */
function createTimeoutController(timeoutMs = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

/**
 * Handles fetch errors and provides user-friendly error messages
 * @param {Error} error - Fetch error
 * @param {string} context - Context of the error (for logging)
 * @returns {Error} - User-friendly error
 */
function handleFetchError(error, context = 'API request') {
  console.error(`[API] ${context} error:`, error);

  if (error.name === 'AbortError') {
    return new Error('Request timed out. The server may be taking too long to respond.');
  }

  if (error.message === 'Failed to fetch') {
    return new Error(
      `Cannot connect to backend at ${API_BASE_URL}. ` +
      'Please ensure:\n' +
      '• The backend server is running\n' +
      '• The backend is accessible at the configured URL\n' +
      '• There are no network connectivity issues'
    );
  }

  return error;
}

/**
 * Runs chaos tests on the given URL
 * 
 * Makes a POST request to the /run endpoint with the URL.
 * Handles timeouts, errors, and provides detailed error messages.
 * 
 * @param {string} url - URL to test (must be valid HTTP/HTTPS URL)
 * @returns {Promise<Object>} - Test report object
 * @throws {Error} - If request fails or times out
 * 
 * @example
 * const report = await runChaosTest('https://example.com');
 * console.log('Score:', report.score);
 */
export async function runChaosTest(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }

  const { controller, timeoutId } = createTimeoutController();

  try {
    console.log(`[API] Running chaos test for: ${url}`);

    const response = await fetch(`${API_BASE_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.trim() }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, use status text
        const text = await response.text().catch(() => '');
        if (text) {
          errorMessage = text.substring(0, 200); // Limit error message length
        }
      }

      // Provide specific error messages for common status codes
      if (response.status === 400) {
        throw new Error(`Invalid request: ${errorMessage}`);
      } else if (response.status === 404) {
        throw new Error(`Endpoint not found. Please check that the backend is running at ${API_BASE_URL}`);
      } else if (response.status === 500) {
        throw new Error(`Server error: ${errorMessage}. Please try again later.`);
      } else if (response.status === 503) {
        throw new Error(`Service unavailable: ${errorMessage}. The server may be overloaded.`);
      } else {
        throw new Error(errorMessage);
      }
    }

    // Parse and validate response
    const report = await response.json();
    
    // Basic validation of report structure
    if (!report || typeof report !== 'object') {
      throw new Error('Invalid response format from server');
    }

    if (typeof report.score !== 'number') {
      console.warn('[API] Report missing score, may be incomplete');
    }

    console.log(`[API] Test completed successfully. Score: ${report.score || 'N/A'}`);
    return report;

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Re-throw if it's already a user-friendly error
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }

    // Transform fetch errors to user-friendly messages
    throw handleFetchError(error, 'Chaos test');
  }
}

/**
 * Checks if the API is healthy and accessible
 * 
 * Makes a GET request to the /health endpoint.
 * Useful for checking backend connectivity before running tests.
 * 
 * @returns {Promise<Object>} - Health check response
 * @throws {Error} - If health check fails
 * 
 * @example
 * try {
 *   const health = await checkHealth();
 *   console.log('Backend is healthy:', health.status);
 * } catch (error) {
 *   console.error('Backend is not accessible');
 * }
 */
export async function checkHealth() {
  const { controller, timeoutId } = createTimeoutController(5000); // 5 second timeout for health check

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw handleFetchError(error, 'Health check');
  }
}

/**
 * Gets the API base URL
 * Useful for displaying connection information
 * @returns {string} - API base URL
 */
export function getApiBaseUrl() {
  return API_BASE_URL;
}
