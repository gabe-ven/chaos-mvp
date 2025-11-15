import { useState } from 'react';
import RunForm from './components/RunForm';
import ReportView from './components/ReportView';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handler to go back to the form (previous page)
  const handleBackToForm = () => {
    setReport(null);
    setLoading(false);
  };

  return (
<<<<<<< HEAD
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <span>📡</span>
              <span>Live Dashboard</span>
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
                  <span><strong>UI Check:</strong> Validates URL accessibility and response time</span>
                </li>
              </ul>
=======
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-lg font-medium text-gray-900 text-center">
            AI Chaos Engineer
          </h1>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 px-6">
        <div className="w-full max-w-3xl mx-auto space-y-8">
          {/* Form Section */}
          {!report && (
            <div className="space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Test Your Application's Resilience
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter a URL or GitHub repository to run automated chaos engineering tests
                </p>
              </div>
              
              <RunForm 
                onReportReceived={setReport} 
                loading={loading}
                setLoading={setLoading}
              />
>>>>>>> f5d78163af612173c3174a7c2fabb7202490df2f
            </div>
          )}

          {/* Report Section */}
          {report && (
            <div className="space-y-6">
              <ReportView 
                report={report} 
                loading={loading}
                onBack={handleBackToForm}
              />
            </div>
          )}

          {/* Info Section - Only show when no report */}
          {!report && !loading && (
            <div className="pt-8 border-t border-gray-100">
              <p className="text-center text-xs text-gray-500 mb-4">What we test</p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
                <span>Latency Injection</span>
                <span className="text-gray-300">•</span>
                <span>Load Spike</span>
                <span className="text-gray-300">•</span>
                <span>UI Check</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;



