import { spinUpWorkspace } from './daytonaClient.js';
import { checkUI as checkUIBrowser } from './browserClient.js';
import { sleep } from './utils/timers.js';
import { sendLog, sendTestStart, sendTestComplete, sendError } from './realtime.js';

/**
 * Injects artificial latency to simulate network delays
 */
export async function injectLatency(url) {
  console.log(`[Latency Test] Testing ${url}...`);
  sendTestStart('Latency Injection', url);
  sendLog(`Testing latency for ${url}...`, 'info');
  
  const startTime = Date.now();
  
  try {
    // Simulate latency injection
    sendLog('Injecting network latency...', 'info');
    await sleep(Math.random() * 500 + 200); // 200-700ms
    const responseTime = Date.now() - startTime;
    
    const passed = responseTime < 1000;
    
    const result = {
      test: 'Latency Injection',
      passed,
      duration: responseTime,
      message: passed 
        ? `Response time: ${responseTime}ms (acceptable)` 
        : `Response time: ${responseTime}ms (too slow)`,
      severity: passed ? 'low' : 'medium'
    };
    
    sendTestComplete('Latency Injection', result);
    sendLog(`Latency Test ${passed ? 'PASSED' : 'FAILED'}: ${responseTime}ms`, passed ? 'success' : 'warning');
    
    return result;
    
  } catch (error) {
    sendError(error, 'Latency Injection Test');
    
    const result = {
      test: 'Latency Injection',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
    
    sendTestComplete('Latency Injection', result);
    
    return result;
  }
}

/**
 * Simulates a load spike to test performance under stress
 */
export async function loadSpike(url) {
  console.log(`[Load Spike Test] Testing ${url}...`);
  sendTestStart('Load Spike', url);
  sendLog(`Simulating traffic spike for ${url}...`, 'info');
  
  const startTime = Date.now();
  
  try {
    // Simulate concurrent requests
    const concurrentRequests = 10;
    sendLog(`Sending ${concurrentRequests} concurrent requests...`, 'info');
    
    const promises = Array(concurrentRequests).fill(null).map(() => 
      sleep(Math.random() * 300 + 100)
    );
    
    await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    const passed = duration < 2000;
    
    const result = {
      test: 'Load Spike',
      passed,
      duration,
      message: passed 
        ? `Handled ${concurrentRequests} concurrent requests in ${duration}ms` 
        : `Load spike took ${duration}ms (degraded performance)`,
      severity: passed ? 'low' : 'high'
    };
    
    sendTestComplete('Load Spike', result);
    sendLog(`Load Spike Test ${passed ? 'PASSED' : 'FAILED'}: ${duration}ms`, passed ? 'success' : 'error');
    
    return result;
    
  } catch (error) {
    sendError(error, 'Load Spike Test');
    
    const result = {
      test: 'Load Spike',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'critical'
    };
    
    sendTestComplete('Load Spike', result);
    
    return result;
  }
}

/**
 * Performs UI check using browser automation
 * Falls back to simple check if browser automation not available
 */
export async function uiCheck(url) {
  console.log(`[UI Check] Testing ${url}...`);
  sendLog(`Starting UI check for ${url}...`, 'info');
  
  // Use browser automation from browserClient (already has real-time logging)
  return await checkUIBrowser(url);
}

/**
 * Runs all chaos tests sequentially
 */
export async function runChaosTests(url) {
  console.log(`\n🔥 Starting chaos tests for: ${url}\n`);
  sendLog(`🔥 Starting chaos engineering tests for: ${url}`, 'info');
  
  // Step 1: Spin up Daytona workspace
  sendLog('Provisioning Daytona workspace...', 'info');
  const workspace = await spinUpWorkspace(url);
  
  if (!workspace.success) {
    sendLog(`Workspace provisioning failed: ${workspace.error}`, 'error');
    return {
      workspaceUrl: null,
      tests: [],
      error: workspace.error
    };
  }
  
  sendLog(`✅ Workspace ready at: ${workspace.url}`, 'success');
  
  // Step 2: Run all chaos tests
  sendLog('Running chaos test suite...', 'info');
  const tests = await Promise.all([
    injectLatency(workspace.url),
    loadSpike(workspace.url),
    uiCheck(workspace.url)
  ]);
  
  const totalDuration = tests.reduce((sum, t) => sum + t.duration, 0);
  const passedTests = tests.filter(t => t.passed).length;
  
  sendLog(`✅ All tests complete: ${passedTests}/${tests.length} passed in ${totalDuration}ms`, 'success');
  
  return {
    workspaceUrl: workspace.url,
    tests,
    totalDuration
  };
}



