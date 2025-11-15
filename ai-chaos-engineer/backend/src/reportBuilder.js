/**
 * Builds a final report with stability score and summary
 * @param {Object} testResults - Raw test results
 * @param {Object} aiAnalysis - Optional AI-generated analysis
 * @param {Object} meta - Optional metadata (e.g., runId)
 */
export function buildReport(testResults, aiAnalysis = null, meta = {}) {
  if (testResults.error) {
    return {
      score: 0,
      summary: 'Failed to run tests',
      issues: [testResults.error],
      raw: testResults
    };
  }

  const { tests, url, totalDuration } = testResults;
  
  // Calculate score based on passed tests
  const totalTests = tests.length;
  const passedTests = tests.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  
  // Base score calculation
  let score = Math.round((passedTests / totalTests) * 100);
  
  // Apply penalties for severity
  const severityPenalties = {
    low: 0,
    medium: 5,
    high: 10,
    critical: 20
  };
  
  tests.forEach(test => {
    if (!test.passed) {
      score -= severityPenalties[test.severity] || 5;
    }
  });
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  // Build summary
  const summary = `${passedTests}/${totalTests} tests passed. Stability score: ${score}/100`;
  
  // Collect issues
  const issues = tests
    .filter(t => !t.passed)
    .map(t => ({
      test: t.test,
      message: t.message,
      severity: t.severity
    }));
  
  // Determine overall status
  let status;
  if (score >= 80) status = 'Excellent';
  else if (score >= 60) status = 'Good';
  else if (score >= 40) status = 'Fair';
  else status = 'Poor';
  
  // Build final report with optional AI analysis
  const report = {
    score,
    status,
    summary,
    issues,
    raw: {
      url,
      totalDuration,
      tests,
      runId: meta.runId,
      timestamp: new Date().toISOString()
    }
  };

  // Add AI analysis if available
  if (aiAnalysis) {
    report.aiSummary = aiAnalysis.aiSummary;
    report.recommendations = aiAnalysis.recommendations;
  }

  return report;
}



