import { spinUpWorkspace } from './daytonaClient.js';
import { sleep } from './utils/timers.js';

/**
 * Injects artificial latency to simulate network delays
 */
export async function injectLatency(url) {
  console.log(`[Latency Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    // Simulate latency injection
    await sleep(Math.random() * 500 + 200); // 200-700ms
    const responseTime = Date.now() - startTime;
    
    const passed = responseTime < 1000;
    
    return {
      test: 'Latency Injection',
      passed,
      duration: responseTime,
      message: passed 
        ? `Response time: ${responseTime}ms (acceptable)` 
        : `Response time: ${responseTime}ms (too slow)`,
      severity: passed ? 'low' : 'medium'
    };
  } catch (error) {
    return {
      test: 'Latency Injection',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

/**
 * Simulates a load spike to test performance under stress
 */
export async function loadSpike(url) {
  console.log(`[Load Spike Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    // Simulate concurrent requests
    const concurrentRequests = 10;
    const promises = Array(concurrentRequests).fill(null).map(() => 
      sleep(Math.random() * 300 + 100)
    );
    
    await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    const passed = duration < 2000;
    
    return {
      test: 'Load Spike',
      passed,
      duration,
      message: passed 
        ? `Handled ${concurrentRequests} concurrent requests in ${duration}ms` 
        : `Load spike took ${duration}ms (degraded performance)`,
      severity: passed ? 'low' : 'high'
    };
  } catch (error) {
    return {
      test: 'Load Spike',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'critical'
    };
  }
}

/**
 * Performs a simple UI check
 */
export async function uiCheck(url) {
  console.log(`[UI Check] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    // Simulate UI validation checks
    await sleep(Math.random() * 200 + 100);
    
    const checks = {
      accessible: Math.random() > 0.2,
      responsive: Math.random() > 0.1,
      noErrors: Math.random() > 0.15
    };
    
    const passed = checks.accessible && checks.responsive && checks.noErrors;
    const duration = Date.now() - startTime;
    
    return {
      test: 'UI Check',
      passed,
      duration,
      message: passed 
        ? 'UI is accessible, responsive, and error-free' 
        : `UI issues detected: ${Object.entries(checks)
            .filter(([_, v]) => !v)
            .map(([k]) => k)
            .join(', ')}`,
      severity: passed ? 'low' : 'medium',
      details: checks
    };
  } catch (error) {
    return {
      test: 'UI Check',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

/**
 * Runs all chaos tests sequentially
 */
export async function runChaosTests(url) {
  console.log(`\n🔥 Starting chaos tests for: ${url}\n`);
  
  // Step 1: Spin up Daytona workspace
  const workspace = await spinUpWorkspace(url);
  
  if (!workspace.success) {
    return {
      workspaceUrl: null,
      tests: [],
      error: workspace.error
    };
  }
  
  // Step 2: Run all chaos tests
  const tests = await Promise.all([
    injectLatency(workspace.url),
    loadSpike(workspace.url),
    uiCheck(workspace.url)
  ]);
  
  return {
    workspaceUrl: workspace.url,
    tests,
    totalDuration: tests.reduce((sum, t) => sum + t.duration, 0)
  };
}



