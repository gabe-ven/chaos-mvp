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
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">
        Run Chaos Test
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            GitHub Repository or URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-chaos-500 focus:border-transparent transition"
            disabled={loading}
          />
          
          {/* Example links */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(example)}
                  className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-chaos-600 hover:bg-chaos-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Tests...
            </>
          ) : (
            <>
              🔥 Run Chaos Test
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="mt-4 text-sm text-gray-400 space-y-2">
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-chaos-500 rounded-full animate-pulse"></span>
            Spinning up Daytona workspace...
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-chaos-500 rounded-full animate-pulse"></span>
            Running chaos tests...
          </p>
        </div>
      )}
    </div>
  );
}



