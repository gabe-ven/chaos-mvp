export default function ReportView({ report, loading, onBack }) {
  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600 text-sm">Analyzing your application...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 border-blue-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      critical: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="w-full space-y-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          <span>Back to form</span>
        </button>
      )}

      {/* Score Card */}
      <div className={`bg-white rounded-2xl border p-10 ${getScoreBgColor(report.score)}`}>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Stability Score</p>
          <div className={`text-6xl font-semibold ${getScoreColor(report.score)} mb-3`}>
            {report.score}
          </div>
          <div className="text-xl text-gray-500 mb-6">/ 100</div>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getScoreBgColor(report.score)} ${getScoreColor(report.score)}`}>
            {report.status || 'Unknown'}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-900 mb-3">Summary</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{report.summary}</p>
        
        {report.raw?.totalDuration && (
          <p className="text-xs text-gray-500 mt-4">
            Total duration: {report.raw.totalDuration}ms
          </p>
        )}
      </div>

      {/* AI Summary (if available) */}
      {report.aiSummary && (
        <div className="bg-primary-50 rounded-2xl border border-primary-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">AI Analysis</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{report.aiSummary}</p>
        </div>
      )}

      {/* Recommendations (if available) */}
      {report.recommendations && report.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Recommendations</h3>
          <ul className="space-y-3">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
                <span className="text-primary-600 mt-1 flex-shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Results */}
      {report.raw?.tests && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-3">
            {report.raw.tests.map((test, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-700 text-sm">{test.test}</span>
                <span className={`font-medium text-sm ${test.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                  {test.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {report.issues && report.issues.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Issues Found ({report.issues.length})
          </h3>
          <div className="space-y-3">
            {report.issues.map((issue, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{issue.test}</h4>
                  <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getSeverityBadge(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <details className="bg-white rounded-2xl border border-gray-200">
        <summary className="cursor-pointer p-6 font-medium text-gray-900 hover:bg-gray-50 transition-colors text-sm">
          View Raw JSON
        </summary>
        <div className="px-6 pb-6">
          <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 overflow-x-auto border border-gray-200 font-mono">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}



