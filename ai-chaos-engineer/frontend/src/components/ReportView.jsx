export default function ReportView({ report, loading }) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chaos-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your application...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No test results yet</p>
          <p className="text-sm mt-2">Run a chaos test to see the report</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      critical: 'bg-red-500/20 text-red-400 border-red-500/50'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`bg-gray-800 rounded-lg shadow-xl p-6 border ${getScoreBgColor(report.score)}`}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">
            Stability Score
          </h2>
          <div className={`text-6xl font-bold ${getScoreColor(report.score)} mb-2`}>
            {report.score}
          </div>
          <div className="text-2xl text-gray-400 mb-4">/ 100</div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getScoreBgColor(report.score)}`}>
            {report.status || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
        <p className="text-gray-300">{report.summary}</p>
        
        {report.raw?.totalDuration && (
          <p className="text-sm text-gray-500 mt-2">
            Total duration: {report.raw.totalDuration}ms
          </p>
        )}
      </div>

      {/* Issues */}
      {report.issues && report.issues.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">
            Issues Found ({report.issues.length})
          </h3>
          <div className="space-y-3">
            {report.issues.map((issue, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{issue.test}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getSeverityBadge(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {report.raw?.tests && (
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
          <div className="space-y-2">
            {report.raw.tests.map((test, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                <span className="text-gray-300">{test.test}</span>
                <span className={`font-semibold ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {test.passed ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <details className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <summary className="cursor-pointer p-6 font-semibold text-white hover:bg-gray-750 transition">
          View Raw JSON
        </summary>
        <div className="px-6 pb-6">
          <pre className="bg-gray-900 rounded p-4 text-xs text-gray-300 overflow-x-auto border border-gray-700">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}



