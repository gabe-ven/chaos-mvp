import { analyzeResults } from '../src/llmClient.js';

describe('AI Analyzer', () => {
  test('should generate fallback analysis when no API key is configured', async () => {
    const testResults = {
      tests: [
        {
          test: 'Latency Injection',
          passed: true,
          duration: 456,
          message: 'Response time: 456ms (acceptable)',
          severity: 'low'
        },
        {
          test: 'Load Spike',
          passed: true,
          duration: 1234,
          message: 'Handled 10 concurrent requests',
          severity: 'low'
        },
        {
          test: 'UI Check',
          passed: true,
          duration: 234,
          message: 'UI is accessible',
          severity: 'low'
        }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 1924
    };

    const analysis = await analyzeResults(testResults);

    expect(analysis).toHaveProperty('aiSummary');
    expect(analysis).toHaveProperty('recommendations');
    expect(analysis.aiSummary).toBeTruthy();
    expect(analysis.recommendations).toBeInstanceOf(Array);
    expect(analysis.recommendations.length).toBeGreaterThan(0);
  });

  test('should provide specific recommendations for failed latency test', async () => {
    const testResults = {
      tests: [
        {
          test: 'Latency Injection',
          passed: false,
          duration: 1500,
          message: 'Response time: 1500ms (too slow)',
          severity: 'medium'
        }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 1500
    };

    const analysis = await analyzeResults(testResults);

    expect(analysis.aiSummary).toContain('improvement');
    expect(analysis.recommendations.some(r => 
      r.toLowerCase().includes('timeout') || 
      r.toLowerCase().includes('latency') ||
      r.toLowerCase().includes('retry')
    )).toBe(true);
  });

  test('should provide specific recommendations for failed load spike test', async () => {
    const testResults = {
      tests: [
        {
          test: 'Load Spike',
          passed: false,
          duration: 3000,
          message: 'Load spike took too long',
          severity: 'high'
        }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 3000
    };

    const analysis = await analyzeResults(testResults);

    expect(analysis.recommendations.some(r => 
      r.toLowerCase().includes('scale') || 
      r.toLowerCase().includes('load') ||
      r.toLowerCase().includes('concurrent')
    )).toBe(true);
  });

  test('should provide positive summary when all tests pass', async () => {
    const testResults = {
      tests: [
        { test: 'Test 1', passed: true, duration: 100, severity: 'low' },
        { test: 'Test 2', passed: true, duration: 200, severity: 'low' },
        { test: 'Test 3', passed: true, duration: 300, severity: 'low' }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 600
    };

    const analysis = await analyzeResults(testResults);

    expect(
      analysis.aiSummary.toLowerCase().includes('excellent') ||
      analysis.aiSummary.toLowerCase().includes('strong') ||
      analysis.aiSummary.toLowerCase().includes('passed')
    ).toBe(true);
  });

  test('should handle multiple failed tests', async () => {
    const testResults = {
      tests: [
        {
          test: 'Latency Injection',
          passed: false,
          duration: 1500,
          severity: 'medium'
        },
        {
          test: 'Load Spike',
          passed: false,
          duration: 3000,
          severity: 'high'
        },
        {
          test: 'UI Check',
          passed: false,
          duration: 500,
          severity: 'medium'
        }
      ],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 5000
    };

    const analysis = await analyzeResults(testResults);

    // Should have recommendations for multiple issues
    expect(analysis.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(analysis.aiSummary.toLowerCase()).toContain('improvement');
  });

  test('should always return valid structure', async () => {
    const testResults = {
      tests: [],
      workspaceUrl: 'https://workspace-test.daytona.dev',
      totalDuration: 0
    };

    const analysis = await analyzeResults(testResults);

    expect(analysis).toHaveProperty('aiSummary');
    expect(analysis).toHaveProperty('recommendations');
    expect(typeof analysis.aiSummary).toBe('string');
    expect(Array.isArray(analysis.recommendations)).toBe(true);
  });
});

