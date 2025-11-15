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
    <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-black to-purple-950/30"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.75s' }}></div>
      </div>

      {/* Minimal Header */}
      <header className="border-b border-neutral-900 bg-black/80 backdrop-blur-xl z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleHeaderClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none rounded-lg px-2 py-1 -ml-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-200">Site Reliability Monitor</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex items-center justify-center max-w-5xl mx-auto w-full px-6 relative z-0">
        {!report ? (
          <div className="w-full space-y-8 py-8">
            {/* Hero */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Testing
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
                90-Second Health Check
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Real-time performance and reliability testing for any website
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant results</span>
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
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="group relative p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 mb-3 group-hover:bg-blue-500/20 transition-colors group-hover:scale-110">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">8</div>
                    <div className="text-xs text-neutral-400">Real-time tests</div>
                  </div>
                </div>
                <div className="group relative p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 mb-3 group-hover:bg-purple-500/20 transition-colors group-hover:scale-110">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">90s</div>
                    <div className="text-xs text-neutral-400">Complete analysis</div>
                  </div>
                </div>
                <div className="group relative p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/10 mb-3 group-hover:bg-pink-500/20 transition-colors group-hover:scale-110">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">AI</div>
                    <div className="text-xs text-neutral-400">Smart insights</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full overflow-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-2">Stop Analysis?</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to go back to the homepage? This will stop the current analysis.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                No
              </button>
              <button
                onClick={handleBackToForm}
                className="px-4 py-2 bg-white hover:bg-neutral-100 text-black rounded-lg transition-colors text-sm font-medium"
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
