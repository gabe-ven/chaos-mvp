/**
 * Builds a final report with stability score and summary
 */
export function buildReport(testResults) {
  if (testResults.error) {
    return {
      score: 0,
      summary: 'Failed to run tests',
      issues: [testResults.error],
      raw: testResults
    };
  }

  const { tests, workspaceUrl, totalDuration } = testResults;
  
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
  
  return {
    score,
    status,
    summary,
    issues,
    raw: {
      workspaceUrl,
      totalDuration,
      tests,
      timestamp: new Date().toISOString()
    }
  };
}



