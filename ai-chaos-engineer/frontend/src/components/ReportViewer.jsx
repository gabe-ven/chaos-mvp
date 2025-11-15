export default function ReportViewer({ report, loading, onBack }) {
  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-800 border-t-white mx-auto"></div>
          <p className="text-neutral-500 text-sm">Preparing report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      )}

      {/* Score Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-8 text-center">
        <div className="text-xs font-medium tracking-widest text-neutral-500 uppercase mb-3">Stability score</div>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className={`text-7xl font-semibold ${getScoreColor(report.score)}`}>
            {report.score}
          </span>
          <span className="text-neutral-600 text-xl">/100</span>
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          Higher scores indicate better uptime, performance, and resilience under load.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.raw?.tests?.filter(t => t.passed).length || 0}
          </div>
          <div className="text-xs text-neutral-500">Tests Passed</div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.issues?.length || 0}
          </div>
          <div className="text-xs text-neutral-500">Issues Found</div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.raw?.totalDuration ? Math.round(report.raw.totalDuration / 1000) : 0}s
          </div>
          <div className="text-xs text-neutral-500">Duration</div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.raw?.tests?.length || 0}
          </div>
          <div className="text-xs text-neutral-500">Total Tests</div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6">
        <h3 className="text-sm font-medium text-neutral-200 mb-3">Summary</h3>
        <p className="text-neutral-300 text-sm leading-relaxed">{report.summary}</p>
      </div>

      {/* Test Results */}
      {report.raw?.tests && (
        <div className="border border-neutral-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-neutral-400 mb-4">Test Results</h3>
          <div className="space-y-2">
            {report.raw.tests.map((test, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 px-4 bg-neutral-900/30 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{test.test}</div>
                  <div className="text-xs text-neutral-500">{test.message}</div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-xs text-neutral-500">{test.duration}ms</span>
                  <span className={`text-sm font-medium ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {test.passed ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <details className="border border-neutral-900 rounded-xl">
        <summary className="cursor-pointer p-4 text-sm text-neutral-400 hover:text-white transition-colors">
          View Raw JSON
        </summary>
        <div className="px-4 pb-4">
          <pre className="bg-neutral-900/50 rounded-lg p-4 text-xs text-neutral-500 overflow-x-auto font-mono">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}
