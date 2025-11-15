import { useState, useEffect } from 'react';
import { runChaosTest } from '../lib/api';

export default function RunForm({ onReportReceived, loading, setLoading, liveEvents = [] }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL or repository');
      return;
    }

    // Validate URL format
    const trimmedUrl = url.trim();
    const isValidUrl = /^https?:\/\/.+/.test(trimmedUrl);
    const isGithubRepo = /^https?:\/\/(www\.)?github\.com\/.+\/.+/.test(trimmedUrl);
    const looksLikeUrl = trimmedUrl.includes('.') && (trimmedUrl.startsWith('http') || trimmedUrl.includes('://'));
    
    if (!isValidUrl && !looksLikeUrl) {
      setError('Please enter a valid URL (e.g., https://example.com or https://github.com/user/repo)');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const report = await runChaosTest(url);
      // Wait a moment to ensure all tests are visible as complete
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      // Show report after loading is done
      await new Promise(resolve => setTimeout(resolve, 100));
      onReportReceived(report);
    } catch (err) {
      setError(err.message || 'Failed to run chaos tests');
      setLoading(false);
    }
  };

  const examples = [
    'https://github.com/username/repo',
    'https://example.com',
    'https://myapp.vercel.app'
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 focus-within:border-blue-500 transition-all">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repo or https://example.com"
            className="w-full pl-14 pr-32 py-5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <span>Run Tests</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 text-sm font-semibold mb-1">
                  {error.includes('not reachable') || error.includes('not accessible') ? 'URL Not Reachable' : 'Error'}
                </p>
                <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                {error.includes('Cannot connect') && (
                  <div className="text-red-600 text-xs space-y-1 mt-3 pl-3 border-l-2 border-red-300">
                    <p className="font-semibold">Troubleshooting:</p>
                    <p>1. Make sure backend is running: <code className="bg-red-100 px-1 py-0.5 rounded">cd backend && npm run dev</code></p>
                    <p>2. Check backend is on port 3001</p>
                    <p>3. Look for errors in backend terminal</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Example links */}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(example)}
                className="text-xs px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </form>

      {loading && (
        <div className="mt-8 space-y-6">
          {/* Live Progress Dashboard */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Live Chaos Testing</h3>
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-sm text-gray-600">Running</span>
              </div>
            </div>

            {/* Live Test Progress Items */}
            <div className="space-y-3">
              {[
                'Latency Injection',
                'Load Spike',
                'UI Check (Browser)',
                'Memory Leak Test',
                'CPU Spike Test',
                'Rate Limit Test',
                'Error Recovery Test',
                'Cascading Failure Test'
              ].map((testName, idx) => {
                // Find the LATEST event for this test
                const events = liveEvents.filter(e => e.testName === testName);
                const event = events.length > 0 ? events[events.length - 1] : null;
                const status = event ? event.status : 'pending';
                
                // Debug logging
                if (idx === 0 && liveEvents.length > 0) {
                  console.log('[RunForm] First test:', testName, 'Event:', event, 'Status:', status);
                  console.log('[RunForm] All liveEvents:', liveEvents);
                  console.log('[RunForm] Events for this test:', events);
                }
                
                return (
                  <div key={idx} className="flex items-center gap-3 py-2 border-l-2 pl-3 transition-all"
                       style={{
                         borderColor: status === 'running' ? '#3b82f6' : 
                                      status === 'passed' ? '#10b981' : 
                                      status === 'failed' ? '#ef4444' : '#e5e7eb'
                       }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{testName}</div>
                      {event && event.details?.action && (
                        <div className="text-xs font-medium text-blue-600 mt-1">
                          {event.details.action}
                        </div>
                      )}
                      {event && event.details?.metric && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {event.details.metric}
                        </div>
                      )}
                      {event && event.details?.message && !event.details?.action && (
                        <div className="text-xs text-gray-500 mt-1">{event.details.message}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {status === 'pending' && (
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      )}
                      {status === 'running' && (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-600"></div>
                          <span className="text-xs text-blue-600 font-medium">Running</span>
                        </div>
                      )}
                      {status === 'passed' && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-green-600 font-medium">Passed</span>
                        </div>
                      )}
                      {status === 'failed' && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-red-600 font-medium">Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Estimated completion: <span className="font-medium text-gray-700">60-90 seconds</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



