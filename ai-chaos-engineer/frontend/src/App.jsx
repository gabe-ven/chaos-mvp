import { useState } from 'react';
import RunForm from './components/RunForm';
import ReportView from './components/ReportView';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔥</div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  AI Chaos Engineer
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Test your application's resilience with automated chaos engineering
                </p>
              </div>
            </div>
            <a
              href="/live"
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <span>📡</span>
              <span>Open Live Dashboard</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <RunForm 
              onReportReceived={setReport} 
              loading={loading}
              setLoading={setLoading}
            />
            
            {/* Info Cards */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                What We Test
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-chaos-400 mt-0.5">⚡</span>
                  <span><strong>Latency Injection:</strong> Simulates network delays to test timeout handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-chaos-400 mt-0.5">📈</span>
                  <span><strong>Load Spike:</strong> Tests performance under concurrent requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-chaos-400 mt-0.5">🎨</span>
                  <span><strong>UI Check:</strong> Validates accessibility, responsiveness, and errors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Report */}
          <div>
            <ReportView report={report} loading={loading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built with React, Tailwind CSS, and Express • 6-Hour MVP
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;



