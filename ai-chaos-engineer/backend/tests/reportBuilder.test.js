import { buildReport } from '../src/reportBuilder.js';

describe('Report Builder', () => {
  test('should build report with high score for all passing tests', () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' },
        { test: 'Test 2', passed: true, duration: 200, severity: 'low' },
        { test: 'Test 3', passed: true, duration: 300, severity: 'low' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 600
    };

    const report = buildReport(testResults);

    expect(report.score).toBe(100);
    expect(report.status).toBe('Excellent');
    expect(report.issues).toHaveLength(0);
    expect(report.summary).toContain('3/3 tests passed');
  });

  test('should apply penalties for failed tests based on severity', () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' },
        { test: 'Test 2', passed: false, duration: 200, severity: 'medium', message: 'Failed' },
        { test: 'Test 3', passed: false, duration: 300, severity: 'high', message: 'Failed badly' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 600
    };

    const report = buildReport(testResults);

    // Base score: 1/3 = 33%
    // Penalties: medium (-5) + high (-10) = -15
    // Final: 33 - 15 = 18
    expect(report.score).toBeLessThan(50);
    expect(report.issues).toHaveLength(2);
    expect(report.issues[0].severity).toBe('medium');
    expect(report.issues[1].severity).toBe('high');
  });

  test('should include AI analysis when provided', () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 100
    };

    const aiAnalysis = {
      aiSummary: 'Your application is resilient',
      recommendations: ['Keep monitoring', 'Add more tests']
    };

    const report = buildReport(testResults, aiAnalysis);

    expect(report.aiSummary).toBe('Your application is resilient');
    expect(report.recommendations).toEqual(['Keep monitoring', 'Add more tests']);
  });

  test('should work without AI analysis', () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 100
    };

    const report = buildReport(testResults);

    expect(report.score).toBeDefined();
    expect(report.aiSummary).toBeUndefined();
    expect(report.recommendations).toBeUndefined();
  });

  test('should handle errors gracefully', () => {
    const testResults = {
      error: 'Something went wrong'
    };

    const report = buildReport(testResults);

    expect(report.score).toBe(0);
    expect(report.summary).toBe('Failed to run tests');
    expect(report.issues).toContain('Something went wrong');
  });

  test('should categorize status correctly', () => {
    const testCases = [
      { score: 90, expectedStatus: 'Excellent' },
      { score: 70, expectedStatus: 'Good' },
      { score: 50, expectedStatus: 'Fair' },
      { score: 30, expectedStatus: 'Poor' }
    ];

    testCases.forEach(({ score, expectedStatus }) => {
      // Create test results that will produce the desired score
      const numTests = 10;
      const numPassed = Math.round((score / 100) * numTests);
      const tests = Array(numPassed).fill({ test: 'Pass', passed: true, severity: 'low' })
        .concat(Array(numTests - numPassed).fill({ test: 'Fail', passed: false, severity: 'low', message: 'Failed' }));

      const testResults = {
        tests,
        workspaceUrl: 'https://test.dev',
        totalDuration: 1000
      };

      const report = buildReport(testResults);
      expect(report.status).toBe(expectedStatus);
    });
  });

  test('should include timestamp in raw data', () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 100
    };

    const report = buildReport(testResults);

    expect(report.raw.timestamp).toBeDefined();
    expect(new Date(report.raw.timestamp).getTime()).toBeGreaterThan(0);
  });

  test('should ensure score stays within 0-100 range', () => {
    // Test with many critical failures
    const testResults = {
      tests: Array(10).fill({
        test: 'Critical Fail',
        passed: false,
        severity: 'critical',
        message: 'Critical error'
      }),
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 1000
    };

    const report = buildReport(testResults);

    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
  });
});

