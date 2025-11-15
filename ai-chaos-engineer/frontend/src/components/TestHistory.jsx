import { useState, useEffect } from 'react';
import { getTestHistory, clearTestHistory } from '../utils/storage';
import { formatDate, formatRelativeTime } from '../utils/formatUtils';

/**
 * TestHistory Component
 * 
 * Displays a list of previously run tests with their scores and results.
 * Allows users to view past test results and clear history.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelectTest - Callback when a test is selected
 * @param {Function} props.onClose - Callback to close the history view
 */
export default function TestHistory({ onSelectTest, onClose }) {
  const [history, setHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  /**
   * Load test history from localStorage
   */
  useEffect(() => {
    const loadHistory = () => {
      const testHistory = getTestHistory(20); // Get last 20 tests
      setHistory(testHistory);
    };

    loadHistory();
    
    // Refresh history every 5 seconds in case it's updated elsewhere
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Get score color class
   * @param {number} score - Stability score
   * @returns {string} - Tailwind color class
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  /**
   * Get score background color class
   * @param {number} score - Stability score
   * @returns {string} - Tailwind color class
   */
  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  /**
   * Handle clearing test history
   */
  const handleClearHistory = () => {
    if (clearTestHistory()) {
      setHistory([]);
      setShowClearConfirm(false);
    }
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        )}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900/50 border border-neutral-800 mb-4">
            <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Test History</h3>
          <p className="text-sm text-neutral-500">
            Run some tests to see your history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Test History</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {history.length} test{history.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors border border-neutral-700"
            >
              Clear History
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-2">Clear History?</h3>
            <p className="text-sm text-neutral-400 mb-6">
              This will permanently delete all test history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 bg-neutral-950/80 hover:bg-neutral-950 transition-colors cursor-pointer ${getScoreBgColor(item.score)}`}
            onClick={() => onSelectTest && onSelectTest(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`text-2xl font-semibold ${getScoreColor(item.score)}`}>
                    {item.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate" title={item.url}>
                      {item.url}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {formatRelativeTime(item.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>
                    {item.testsPassed}/{item.totalTests} tests passed
                  </span>
                  <span>•</span>
                  <span className="capitalize">{item.status}</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

