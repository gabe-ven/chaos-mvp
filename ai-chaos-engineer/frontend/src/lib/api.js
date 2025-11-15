const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Runs chaos tests on the given URL
 */
export async function runChaosTest(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // More descriptive error messages
    if (error.message === 'Failed to fetch') {
      throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure the backend is running on port 3001.`);
    }
    throw error;
  }
}

/**
 * Checks if the API is healthy
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}



