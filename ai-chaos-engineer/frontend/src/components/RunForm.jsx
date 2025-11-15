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
    const isValidUrl = /^https?:\/\/.+/.test(trimmedUrl);
    
    if (!isValidUrl) {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL"
            className="w-full px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors text-base"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

              <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full bg-white hover:bg-neutral-100 text-black font-medium py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {loading ? 'Running...' : 'Start Test'}
              </button>
      </form>

      {/* Live Health Checks */}
      {loading && (
        <div className="space-y-4">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/80 rounded-2xl p-6 shadow-xl shadow-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Running health checks</h3>
                  <p className="text-xs text-neutral-500">
                    {testsCompleted} of {testDefinitions.length} tests completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-neutral-900/80 border border-neutral-700 rounded-full text-xs text-neutral-400 font-mono">
                  {elapsedSeconds}s
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Response Time', color: 'yellow' },
              { name: 'Concurrent Load', color: 'blue' },
              { name: 'Performance Consistency', color: 'green' },
              { name: 'Heavy Load Stress', color: 'orange' },
              { name: 'Rate Limiting', color: 'cyan' },
              { name: 'Error Handling', color: 'red' },
              { name: 'Endpoint Resilience', color: 'indigo' }
            ].map(({ name, color }, idx) => {
              const events = liveEvents.filter(e => e.testName === name);
              const event = events.length > 0 ? events[events.length - 1] : null;
              const status = event ? event.status : 'pending';
              const isActive = status === 'running';
              
              const colorClasses = {
                yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
                blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
                green: 'from-green-500/20 to-green-600/5 border-green-500/30',
                orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
                cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
                red: 'from-red-500/20 to-red-600/5 border-red-500/30',
                indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30'
              };
              
              return (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br ${colorClasses[color]} scale-105 shadow-lg` 
                      : status === 'passed'
                      ? 'bg-green-500/5 border-green-500/20'
                      : status === 'failed'
                      ? 'bg-red-500/5 border-red-500/20'
                      : 'bg-neutral-900/50 border-neutral-800'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                  )}
                  
                  <div className="relative p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${
                          isActive ? 'text-white' : status === 'passed' ? 'text-green-400' : status === 'failed' ? 'text-red-400' : 'text-neutral-500'
                        }`}>
                          {name}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {status === 'pending' && (
                          <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                          </div>
                        )}
                        {status === 'running' && (
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <div className="relative">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                              <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                            </div>
                          </div>
                        )}
                        {status === 'passed' && (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {status === 'failed' && (
                          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {event && (
                      <div className="space-y-1">
                        {event.details?.action && (
                          <div className={`text-xs font-medium ${isActive ? 'text-white/90' : 'text-neutral-400'}`}>
                            {event.details.action}
                          </div>
                        )}
                        {event.details?.metric && (
                          <div className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral-600'}`}>
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
