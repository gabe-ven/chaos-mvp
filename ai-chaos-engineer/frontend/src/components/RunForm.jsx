import { useState } from 'react';
import { runChaosTest } from '../lib/api';

export default function RunForm({ onReportReceived, loading, setLoading, liveEvents = [] }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

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
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      await new Promise(resolve => setTimeout(resolve, 100));
      onReportReceived(report);
    } catch (err) {
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

      {/* Live Test Progress */}
      {loading && (
        <div className="border border-neutral-900 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-400">Running tests</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-neutral-500">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              'Response Time',
              'Concurrent Load',
              'UI Health Check',
              'Performance Consistency',
              'Heavy Load Stress',
              'Rate Limiting',
              'Error Handling',
              'Endpoint Resilience'
            ].map((testName, idx) => {
              const events = liveEvents.filter(e => e.testName === testName);
              const event = events.length > 0 ? events[events.length - 1] : null;
              const status = event ? event.status : 'pending';
              
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-900/50"
                >
                  <div className="flex-1">
                    <div className="text-sm text-neutral-300">{testName}</div>
                    {event && event.details?.action && (
                      <div className="text-xs text-neutral-600 mt-0.5 truncate">
                        {event.details.action}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {status === 'pending' && (
                      <div className="w-2 h-2 rounded-full bg-neutral-700"></div>
                    )}
                    {status === 'running' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    )}
                    {status === 'passed' && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {status === 'failed' && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
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
