import { describe, test, expect } from '@jest/globals';
import { injectLatency, loadSpike, uiCheck } from '../src/chaosTests.js';
import { buildReport } from '../src/reportBuilder.js';

describe('Chaos Tests', () => {
  test('injectLatency should return test result', async () => {
    const result = await injectLatency('https://example.com');
    
    expect(result).toHaveProperty('test');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('duration');
    expect(result).toHaveProperty('message');
    expect(result.test).toBe('Latency Injection');
  });

  test('loadSpike should return test result', async () => {
    const result = await loadSpike('https://example.com');
    
    expect(result).toHaveProperty('test');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('duration');
    expect(result.test).toBe('Load Spike');
  });

  test('uiCheck should return test result', async () => {
    const result = await uiCheck('https://example.com');
    
    expect(result).toHaveProperty('test');
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('duration');
    expect(result.test).toBe('UI Check');
  });
});

describe('Report Builder', () => {
  test('buildReport should calculate score correctly', () => {
    const testResults = {
      workspaceUrl: 'https://test.com',
      totalDuration: 1000,
      tests: [
        { test: 'Test 1', passed: true, duration: 300, severity: 'low' },
        { test: 'Test 2', passed: true, duration: 400, severity: 'low' },
        { test: 'Test 3', passed: false, duration: 300, severity: 'medium', message: 'Failed' }
      ]
    };

    const report = buildReport(testResults);
    
    expect(report).toHaveProperty('score');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('issues');
    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
    expect(report.issues).toHaveLength(1);
  });

  test('buildReport should handle errors', () => {
    const testResults = {
      error: 'Something went wrong'
    };

    const report = buildReport(testResults);
    
    expect(report.score).toBe(0);
    expect(report.issues).toContain('Something went wrong');
  });
});



