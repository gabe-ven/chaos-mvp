import { useState, useEffect } from 'react';
import RunForm from './components/RunForm';
import ReportViewer from './components/ReportViewer';
import { useWebSocket } from './hooks/useWebSocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  
  // Connect to WebSocket for live updates
  const { isConnected, lastMessage } = useWebSocket(WS_URL);
  
  // Debug: Log connection status
  useEffect(() => {
    console.log('[App] WebSocket URL:', WS_URL);
    console.log('[App] WebSocket connected:', isConnected);
  }, [isConnected]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      console.log('[App] Received WebSocket message:', lastMessage);
      if (lastMessage.type === 'test_progress') {
        console.log('[App] Adding test progress event:', lastMessage.testName, lastMessage.status, lastMessage.details);
        // ALWAYS add new events, don't replace - this allows multiple updates per test
        setLiveEvents(prev => {
          const updated = [...prev, lastMessage];
          console.log('[App] Total events now:', updated.length);
          return updated;
        });
      } else if (lastMessage.type === 'test_start') {
        console.log('[App] Test started, clearing events');
        setLiveEvents([]);
      }
    }
  }, [lastMessage]);

  // Handler to go back to the form (previous page)
  const handleBackToForm = () => {
    setReport(null);
    setLoading(false);
    setLiveEvents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  AI Chaos Engineer
                </h1>
                <p className="text-xs text-gray-500">Automated Resilience Testing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isConnected ? 'Live Stream Active' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 px-6">
        <div className={`w-full mx-auto space-y-8 ${report ? 'max-w-6xl' : 'max-w-3xl'}`}>
          {/* Form Section */}
          {!report && (
            <div className="space-y-6">
              <div className="text-center space-y-3 mb-8">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-2">
                  90 Second Analysis
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Test Your Application's Resilience
                </h2>
                <p className="text-gray-600 text-base max-w-2xl mx-auto">
                  Run 8 comprehensive chaos tests instantly. Get AI-powered insights and actionable recommendations.
                </p>
              </div>
              
              <RunForm 
                onReportReceived={setReport} 
                loading={loading}
                setLoading={setLoading}
                liveEvents={liveEvents}
              />
            </div>
          )}

          {/* Report Section */}
          {report && (
            <div className="space-y-6">
              <ReportViewer 
                report={report} 
                loading={loading}
                onBack={handleBackToForm}
              />
            </div>
          )}

          {/* Info Section - Only show when no report */}
          {!report && !loading && (
            <div className="pt-8 border-t border-gray-100">
              <p className="text-center text-xs text-gray-500 mb-4">8 Comprehensive Chaos Tests</p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 max-w-md mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Latency Injection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Load Spike</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>UI Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Memory Leak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>CPU Spike</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Rate Limiting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Error Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Cascading Failure</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;


