/**
 * RunForm Component
 * 
 * Main form component for submitting URLs and running chaos tests.
 * Handles URL input, validation, submission, and displays real-time test progress.
 * 
 * Features:
 * - URL validation and normalization
 * - Real-time test progress tracking via WebSocket
 * - Recent URLs quick access
 * - Elapsed time display
 * - Test status cards with live updates
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onReportReceived - Callback when test report is received
 * @param {boolean} props.loading - Whether tests are currently running
 * @param {Function} props.setLoading - Function to update loading state
 * @param {Array} props.liveEvents - Array of live test progress events from WebSocket
 */
import { useState, useEffect, useRef } from 'react';
import { runChaosTest } from '../lib/api';
import { validateAndNormalizeUrl } from '../utils/urlValidator';
import { addToRecentUrls, getRecentUrls } from '../utils/storage';
import { formatDuration } from '../utils/formatUtils';

export default function RunForm({ onReportReceived, loading, setLoading, liveEvents = [] }) {
  /**
   * Component State
   * - url: Current URL input value
   * - error: Error message to display (if any)
   * - elapsedMs: Elapsed time in milliseconds since test started
   */
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  
  /**
   * Timer reference for cleanup
   * Used to track elapsed time during test execution
   */
  const timerRef = useRef(null);

  /**
   * Timer Effect
   * Starts/stops elapsed time counter based on loading state.
   * Updates every 200ms for smooth time display.
   */
  useEffect(() => {
    if (loading) {
      const start = Date.now();
      setElapsedMs(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - start);
      }, 200);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading]);

  /**
   * Test definitions - comprehensive list of all chaos tests
   * Used for tracking progress and displaying test cards
   */
  const TEST_DEFINITIONS = [
    { name: 'Response Time', color: 'yellow', description: 'Measures HTTP response latency' },
    { name: 'Concurrent Load', color: 'blue', description: 'Tests handling of simultaneous requests' },
    { name: 'UI Health Check', color: 'green', description: 'Validates UI accessibility and structure' },
    { name: 'Performance Consistency', color: 'purple', description: 'Detects memory leaks and degradation' },
    { name: 'Heavy Load Stress', color: 'orange', description: 'Stresses server CPU with large requests' },
    { name: 'Rate Limiting', color: 'cyan', description: 'Tests rate limiting behavior' },
    { name: 'Error Handling', color: 'red', description: 'Validates error recovery mechanisms' },
    { name: 'Endpoint Resilience', color: 'indigo', description: 'Tests cascading failure scenarios' }
  ];

  /**
   * Calculate number of completed tests based on live events
   * A test is considered complete when it has a 'passed' or 'failed' status
   */
  const testsCompleted = TEST_DEFINITIONS.filter((test) => {
    const events = liveEvents.filter(e => e.testName === test.name);
    const last = events.length > 0 ? events[events.length - 1] : null;
    return last && (last.status === 'passed' || last.status === 'failed');
  }).length;

  /**
   * Format elapsed time in seconds with one decimal place
   */
  const elapsedSeconds = (elapsedMs / 1000).toFixed(1);

  /**
   * Handle form submission
   * Validates URL, normalizes it, and initiates chaos tests
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate and normalize URL
    const validation = validateAndNormalizeUrl(url);
    
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Save to recent URLs
      addToRecentUrls(validation.normalized);
      
      // Run chaos tests with normalized URL
      const report = await runChaosTest(validation.normalized);
      
      // Wait for all updates to be visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoading(false);
      
      // Small delay before showing report
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onReportReceived(report);
    } catch (err) {
      console.error('[RunForm] Test error:', err);
      setError(err.message || 'Failed to run health check. Please ensure the backend is running and the URL is accessible.');
      setLoading(false);
    }
  };

  /**
   * Get recent URLs for quick access
   */
  const recentUrls = getRecentUrls(5);

  /**
   * Handle clicking a recent URL
   * @param {string} recentUrl - URL to use
   */
  const handleRecentUrlClick = (recentUrl) => {
    setUrl(recentUrl);
    setError(null);
  };

  /**
   * Check if input looks like a valid URL format
   * This is a quick check before full validation
   */
  const isValidUrlFormat = (value) => {
    if (!value || typeof value !== 'string') {
      return false;
    }
    
    const trimmed = value.trim();
    
    // Empty string is invalid
    if (trimmed.length === 0) {
      return false;
    }
    
    // Must start with http:// or https://, OR look like a domain (has dot and valid TLD)
    const hasProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://');
    const looksLikeDomain = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}/.test(trimmed);
    
    return hasProtocol || looksLikeDomain;
  };

  // Check if URL is valid for button state
  const isUrlValid = isValidUrlFormat(url) && validateAndNormalizeUrl(url).isValid;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-neutral-950/90 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors text-sm sm:text-base"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isUrlValid}
          className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-3.5 sm:py-3.5 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Running...' : 'Start test'}
        </button>

        {/* Recent URLs */}
        {recentUrls.length > 0 && !loading && (
          <div className="pt-2">
            <p className="text-xs text-neutral-500 mb-2">Recent URLs:</p>
            <div className="flex flex-wrap gap-2">
              {recentUrls.map((recentUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleRecentUrlClick(recentUrl)}
                  className="px-3 py-1 text-xs bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors border border-neutral-800"
                  title={`Click to use: ${recentUrl}`}
                >
                  {recentUrl.length > 40 ? `${recentUrl.substring(0, 40)}...` : recentUrl}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Live Health Checks */}
      {loading && (
        <div className="space-y-4">
          {/* Dashboard Header */}
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Running health checks</h3>
                  <p className="text-xs text-neutral-500">
                    {testsCompleted} of {TEST_DEFINITIONS.length} tests completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-neutral-900/90 border border-neutral-700 rounded-full text-xs text-neutral-400 font-mono">
                  {elapsedSeconds}s
                </div>
              </div>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEST_DEFINITIONS.map((test, idx) => {
              const { name, color } = test;
              const events = liveEvents.filter(e => e.testName === name);
              const event = events.length > 0 ? events[events.length - 1] : null;
              const status = event ? event.status : 'pending';
              const isActive = status === 'running';

              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl border border-neutral-800 transition-colors ${
                    isActive
                      ? 'bg-neutral-900/80 border-neutral-600'
                      : status === 'passed'
                      ? 'bg-neutral-900/40 border-green-700/60'
                      : status === 'failed'
                      ? 'bg-neutral-900/40 border-red-700/60'
                      : 'bg-neutral-900/40'
                  }`}
                >
                  <div className="relative p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            isActive
                              ? 'text-white'
                              : status === 'passed'
                              ? 'text-green-400'
                              : status === 'failed'
                              ? 'text-red-400'
                              : 'text-neutral-400'
                          }`}
                        >
                          {name}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {status === 'pending' && (
                          <div className="w-2 h-2 rounded-full bg-neutral-700" />
                        )}
                        {status === 'running' && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                        {status === 'passed' && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                        {status === 'failed' && (
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </div>
                    </div>

                    {event && (
                      <div className="space-y-1">
                        {event.details?.action && (
                          <div
                            className={`text-xs ${
                              isActive ? 'text-neutral-200' : 'text-neutral-400'
                            }`}
                          >
                            {event.details.action}
                          </div>
                        )}
                        {event.details?.metric && (
                          <div className="text-xs text-neutral-600">
                            {event.details.metric}
                          </div>
                        )}
                      </div>
                    )}

                    {!event && status === 'pending' && (
                      <div className="text-xs text-neutral-600">Waiting to start...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
