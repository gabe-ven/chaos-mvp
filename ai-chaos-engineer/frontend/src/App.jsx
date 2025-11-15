import { useState, useEffect } from 'react';
import RunForm from './components/RunForm';
import ReportViewer from './components/ReportViewer';
import { useWebSocket } from './hooks/useWebSocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  
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
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Minimal Header */}
      <header className="border-b border-neutral-900 bg-black/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-xxl font-semibold tracking-tight text-white">Strux</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        {!report ? (
          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-5xl font-semibold tracking-tight text-white">
                90-second health check
              </h1>
              <p className="text-lg text-neutral-400">
                Real-time performance and reliability testing for any website
              </p>
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
              <div className="grid grid-cols-3 gap-8 text-center pt-8">
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">7</div>
                  <div className="text-sm text-neutral-500">Health checks</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">90s</div>
                  <div className="text-sm text-neutral-500">Complete analysis</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-white mb-2">Live</div>
                  <div className="text-sm text-neutral-500">Streaming updates</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ReportViewer 
            report={report} 
            loading={loading}
            onBack={handleBackToForm}
          />
        )}
      </main>
    </div>
  );
}

export default App;
