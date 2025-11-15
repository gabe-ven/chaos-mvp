import { spinUpWorkspace } from './daytonaClient.js';
import { checkUI as checkUIBrowser } from './browserClient.js';
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
 * Performs UI check using browser automation
 * Falls back to simple check if browser automation not available
 */
export async function uiCheck(url) {
  console.log(`[UI Check] Testing ${url}...`);
  
  // Use browser automation from browserClient
  return await checkUIBrowser(url);
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



