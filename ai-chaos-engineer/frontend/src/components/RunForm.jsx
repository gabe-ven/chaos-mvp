import { useState, useEffect, useRef } from 'react';
import { runChaosTest } from '../lib/api';

export default function RunForm({ onReportReceived, loading, setLoading, liveEvents = [] }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef(null);

  // Start/stop timer based on loading state
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

  // Compute tests completed so far
  const testDefinitions = [
    'Response Time',
    'Concurrent Load',
    'Performance Consistency',
    'Heavy Load Stress',
    'Rate Limiting',
    'Error Handling',
    'Endpoint Resilience'
  ];

  const testsCompleted = testDefinitions.filter((name) => {
    const events = liveEvents.filter(e => e.testName === name);
    const last = events.length > 0 ? events[events.length - 1] : null;
    return last && (last.status === 'passed' || last.status === 'failed');
  }).length;

  const elapsedSeconds = (elapsedMs / 1000).toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const trimmedUrl = url.trim();
    const valid = /^https?:\/\/.+/.test(trimmedUrl);
    
    if (!valid) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const report = await runChaosTest(url);
      
      // Wait for all updates to be visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoading(false);
      
      // Small delay before showing report
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onReportReceived(report);
    } catch (err) {
      console.error('Test error:', err);
      setError(err.message || 'Failed to run health check');
      setLoading(false);
    }
  };

  // Simple URL validator for button disabled state
  const isValidUrl = (value) => /^https?:\/\/.+/.test(value.trim());

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
          disabled={loading || !isValidUrl(url)}
          className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-3.5 sm:py-3.5 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Running...' : 'Start test'}
        </button>
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
                    {testsCompleted} of {testDefinitions.length} tests completed
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
            {[
              'Response Time',
              'Concurrent Load',
              'Performance Consistency',
              'Heavy Load Stress',
              'Rate Limiting',
              'Error Handling',
              'Endpoint Resilience'
            ].map((name, idx) => {
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
