import { checkUI as checkUIBrowser } from './browserClient.js';
import { sleep } from './utils/timers.js';

/**
 * Tests actual response time by making real HTTP requests
 */
export async function injectLatency(url, notifyProgress = null) {
  console.log(`[Latency Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Latency Injection', 'running', { 
      action: 'Initiating HTTP GET request to target',
      metric: 'Measuring response time...'
    });
    
    // Make REAL HTTP request to measure actual latency
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('Latency Injection', 'running', { 
      action: `Response received in ${responseTime}ms`,
      metric: `HTTP ${response.status} - ${response.ok ? 'OK' : 'Error'}`
    });
    
    const passed = responseTime < 3000 && response.ok;
    
    return {
      test: 'Latency Injection',
      passed,
      duration: responseTime,
      message: passed 
        ? `Real response time: ${responseTime}ms (acceptable)` 
        : `Response time: ${responseTime}ms ${!response.ok ? `(HTTP ${response.status})` : '(too slow)'}`,
      severity: passed ? 'low' : 'medium',
      details: {
        status: response.status,
        statusText: response.statusText,
        actualRequest: 'Real HTTP GET'
      }
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
 * Tests performance under REAL concurrent load
 */
export async function loadSpike(url, notifyProgress = null) {
  console.log(`[Load Spike Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Load Spike', 'running', { 
      action: 'Preparing concurrent request barrage',
      metric: 'Setting up 10 simultaneous connections...'
    });
    
    // Make REAL concurrent requests
    const concurrentRequests = 10;
    
    if (notifyProgress) notifyProgress('Load Spike', 'running', { 
      action: 'FIRING 10 CONCURRENT REQUESTS NOW',
      metric: 'Bombarding server with simultaneous load...'
    });
    
    const promises = Array(concurrentRequests).fill(null).map(async () => {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          redirect: 'follow'
        });
        return {
          success: response.ok,
          status: response.status,
          duration: Date.now() - reqStart
        };
      } catch (err) {
        return {
          success: false,
          error: err.message,
          duration: Date.now() - reqStart
        };
      }
    });
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    const successfulRequests = results.filter(r => r.success).length;
    const avgRequestTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    if (notifyProgress) notifyProgress('Load Spike', 'running', { 
      action: 'Load spike complete - analyzing results',
      metric: `${successfulRequests}/${concurrentRequests} succeeded | Avg: ${Math.round(avgRequestTime)}ms`
    });
    
    const passed = duration < 5000 && successfulRequests >= concurrentRequests * 0.8;
    
    return {
      test: 'Load Spike',
      passed,
      duration,
      message: passed 
        ? `Handled ${successfulRequests}/${concurrentRequests} concurrent requests in ${duration}ms (avg: ${Math.round(avgRequestTime)}ms)` 
        : `Load spike: ${successfulRequests}/${concurrentRequests} succeeded, took ${duration}ms (degraded)`,
      severity: passed ? 'low' : 'high',
      details: {
        concurrentRequests,
        successful: successfulRequests,
        failed: concurrentRequests - successfulRequests,
        avgRequestTime: Math.round(avgRequestTime),
        actualTest: 'Real concurrent HTTP requests'
      }
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
export async function uiCheck(url, notifyProgress = null) {
  console.log(`[UI Check] Testing ${url}...`);
  
  if (notifyProgress) notifyProgress('UI Check (Browser)', 'running', { 
    action: 'Launching browser automation (Puppeteer)',
    metric: 'Initializing headless Chrome...'
  });
  
  if (notifyProgress) notifyProgress('UI Check (Browser)', 'running', { 
    action: `Navigating to ${url}`,
    metric: 'Loading page and analyzing DOM structure...'
  });
  
  // Use browser automation from browserClient
  const result = await checkUIBrowser(url);
  
  if (notifyProgress) notifyProgress('UI Check (Browser)', 'running', { 
    action: 'Scanning for broken links and console errors',
    metric: result.passed ? 'UI health check complete' : 'Issues detected'
  });
  
  return result;
}

/**
 * Tests for memory leaks by making repeated real requests and measuring response degradation
 */
export async function memoryLeakTest(url, notifyProgress = null) {
  console.log(`[Memory Leak Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Memory Leak Test', 'running', { 
      action: 'Testing for memory leaks',
      metric: 'Making 30 rapid consecutive REAL requests...'
    });
    
    // Make REAL repeated requests and measure response time degradation
    const iterations = 30;
    const responseTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const reqStart = Date.now();
      try {
        await fetch(url, { 
          method: 'HEAD',
          redirect: 'follow'
        });
        responseTimes.push(Date.now() - reqStart);
      } catch (err) {
        responseTimes.push(-1); // Mark failed requests
      }
    }
    
    if (notifyProgress) notifyProgress('Memory Leak Test', 'running', { 
      action: 'Analyzing response time trends',
      metric: `${iterations} requests completed`
    });
    
    const duration = Date.now() - startTime;
    
    // Check if response times are degrading (sign of memory leak)
    const firstHalf = responseTimes.slice(0, 15).filter(t => t > 0);
    const secondHalf = responseTimes.slice(15).filter(t => t > 0);
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const degradation = ((avgSecond - avgFirst) / avgFirst) * 100;
    
    // Pass if degradation is less than 50%
    const passed = degradation < 50 && secondHalf.length > 10;
    
    return {
      test: 'Memory Leak Test',
      passed,
      duration,
      message: passed 
        ? `No memory leak detected: ${degradation.toFixed(1)}% degradation`
        : `Possible memory leak: ${degradation.toFixed(1)}% response time degradation`,
      severity: passed ? 'low' : 'high',
      details: {
        iterations,
        avgFirstHalf: avgFirst.toFixed(0) + 'ms',
        avgSecondHalf: avgSecond.toFixed(0) + 'ms',
        degradation: degradation.toFixed(1) + '%',
        failedRequests: responseTimes.filter(t => t === -1).length
      }
    };
  } catch (error) {
    return {
      test: 'Memory Leak Test',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

/**
 * Tests CPU/processing under load by requesting large resources
 */
export async function cpuSpikeTest(url, notifyProgress = null) {
  console.log(`[CPU Spike Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('CPU Spike Test', 'running', { 
      action: 'Stressing server CPU',
      metric: 'Making 5 simultaneous large GET requests...'
    });
    
    // Make multiple large requests simultaneously to stress server CPU
    const requests = Array(5).fill(null).map(async () => {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'GET',
          redirect: 'follow'
        });
        // Force server to send full response body
        await response.text();
        return {
          success: true,
          duration: Date.now() - reqStart,
          size: parseInt(response.headers.get('content-length') || '0')
        };
      } catch (err) {
        return {
          success: false,
          duration: Date.now() - reqStart,
          error: err.message
        };
      }
    });
    
    const results = await Promise.all(requests);
    const duration = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('CPU Spike Test', 'running', { 
      action: 'Analyzing server CPU performance',
      metric: `Completed in ${duration}ms`
    });
    
    const successful = results.filter(r => r.success).length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    // Pass if most requests succeeded and average time is reasonable
    const passed = successful >= 4 && avgDuration < 5000;
    
    return {
      test: 'CPU Spike Test',
      passed,
      duration,
      message: passed
        ? `Server handled CPU load well: ${successful}/5 succeeded, avg ${avgDuration.toFixed(0)}ms`
        : `Server struggled under CPU load: ${successful}/5 succeeded, avg ${avgDuration.toFixed(0)}ms`,
      severity: passed ? 'low' : 'medium',
      details: {
        successfulRequests: successful,
        failedRequests: 5 - successful,
        avgResponseTime: avgDuration.toFixed(0) + 'ms'
      }
    };
  } catch (error) {
    return {
      test: 'CPU Spike Test',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

/**
 * Tests rate limiting by sending rapid burst of real requests
 */
export async function rateLimitTest(url, notifyProgress = null) {
  console.log(`[Rate Limit Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Rate Limit Test', 'running', { 
      action: 'Testing rate limiting behavior',
      metric: 'Sending rapid burst of 25 REAL requests...'
    });
    
    // Send rapid burst of REAL requests as fast as possible
    const burstSize = 25;
    const results = [];
    
    for (let i = 0; i < burstSize; i++) {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          redirect: 'follow'
        });
        results.push({
          success: response.ok,
          status: response.status,
          duration: Date.now() - reqStart,
          rateLimited: response.status === 429 // HTTP 429 = Too Many Requests
        });
      } catch (err) {
        results.push({
          success: false,
          error: err.message,
          duration: Date.now() - reqStart,
          rateLimited: false
        });
      }
    }
    
    const duration = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('Rate Limit Test', 'running', { 
      action: 'Analyzing rate limiting behavior',
      metric: `${burstSize} requests completed in ${duration}ms`
    });
    
    const rateLimitedCount = results.filter(r => r.rateLimited).length;
    const successCount = results.filter(r => r.success).length;
    const avgRequestTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    // Pass if no rate limiting or server handled it gracefully
    const passed = rateLimitedCount === 0 && successCount >= burstSize * 0.8;
    
    return {
      test: 'Rate Limit Test',
      passed,
      duration,
      message: passed
        ? `No rate limiting: ${successCount}/${burstSize} succeeded, avg ${avgRequestTime.toFixed(0)}ms`
        : `Rate limiting detected: ${rateLimitedCount} blocked, ${successCount}/${burstSize} succeeded`,
      severity: passed ? 'low' : 'medium',
      details: {
        burstSize,
        successful: successCount,
        rateLimited: rateLimitedCount,
        failed: burstSize - successCount - rateLimitedCount,
        averageRequestTime: avgRequestTime.toFixed(0) + 'ms'
      }
    };
  } catch (error) {
    return {
      test: 'Rate Limit Test',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'medium'
    };
  }
}

/**
 * Tests error recovery by trying invalid paths and measuring recovery
 */
export async function errorRecoveryTest(url, notifyProgress = null) {
  console.log(`[Error Recovery Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Error Recovery Test', 'running', { 
      action: 'Testing error handling',
      metric: 'Requesting invalid paths and testing recovery...'
    });
    
    // Try various error-inducing paths and see if server recovers
    const parsedUrl = new URL(url);
    const errorPaths = [
      '/nonexistent-path-404-test',
      '/another-missing-page-' + Date.now(),
      '/test-chaos-' + Math.random().toString(36).substring(7)
    ];
    
    const errorResults = [];
    
    for (const path of errorPaths) {
      const testUrl = parsedUrl.origin + path;
      const reqStart = Date.now();
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          redirect: 'follow'
        });
        
        errorResults.push({
          path,
          status: response.status,
          recovered: response.status === 404, // Proper 404 = good error handling
          duration: Date.now() - reqStart
        });
      } catch (err) {
        errorResults.push({
          path,
          recovered: false,
          error: err.message,
          duration: Date.now() - reqStart
        });
      }
    }
    
    // Test if main URL still works after errors
    const mainRecoveryStart = Date.now();
    let mainUrlRecovered = false;
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      mainUrlRecovered = response.ok;
    } catch (err) {
      mainUrlRecovered = false;
    }
    
    if (notifyProgress) notifyProgress('Error Recovery Test', 'running', { 
      action: 'Verifying recovery and resilience',
      metric: 'Testing main URL after error injection...'
    });
    
    const duration = Date.now() - startTime;
    const properErrors = errorResults.filter(r => r.recovered).length;
    const avgErrorHandling = (errorResults.reduce((sum, r) => sum + r.duration, 0) / errorResults.length);
    
    // Pass if server handles errors properly AND main URL still works
    const passed = mainUrlRecovered && properErrors >= 2 && avgErrorHandling < 3000;
    
    return {
      test: 'Error Recovery Test',
      passed,
      duration,
      message: passed
        ? `Good error handling: ${properErrors}/3 proper 404s, main URL recovered`
        : `Poor error handling: ${properErrors}/3 proper 404s, main URL ${mainUrlRecovered ? 'OK' : 'FAILED'}`,
      severity: passed ? 'low' : 'high',
      details: {
        testedPaths: errorPaths.length,
        properErrorResponses: properErrors,
        mainUrlRecovered,
        avgErrorResponseTime: avgErrorHandling.toFixed(0) + 'ms'
      }
    };
  } catch (error) {
    return {
      test: 'Error Recovery Test',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'critical'
    };
  }
}

/**
 * Tests cascading failure scenarios
 */
export async function cascadingFailureTest(url, notifyProgress = null) {
  console.log(`[Cascading Failure Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Cascading Failure Test', 'running', { 
      action: 'Testing cascading failure resilience',
      metric: 'Stressing multiple endpoints simultaneously...'
    });
    
    // Test if failure in one endpoint cascades to others
    // Make requests to main URL and common paths simultaneously
    const parsedUrl = new URL(url);
    const endpoints = [
      url, // Main URL
      parsedUrl.origin + '/api',
      parsedUrl.origin + '/assets',
      parsedUrl.origin + '/static'
    ];
    
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const reqStart = Date.now();
        try {
          const response = await fetch(endpoint, { 
            method: 'HEAD',
            redirect: 'follow'
          });
          return {
            endpoint,
            success: response.ok || response.status === 404, // 404 is ok for optional paths
            status: response.status,
            duration: Date.now() - reqStart
          };
        } catch (err) {
          return {
            endpoint,
            success: false,
            error: err.message,
            duration: Date.now() - reqStart
          };
        }
      })
    );
    
    // Now test main URL again to see if it recovered
    if (notifyProgress) notifyProgress('Cascading Failure Test', 'running', { 
      action: 'Testing if failures cascade',
      metric: 'Verifying main endpoint still responsive...'
    });
    
    const mainUrlRecheck = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    const mainUrlOk = mainUrlRecheck.ok;
    
    const duration = Date.now() - startTime;
    const successfulEndpoints = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failedEndpoints = endpoints.length - successfulEndpoints;
    
    // Pass if main URL is OK and no cascading failures occurred
    const passed = mainUrlOk && successfulEndpoints >= 1;
    
    return {
      test: 'Cascading Failure Test',
      passed,
      duration,
      message: passed
        ? `No cascade detected: ${successfulEndpoints}/${endpoints.length} endpoints OK, main URL stable`
        : `Potential cascade: ${failedEndpoints}/${endpoints.length} failed, main URL ${mainUrlOk ? 'OK' : 'FAILED'}`,
      severity: passed ? 'low' : 'critical',
      details: {
        testedEndpoints: endpoints.length,
        successful: successfulEndpoints,
        failed: failedEndpoints,
        mainUrlStable: mainUrlOk
      }
    };
  } catch (error) {
    return {
      test: 'Cascading Failure Test',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'critical'
    };
  }
}

/**
 * Runs all chaos tests directly on the provided URL
 */
export async function runChaosTests(url) {
  console.log(`\n🔥 Starting chaos tests for: ${url}\n`);
  
  // Import WebSocket notification
  const { notifyTestProgress } = await import('./websocket.js');
  
  // Run tests sequentially so we can notify progress for each one
  const tests = [];
  const testFunctions = [
    { name: 'Response Time', fn: injectLatency },
    { name: 'Concurrent Load', fn: loadSpike },
    { name: 'UI Health Check', fn: uiCheck },
    { name: 'Performance Consistency', fn: memoryLeakTest },
    { name: 'Heavy Load Stress', fn: cpuSpikeTest },
    { name: 'Rate Limiting', fn: rateLimitTest },
    { name: 'Error Handling', fn: errorRecoveryTest },
    { name: 'Endpoint Resilience', fn: cascadingFailureTest }
  ];
  
  for (const { name, fn } of testFunctions) {
    // Notify test is starting
    notifyTestProgress(name, 'running', { action: 'Initializing test...' });
    
    // Run the test (pass notifyTestProgress so test can send live updates)
    const result = await fn(url, notifyTestProgress);
    tests.push(result);
    
    // Notify test completed
    notifyTestProgress(name, result.passed ? 'passed' : 'failed', {
      duration: result.duration,
      message: result.message,
      details: result.details
    });
  }
  
  return {
    url: url,
    tests,
    totalDuration: tests.reduce((sum, t) => sum + t.duration, 0)
  };
}



