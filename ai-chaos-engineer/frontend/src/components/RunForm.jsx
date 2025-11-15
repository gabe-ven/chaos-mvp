import { useState } from 'react';
import { runChaosTest } from '../lib/api';

export default function RunForm({ onReportReceived, loading, setLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL or repository');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const report = await runChaosTest(url);
      onReportReceived(report);
    } catch (err) {
      setError(err.message || 'Failed to run chaos tests');
    } finally {
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
        <div className="relative">
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub repository or URL..."
            className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              'Run Test'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
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
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-900"></div>
            <span>Spinning up workspace and running tests...</span>
          </div>
        </div>
      )}
    </div>
  );
}



