import { useState, useEffect } from 'react';
import RunForm from './components/RunForm';
import ReportViewer from './components/ReportViewer';
import TestHistory from './components/TestHistory';
import { useWebSocket } from './hooks/useWebSocket';
import { useKeyboardShortcuts, COMMON_SHORTCUTS } from './hooks/useKeyboardShortcuts';

/**
 * WebSocket URL Configuration
 * Uses environment variable or defaults to localhost
 */
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

/**
 * Main Application Component
 * 
 * Orchestrates the entire application flow:
 * - Form input and URL submission
 * - Real-time test progress via WebSocket
 * - Report display and history management
 * - Keyboard shortcuts and navigation
 * 
 * State Management:
 * - report: Current test report (null when no report)
 * - loading: Whether tests are currently running
 * - liveEvents: Real-time test progress events from WebSocket
 * - showConfirmDialog: Whether to show navigation confirmation
 * - showHistory: Whether to show test history view
 */
function App() {
  // Core application state
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket(WS_URL);

  /**
   * Handle incoming WebSocket messages
   * Updates live events state based on message type
   */
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'test_progress') {
        // Add test progress event to live events
        setLiveEvents(prev => [...prev, lastMessage]);
      } else if (lastMessage.type === 'test_start') {
        // Clear previous events when new test starts
        setLiveEvents([]);
      } else if (lastMessage.type === 'test_complete') {
        // Test completed - could use this to auto-load report if needed
        console.log('[App] Test completed via WebSocket');
      }
    }
  }, [lastMessage]);

  /**
   * Keyboard shortcuts handler
   * Provides keyboard navigation throughout the application
   */
  useKeyboardShortcuts({
    [COMMON_SHORTCUTS.ESCAPE]: (e) => {
      // Close dialogs or go back
      if (showConfirmDialog) {
        setShowConfirmDialog(false);
        return false; // Prevent default
      }
      if (showHistory) {
        setShowHistory(false);
        return false;
      }
      if (report && !loading) {
        handleBackToForm();
        return false;
      }
    },
    [COMMON_SHORTCUTS.CTRL_K]: (e) => {
      // Toggle history view
      e.preventDefault();
      setShowHistory(!showHistory);
      return false;
    },
    [COMMON_SHORTCUTS.CTRL_S]: (e) => {
      // Export report if available
      if (report && !loading) {
        e.preventDefault();
        // Trigger export in ReportViewer (would need ref or callback)
        return false;
      }
    }
  }, [showConfirmDialog, showHistory, report, loading]);

  /**
   * Reset application state and return to form view
   * Clears report, loading state, live events, and closes dialogs
   */
  const handleBackToForm = () => {
    setReport(null);
    setLoading(false);
    setLiveEvents([]);
    setShowConfirmDialog(false);
    setShowHistory(false);
  };

  /**
   * Handle header click - navigate home or show confirmation
   * Shows confirmation dialog if there's an active test or report
   */
  const handleHeaderClick = () => {
    if (loading || report) {
      setShowConfirmDialog(true);
    } else {
      handleBackToForm();
    }
  };

  /**
   * Handle selecting a test from history
   * Loads the selected test result (if stored with full data)
   * @param {Object} testItem - Test history item
   */
  const handleSelectTest = (testItem) => {
    // If the test item has full report data, load it
    if (testItem.report) {
      setReport(testItem.report);
    } else {
      // For now, just log selection (history stores summary only)
      console.log('[App] Test history item selected:', testItem);
    }

    // In all cases, close history and take user back to main view
    setShowHistory(false);
  };

  return (
    <div className={`min-h-screen ${loading || report ? 'md:min-h-screen' : 'md:h-screen'} bg-black text-white relative ${loading || report ? 'md:overflow-y-auto custom-scrollbar' : 'md:overflow-hidden'} overflow-y-auto flex flex-col`}>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Header Navigation */}
      <header className="border-b border-neutral-900 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleHeaderClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
              aria-label="Go to homepage"
            >
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Strux
              </h1>
            </button>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* History Button */}
              {!loading && !report && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors border border-neutral-700 flex items-center gap-2"
                  title="View test history (Ctrl+K)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={`flex-1 ${loading ? '' : 'md:overflow-hidden'} flex ${
          !loading && !showHistory ? 'md:items-center' : ''
        } justify-center max-w-5xl mx-auto w-full px-4 sm:px-6 relative z-0 md:py-0 py-8`}
      >
        {/* Test History View */}
        {showHistory && !report && !loading ? (
          <TestHistory
            onSelectTest={handleSelectTest}
            onClose={() => setShowHistory(false)}
          />
        ) : !report ? (
          /* Form View - Initial state */
          <div className={`w-full space-y-6 sm:space-y-8 ${loading ? 'md:py-8' : 'md:py-4 sm:py-8'}`}>
            {/* Hero Section */}
            <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-neutral-800/80 bg-black/60 text-neutral-400 text-xs sm:text-sm font-medium animate-fade-in shadow-[0_0_40px_rgba(59,130,246,0.18)]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                External reliability checks for your site
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white px-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Site reliability check
              </h2>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed px-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Point Strux at any URL and get a concise view of latency, load, error handling, and endpoint resilience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Clean, shareable report</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Real-time progress</span>
                </div>
              </div>
            </div>

            {/* Form Component */}
            <RunForm 
              onReportReceived={setReport} 
              loading={loading}
              setLoading={setLoading}
              liveEvents={liveEvents}
            />

            {/* Features Grid - Only show when not loading */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
                <div className="group p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors transition-transform hover:-translate-y-0.5">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Coverage</div>
                  <div className="text-2xl font-semibold text-white mb-1">8 checks</div>
                  <div className="text-xs text-neutral-500">Latency, load, errors, endpoints</div>
                </div>
                <div className="group p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors transition-transform hover:-translate-y-0.5">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Turnaround</div>
                  <div className="text-2xl font-semibold text-white mb-1">Fast</div>
                  <div className="text-xs text-neutral-500">From URL to report</div>
                </div>
                <div className="group p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors transition-transform hover:-translate-y-0.5">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Experience</div>
                  <div className="text-2xl font-semibold text-white mb-1">Live</div>
                  <div className="text-xs text-neutral-500">Streaming test progress</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Report View - Display test results */
          <div className="w-full">
            <ReportViewer 
              report={report} 
              loading={loading}
              onBack={handleBackToForm}
            />
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-scaleIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Stop Analysis?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Are you sure you want to go back to the homepage? {loading ? 'This will stop the current analysis.' : 'Your current report will be lost.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBackToForm}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white hover:bg-neutral-100 text-black rounded-lg transition-colors text-sm font-medium"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40 hidden lg:block">
          <details className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-400">
            <summary className="cursor-pointer hover:text-neutral-300">Keyboard Shortcuts</summary>
            <div className="mt-2 space-y-1">
              <div><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Esc</kbd> - Go back / Close</div>
              <div><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Ctrl+K</kbd> - Toggle history</div>
              <div><kbd className="px-1.5 py-0.5 bg-neutral-800 rounded">Ctrl+S</kbd> - Export report</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default App;
