import { useState, useEffect } from 'react';
import { copyToClipboard, copyJsonToClipboard } from '../utils/clipboard';
import { formatDuration, formatDate } from '../utils/formatUtils';
import { addToTestHistory } from '../utils/storage';

/**
 * ReportViewer Component
 * 
 * Displays comprehensive test results with score, statistics, and detailed breakdown.
 * Includes export functionality, copy-to-clipboard, and test history tracking.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.report - Test report object containing score, tests, and analysis
 * @param {boolean} props.loading - Whether report is still loading
 * @param {Function} props.onBack - Callback function to navigate back to form
 */
export default function ReportViewer({ report, loading, onBack }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  /**
   * Save report to test history when it's available
   */
  useEffect(() => {
    if (report && !loading) {
      addToTestHistory({
        url: report.raw?.url || 'Unknown',
        score: report.score,
        status: report.status,
        timestamp: report.raw?.timestamp || new Date().toISOString(),
        testsPassed: report.raw?.tests?.filter(t => t.passed).length || 0,
        totalTests: report.raw?.tests?.length || 0
      });
    }
  }, [report, loading]);

  /**
   * Loading state - shows spinner while report is being prepared
   */
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

  /**
   * Null check - return nothing if no report available
   */
  if (!report) {
    return null;
  }

  /**
   * Get color class based on score value
   * @param {number} score - Stability score (0-100)
   * @returns {string} - Tailwind color class
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  /**
   * Get background color class based on score value
   * @param {number} score - Stability score (0-100)
   * @returns {string} - Tailwind color class
   */
  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  /**
   * Get severity badge color class
   * @param {string} severity - Severity level (low, medium, high, critical)
   * @returns {string} - Tailwind color classes
   */
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[severity] || colors.medium;
  };

  /**
   * Copy report JSON to clipboard
   */
  const handleCopyJson = async () => {
    const success = await copyJsonToClipboard(report);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  /**
   * Export report as JSON file
   */
  const handleExportJson = () => {
    try {
      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chaos-test-report-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('[ReportViewer] Export failed:', error);
    }
  };

  /**
   * Copy summary text to clipboard
   */
  const handleCopySummary = async () => {
    const summaryText = `Stability Score: ${report.score}/100\nStatus: ${report.status}\n${report.summary}`;
    const success = await copyToClipboard(summaryText);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const passedTests = report.raw?.tests?.filter(t => t.passed).length || 0;
  const totalTests = report.raw?.tests?.length || 0;
  const failedTests = totalTests - passedTests;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
            aria-label="Go back to form"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors border border-neutral-700"
            title="Copy summary to clipboard"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors border border-neutral-700"
            title="Export report as JSON file"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          {copySuccess && (
            <span className="text-xs text-green-400 animate-fade-in">Copied!</span>
          )}
          {exportSuccess && (
            <span className="text-xs text-green-400 animate-fade-in">Exported!</span>
          )}
        </div>
      </div>

      {/* Score Card */}
      <div className={`rounded-2xl border ${getScoreBgColor(report.score)} bg-neutral-950/90 p-8 text-center`}>
        <div className="text-xs font-medium tracking-widest text-neutral-500 uppercase mb-3">
          Stability Score
        </div>
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className={`text-7xl font-semibold ${getScoreColor(report.score)}`}>
            {report.score}
          </span>
          <span className="text-neutral-600 text-xl">/100</span>
        </div>
        <div className="mt-3">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${getScoreBgColor(report.score)} ${getScoreColor(report.score)}`}>
            {report.status || 'Unknown'}
          </span>
        </div>
        <div className="mt-4 text-xs text-neutral-500">
          Higher scores indicate better uptime, performance, and resilience under load.
        </div>
        {report.raw?.runId && (
          <div className="mt-4 text-[11px] text-neutral-600 font-mono">
            Run ID: <span className="text-neutral-400">{report.raw.runId}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80 hover:bg-neutral-950 transition-colors">
          <div className="text-2xl font-semibold text-white mb-1">
            {passedTests}
          </div>
          <div className="text-xs text-neutral-500">Tests Passed</div>
          <div className="text-xs text-green-400 mt-1">
            {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}% success rate
          </div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80 hover:bg-neutral-950 transition-colors">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.issues?.length || 0}
          </div>
          <div className="text-xs text-neutral-500">Issues Found</div>
          <div className="text-xs text-red-400 mt-1">
            {failedTests} test{failedTests !== 1 ? 's' : ''} failed
          </div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80 hover:bg-neutral-950 transition-colors">
          <div className="text-2xl font-semibold text-white mb-1">
            {report.raw?.totalDuration ? formatDuration(report.raw.totalDuration) : '0s'}
          </div>
          <div className="text-xs text-neutral-500">Total Duration</div>
          <div className="text-xs text-neutral-400 mt-1">
            {report.raw?.totalDuration ? Math.round(report.raw.totalDuration / 1000) : 0} seconds
          </div>
        </div>
        
        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/80 hover:bg-neutral-950 transition-colors">
          <div className="text-2xl font-semibold text-white mb-1">
            {totalTests}
          </div>
          <div className="text-xs text-neutral-500">Total Tests</div>
          <div className="text-xs text-neutral-400 mt-1">
            {report.raw?.timestamp ? formatDate(report.raw.timestamp) : 'Just now'}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-200">Summary</h3>
          <button
            onClick={handleCopySummary}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Copy summary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <p className="text-neutral-300 text-sm leading-relaxed">{report.summary}</p>
      </div>

      {/* AI Analysis Section */}
      {report.aiSummary && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-sm font-medium text-blue-300">AI Analysis</h3>
          </div>
          <p className="text-neutral-300 text-sm leading-relaxed mb-4">{report.aiSummary}</p>
          
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-500/20">
              <h4 className="text-xs font-medium text-blue-400 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Issues Section */}
      {report.issues && report.issues.length > 0 && (
        <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
          <h3 className="text-sm font-medium text-red-400 mb-4">
            Issues Found ({report.issues.length})
          </h3>
          <div className="space-y-3">
            {report.issues.map((issue, idx) => (
              <div key={idx} className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{issue.test}</h4>
                  <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {report.raw?.tests && report.raw.tests.length > 0 && (
        <div className="border border-neutral-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-neutral-400 mb-4">Detailed Test Results</h3>
          <div className="space-y-2">
            {report.raw.tests.map((test, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                  test.passed 
                    ? 'bg-green-500/5 border border-green-500/20' 
                    : 'bg-red-500/5 border border-red-500/20'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {test.test}
                    </span>
                    {test.severity && (
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${getSeverityColor(test.severity)}`}>
                        {test.severity}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500">{test.message}</div>
                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-neutral-600 cursor-pointer hover:text-neutral-400">
                        View details
                      </summary>
                      <pre className="mt-2 text-xs text-neutral-500 font-mono bg-neutral-900/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-xs text-neutral-500">{formatDuration(test.duration)}</span>
                  <span className={`text-lg font-medium ${test.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {test.passed ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browser walkthrough (Browser Use) */}
      {report.raw?.browserWalkthrough && report.raw.browserWalkthrough.details?.actions && (
        <div className="border border-neutral-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-neutral-400 mb-3">Browser walkthrough</h3>
          <p className="text-xs text-neutral-500 mb-3">
            Headless browser session steps captured during the UI check.
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto text-xs text-neutral-300">
            {report.raw.browserWalkthrough.details.actions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 text-neutral-600">•</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <details className="border border-neutral-900 rounded-xl">
        <summary className="cursor-pointer p-4 text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-between">
          <span>View Raw JSON</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyJson();
            }}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            title="Copy JSON to clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </summary>
        <div className="px-4 pb-4">
          <pre className="bg-neutral-900/50 rounded-lg p-4 text-xs text-neutral-500 overflow-x-auto font-mono custom-scrollbar">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}
