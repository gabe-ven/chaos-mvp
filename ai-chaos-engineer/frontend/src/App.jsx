import { useState, useEffect } from 'react';
import RunForm from './components/RunForm';
import ReportViewer from './components/ReportViewer';
import { useWebSocket } from './hooks/useWebSocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { isConnected, lastMessage } = useWebSocket(WS_URL);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'test_progress') {
        setLiveEvents(prev => [...prev, lastMessage]);
      } else if (lastMessage.type === 'test_start') {
        setLiveEvents([]);
      }
    }
  }, [lastMessage]);

  const handleBackToForm = () => {
    setReport(null);
    setLoading(false);
    setLiveEvents([]);
    setShowConfirmDialog(false);
  };

  const handleHeaderClick = () => {
    // Only show confirmation if there's an active analysis
    if (loading || report) {
      setShowConfirmDialog(true);
    } else {
      handleBackToForm();
    }
  };

  return (
    <div className={`min-h-screen ${loading || report ? 'md:min-h-screen' : 'md:h-screen'} bg-black text-white relative ${loading || report ? 'md:overflow-y-auto custom-scrollbar' : 'md:overflow-hidden'} overflow-y-auto flex flex-col`}>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-neutral-950 via-black to-neutral-950" />

      {/* Header */}
      <header className="border-b border-neutral-900 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Strux
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 ${loading ? '' : 'md:overflow-hidden'} flex ${loading ? '' : 'md:items-center'} justify-center max-w-5xl mx-auto w-full px-4 sm:px-6 relative z-0 md:py-0 py-8`}>
        {!report ? (
          <div className={`w-full space-y-6 sm:space-y-8 ${loading ? 'md:py-8' : 'md:py-4 sm:py-8'}`}>
            {/* Hero */}
            <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-neutral-800 text-neutral-400 text-xs sm:text-sm font-medium">
                External reliability checks for your site
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white px-2">
                Site reliability check
              </h2>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed px-2">
                Point Strux at any URL and get a concise view of latency, load, error handling, and endpoint resilience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-500">
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
              </div>
            </div>

            {/* Form */}
            <RunForm 
              onReportReceived={setReport} 
              loading={loading}
              setLoading={setLoading}
              liveEvents={liveEvents}
            />

            {/* Features - Only show when not loading */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Coverage</div>
                  <div className="text-2xl font-semibold text-white mb-1">7 checks</div>
                  <div className="text-xs text-neutral-500">Latency, load, errors, endpoints</div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Turnaround</div>
                  <div className="text-2xl font-semibold text-white mb-1">~90s</div>
                  <div className="text-xs text-neutral-500">From URL to report</div>
                </div>
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1 uppercase tracking-wide">Experience</div>
                  <div className="text-2xl font-semibold text-white mb-1">Live</div>
                  <div className="text-xs text-neutral-500">Streaming test progress</div>
                </div>
              </div>
            )}
          </div>
        ) : (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Stop Analysis?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6">
              Are you sure you want to go back to the homepage? This will stop the current analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                No
              </button>
              <button
                onClick={handleBackToForm}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white hover:bg-neutral-100 text-black rounded-lg transition-colors text-sm font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
