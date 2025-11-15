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

      {/* System Health Overview */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-3">Stability Score</p>
            <div className={`text-7xl font-bold ${getScoreColor(report.score)} mb-3`}>
              {report.score}
            </div>
            <div className="text-lg text-gray-400 mb-4">/ 100</div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getScoreBgColor(report.score)} ${getScoreColor(report.score)}`}>
              {report.status || 'Unknown'}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tests Passed</span>
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {report.raw?.tests?.filter(t => t.passed).length || 0}
                <span className="text-lg text-gray-400">/{report.raw?.tests?.length || 0}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tests Failed</span>
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {report.issues?.length || 0}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Execution Time</span>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {report.raw?.totalDuration ? Math.round(report.raw.totalDuration / 1000) : 0}
                <span className="text-lg text-gray-400">s</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target URL</span>
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="text-xs font-semibold text-gray-900 truncate">
                {report.raw?.url || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Live Testing</div>
            </div>
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
                <span className="text-primary-600 mt-1 flex-shrink-0">-</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance Metrics */}
      {report.raw?.tests && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Pass Rate</div>
            <div className="text-2xl font-semibold text-gray-900">
              {Math.round((report.raw.tests.filter(t => t.passed).length / report.raw.tests.length) * 100)}%
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Avg Response Time</div>
            <div className="text-2xl font-semibold text-gray-900">
              {Math.round(report.raw.tests.reduce((sum, t) => sum + t.duration, 0) / report.raw.tests.length)}ms
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-500 mb-1">Total Tests</div>
            <div className="text-2xl font-semibold text-gray-900">
              {report.raw.tests.length}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Test Results */}
      {report.raw?.tests && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Detailed Test Results</h3>
          <div className="space-y-4">
            {report.raw.tests.map((test, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{test.test}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(test.severity)}`}>
                        {test.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{test.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-semibold text-sm ${test.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                      {test.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                    <span className="text-xs text-gray-500">{test.duration}ms</span>
                  </div>
                </div>
                
                {/* Progress bar for duration */}
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${test.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min((test.duration / 2000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Additional details if available */}
                {test.details && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(test.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 overflow-x-auto border border-gray-200 font-mono custom-scrollbar">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}



