import { useState } from 'react';
import { runChaosTest } from '../lib/api';

export default function RunForm({ onReportReceived, loading, setLoading, liveEvents = [] }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const isValidUrl = (urlString) => {
    const trimmed = urlString.trim();
    return trimmed.length > 0 && /^https?:\/\/.+/.test(trimmed);
  };

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
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="relative w-full px-6 py-4 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_25px_rgba(59,130,246,0.4)] focus:shadow-blue-500/40 transition-all duration-300 text-base"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-fade-in">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValidUrl(url)}
          className="relative w-full bg-gradient-to-r from-white to-neutral-100 hover:from-blue-50 hover:to-white text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 disabled:hover:shadow-lg disabled:hover:shadow-white/10 transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Test
            </span>
          )}
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
