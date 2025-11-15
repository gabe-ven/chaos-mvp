import { checkUI as checkUIBrowser } from './browserClient.js';
import { sleep } from './utils/timers.js';
import { startTestSpan, finishTestSpan } from './sentryClient.js';

/**
 * Tests actual response time by making real HTTP requests
 */
export async function injectLatency(url, notifyProgress = null) {
  console.log(`[Response Time Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Response Time', 'running', { 
      action: 'Initializing connection',
      metric: 'Preparing to measure server response time'
    });
    
    if (notifyProgress) notifyProgress('Response Time', 'running', { 
      action: 'Sending HTTP GET request',
      metric: 'Waiting for server response...'
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
      }
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('Response Time', 'running', { 
      action: 'Response received',
      metric: `${responseTime}ms - HTTP ${response.status}`
    });
    
    const passed = responseTime < 3000 && response.ok;
    
    if (notifyProgress) notifyProgress('Response Time', 'running', { 
      action: passed ? 'Response time is good' : 'Response time is slow',
      metric: `${responseTime}ms / 3000ms threshold`
    });
    
    return {
      test: 'Response Time',
      passed,
      duration: responseTime,
      message: passed 
        ? `Server responded in ${responseTime}ms (good)` 
        : `Response time: ${responseTime}ms ${!response.ok ? `(HTTP ${response.status})` : '(too slow)'}`,
      severity: passed ? 'low' : 'medium',
      details: {
        responseTime,
        status: response.status,
        threshold: 3000
      }
    };
  } catch (error) {
    return {
      test: 'Response Time',
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
  console.log(`[Concurrent Load Test] Testing ${url}...`);
  const startTime = Date.now();
  
  try {
    if (notifyProgress) notifyProgress('Concurrent Load', 'running', { 
      action: 'Preparing load test',
      metric: 'Configuring 10 concurrent connections'
    });
    
    const concurrentRequests = 10;
    
    if (notifyProgress) notifyProgress('Concurrent Load', 'running', { 
      action: 'Firing concurrent requests',
      metric: `Sending ${concurrentRequests} simultaneous HEAD requests...`
    });
    
    const promises = Array(concurrentRequests).fill(null).map(async () => {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
          }
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
    
    if (notifyProgress) notifyProgress('Concurrent Load', 'running', { 
      action: 'Processing responses',
      metric: `All requests completed in ${duration}ms`
    });
    
    const successful = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const passed = successful >= concurrentRequests * 0.9 && avgResponseTime < 5000;
    
    if (notifyProgress) notifyProgress('Concurrent Load', 'running', { 
      action: 'Calculating success rate',
      metric: `${successful}/${concurrentRequests} succeeded (${(successful/concurrentRequests*100).toFixed(0)}%)`
    });
    
    return {
      test: 'Concurrent Load',
      passed,
      duration,
      message: passed 
        ? `Handled ${successful}/${concurrentRequests} concurrent requests (avg: ${Math.round(avgResponseTime)}ms)` 
        : `Poor load handling: ${successful}/${concurrentRequests} succeeded`,
      severity: passed ? 'low' : 'medium',
      details: {
        totalRequests: concurrentRequests,
        successful,
        failed: concurrentRequests - successful,
        avgResponseTime: Math.round(avgResponseTime)
      }
    };
  } catch (error) {
    return {
      test: 'Concurrent Load',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

/**
 * Performs UI check using browser automation
 */
export async function uiCheck(url, notifyProgress = null) {
  console.log(`[UI Health Check] Testing ${url}...`);
  
  if (notifyProgress) notifyProgress('UI Health Check', 'running', { 
    action: 'Starting UI health check',
    metric: 'Initializing browser automation (Browser Use AI if available)'
  });
  
  // Use browser automation from browserClient
  // Will try Browser Use first, then Puppeteer, then stub
  const result = await checkUIBrowser(url);
  
  if (notifyProgress) notifyProgress('UI Health Check', 'running', { 
    action: 'Analysis complete',
    metric: result.passed ? 'UI health check complete' : 'Issues detected'
  });
  
  return result;
}

/**
 * Tests for memory leaks by making repeated real requests and measuring response degradation
 */
export async function memoryLeakTest(url, notifyProgress = null) {
  console.log(`[Performance Consistency Test] Testing ${url}...`);
  const startTime = Date.now();
  const iterations = 30;
  const responseTimes = [];
  
  if (notifyProgress) notifyProgress('Performance Consistency', 'running', { 
    action: 'Initializing consistency test',
    metric: 'Preparing to make rapid consecutive requests'
  });
  
  try {
    if (notifyProgress) notifyProgress('Performance Consistency', 'running', { 
      action: 'Running rapid requests',
      metric: `Making ${iterations} consecutive HEAD requests...`
    });
    
    for (let i = 0; i < iterations; i++) {
      if (i % 10 === 0 && notifyProgress) {
        notifyProgress('Performance Consistency', 'running', { 
          action: 'Testing in progress',
          metric: `Request ${i + 1}/${iterations} - monitoring response times`
        });
      }
      
      const iterStart = Date.now();
      await fetch(url, { 
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
        }
      }).catch(() => null);
      responseTimes.push(Date.now() - iterStart);
    }
    
    const duration = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('Performance Consistency', 'running', { 
      action: 'Analyzing performance data',
      metric: `Comparing early vs late response times`
    });
    
    const firstQuarter = responseTimes.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
    const lastQuarter = responseTimes.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const degradation = ((lastQuarter - firstQuarter) / firstQuarter) * 100;
    
    const passed = degradation < 50;
    
    if (notifyProgress) notifyProgress('Performance Consistency', 'running', { 
      action: 'Calculation complete',
      metric: `${degradation > 0 ? '+' : ''}${degradation.toFixed(1)}% change in response time`
    });
    
    return {
      test: 'Performance Consistency',
      passed,
      duration,
      message: passed
        ? `Performance stable: ${degradation.toFixed(1)}% response time change`
        : `Performance degraded: ${degradation.toFixed(1)}% slower over time (potential memory leak)`,
      severity: passed ? 'low' : 'medium',
      details: {
        iterations,
        avgFirstQuarter: Math.round(firstQuarter),
        avgLastQuarter: Math.round(lastQuarter),
        degradationPercent: degradation.toFixed(1)
      }
    };
  } catch (error) {
    return {
      test: 'Performance Consistency',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'medium'
    };
  }
}

/**
 * Tests server resilience under heavy load (CPU stress)
 */
export async function cpuSpikeTest(url, notifyProgress = null) {
  console.log(`[Heavy Load Stress Test] Testing ${url}...`);
  const startTime = Date.now();
  const heavyRequests = 5;
  
  if (notifyProgress) notifyProgress('Heavy Load Stress', 'running', { 
    action: 'Preparing stress test',
    metric: `Configuring ${heavyRequests} heavy GET requests`
  });
  
  try {
    if (notifyProgress) notifyProgress('Heavy Load Stress', 'running', { 
      action: 'Sending heavy load',
      metric: `${heavyRequests} full GET requests firing simultaneously...`
    });
    
    const promises = Array(heavyRequests).fill(null).map(async () => {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
          }
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
    
    if (notifyProgress) notifyProgress('Heavy Load Stress', 'running', { 
      action: 'Processing results',
      metric: `All heavy requests completed in ${duration}ms`
    });
    
    const successful = results.filter(r => r.success).length;
    const passed = successful === heavyRequests && duration < 10000;
    
    if (notifyProgress) notifyProgress('Heavy Load Stress', 'running', { 
      action: 'Evaluating server resilience',
      metric: `${successful}/${heavyRequests} succeeded - ${passed ? 'Good' : 'Issues detected'}`
    });
    
    return {
      test: 'Heavy Load Stress',
      passed,
      duration,
      message: passed
        ? `Server handled ${successful}/${heavyRequests} heavy requests in ${duration}ms`
        : `Server struggled: ${successful}/${heavyRequests} succeeded in ${duration}ms`,
      severity: passed ? 'low' : 'medium',
      details: {
        totalRequests: heavyRequests,
        successful,
        failed: heavyRequests - successful,
        totalDuration: duration
      }
    };
  } catch (error) {
    return {
      test: 'Heavy Load Stress',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'medium'
    };
  }
}

/**
 * Tests rate limiting by sending rapid requests
 */
export async function rateLimitTest(url, notifyProgress = null) {
  console.log(`[Rate Limiting Test] Testing ${url}...`);
  const startTime = Date.now();
  const burstSize = 25;
  
  if (notifyProgress) notifyProgress('Rate Limiting', 'running', { 
    action: 'Preparing rate limit test',
    metric: `Configuring rapid burst of ${burstSize} requests`
  });
  
  try {
    if (notifyProgress) notifyProgress('Rate Limiting', 'running', { 
      action: 'Sending rapid burst',
      metric: `Firing ${burstSize} requests as fast as possible...`
    });
    
    const promises = Array(burstSize).fill(null).map(async (_, idx) => {
      const reqStart = Date.now();
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
          }
        });
        return {
          success: response.ok,
          status: response.status,
          duration: Date.now() - reqStart,
          rateLimited: response.status === 429
        };
      } catch (err) {
        return {
          success: false,
          error: err.message,
          duration: Date.now() - reqStart,
          rateLimited: false
        };
      }
    });
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    if (notifyProgress) notifyProgress('Rate Limiting', 'running', { 
      action: 'Analyzing rate limit behavior',
      metric: `Burst completed in ${duration}ms`
    });
    
    const rateLimitedCount = results.filter(r => r.rateLimited).length;
    const successful = results.filter(r => r.success).length;
    const hasRateLimiting = rateLimitedCount > 0 || successful < burstSize * 0.8;
    
    if (notifyProgress) notifyProgress('Rate Limiting', 'running', { 
      action: 'Evaluating protection',
      metric: `${rateLimitedCount} rate-limited responses detected`
    });
    
    const passed = hasRateLimiting || successful === burstSize;
    
    return {
      test: 'Rate Limiting',
      passed,
      duration,
      message: hasRateLimiting
        ? `Rate limiting active: ${rateLimitedCount} requests throttled`
        : `No rate limiting detected (${successful}/${burstSize} succeeded)`,
      severity: hasRateLimiting ? 'low' : 'low',
      details: {
        totalRequests: burstSize,
        successful,
        rateLimited: rateLimitedCount,
        hasProtection: hasRateLimiting
      }
    };
  } catch (error) {
    return {
      test: 'Rate Limiting',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'low'
    };
  }
}

/**
 * Tests error handling and recovery
 */
export async function errorRecoveryTest(url, notifyProgress = null) {
  console.log(`[Error Handling Test] Testing ${url}...`);
  const startTime = Date.now();
  
  if (notifyProgress) notifyProgress('Error Handling', 'running', { 
    action: 'Testing error responses',
    metric: 'Requesting invalid paths...'
  });
  
  try {
    const invalidPaths = ['/nonexistent-path-12345', '/404-test', '/error-test'];
    
    if (notifyProgress) notifyProgress('Error Handling', 'running', { 
      action: 'Sending requests to invalid paths',
      metric: `Testing ${invalidPaths.length} error scenarios`
    });
    
    const errorResults = await Promise.all(
      invalidPaths.map(async (path) => {
        try {
          const testUrl = new URL(path, url).href;
          const response = await fetch(testUrl, { 
            method: 'HEAD',
            redirect: 'manual',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
            }
          });
          return {
            path,
            status: response.status,
            handled: response.status === 404 || response.status >= 400
          };
        } catch (err) {
          return { path, error: err.message, handled: false };
        }
      })
    );
    
    if (notifyProgress) notifyProgress('Error Handling', 'running', { 
      action: 'Verifying main URL stability',
      metric: 'Checking if site recovered from error requests...'
    });
    
    const mainResponse = await fetch(url, { 
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
      }
    });
    const mainStillWorks = mainResponse.ok;
    
    const duration = Date.now() - startTime;
    const properlyHandled = errorResults.filter(r => r.handled).length;
    const passed = properlyHandled >= 2 && mainStillWorks;
    
    if (notifyProgress) notifyProgress('Error Handling', 'running', { 
      action: 'Error handling analysis complete',
      metric: `${properlyHandled}/${invalidPaths.length} errors handled properly`
    });
    
    return {
      test: 'Error Handling',
      passed,
      duration,
      message: passed
        ? `Error handling works: ${properlyHandled}/${invalidPaths.length} errors handled, main URL stable`
        : `Poor error handling: only ${properlyHandled}/${invalidPaths.length} handled${!mainStillWorks ? ', main URL affected' : ''}`,
      severity: passed ? 'low' : 'medium',
      details: {
        testedPaths: invalidPaths.length,
        properlyHandled,
        mainUrlStable: mainStillWorks,
        errorResults
      }
    };
  } catch (error) {
    return {
      test: 'Error Handling',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'medium'
    };
  }
}

/**
 * Tests for cascading failures across endpoints
 */
export async function cascadingFailureTest(url, notifyProgress = null) {
  console.log(`[Endpoint Resilience Test] Testing ${url}...`);
  const startTime = Date.now();
  
  if (notifyProgress) notifyProgress('Endpoint Resilience', 'running', { 
    action: 'Identifying endpoints',
    metric: 'Preparing to test multiple endpoints simultaneously'
  });
  
  try {
    const baseUrl = new URL(url);
    const endpoints = [
      url,
      new URL('/api', baseUrl).href,
      new URL('/assets', baseUrl).href,
      new URL('/static', baseUrl).href
    ];
    
    if (notifyProgress) notifyProgress('Endpoint Resilience', 'running', { 
      action: 'Testing endpoint isolation',
      metric: `Simultaneously testing ${endpoints.length} endpoints...`
    });
    
    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, { 
            method: 'HEAD',
            redirect: 'manual',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
            }
          });
          return {
            endpoint,
            status: response.status,
            ok: response.ok || response.status === 404
          };
        } catch (err) {
          return {
            endpoint,
            error: err.message,
            ok: false
          };
        }
      })
    );
    
    if (notifyProgress) notifyProgress('Endpoint Resilience', 'running', { 
      action: 'Verifying main URL stability',
      metric: 'Checking if failures cascaded to main endpoint...'
    });
    
    const mainUrlOk = results[0].ok;
    const successfulEndpoints = results.filter(r => r.ok).length;
    const failedEndpoints = results.length - successfulEndpoints;
    
    const duration = Date.now() - startTime;
    const passed = mainUrlOk && (failedEndpoints === 0 || successfulEndpoints >= 2);
    
    if (notifyProgress) notifyProgress('Endpoint Resilience', 'running', { 
      action: 'Cascade analysis complete',
      metric: `${successfulEndpoints}/${endpoints.length} endpoints healthy`
    });
    
    return {
      test: 'Endpoint Resilience',
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
        mainUrlStable: mainUrlOk,
        results
      }
    };
  } catch (error) {
    return {
      test: 'Endpoint Resilience',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'critical'
    };
  }
}

/**
 * Runs all chaos tests directly on the provided URL
 * Optionally accepts a Sentry transaction for per-test spans
 */
export async function runChaosTests(url, options = {}) {
  console.log(`\n[Tests] Starting health checks for: ${url}\n`);
  
  const { transaction } = options || {};
  
  // Import WebSocket notification
  const { notifyTestProgress } = await import('./websocket.js');
  
  // Run tests sequentially so we can notify progress for each one
  const tests = [];
  
  // All technical health checks
  const testFunctions = [
    { name: 'Response Time', fn: injectLatency },
    { name: 'Concurrent Load', fn: loadSpike },
    { name: 'Performance Consistency', fn: memoryLeakTest },
    { name: 'Heavy Load Stress', fn: cpuSpikeTest },
    { name: 'Rate Limiting', fn: rateLimitTest },
    { name: 'Error Handling', fn: errorRecoveryTest },
    { name: 'Endpoint Resilience', fn: cascadingFailureTest }
  ];
  
  for (let i = 0; i < testFunctions.length; i++) {
    const { name, fn } = testFunctions[i];
    let span = null;
    
    try {
      console.log(`[Tests] Running ${name} (${i + 1}/${testFunctions.length})...`);
      
      // Start Sentry span for this test
      span = startTestSpan(transaction, name, { url });
      
      // Notify test is starting
      notifyTestProgress(name, 'running', { action: 'Initializing test' });
      
      // Small delay to ensure WebSocket message is sent
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Run the test (pass notifyTestProgress so test can send live updates)
      const result = await fn(url, notifyTestProgress);
      tests.push(result);
      
      console.log(`[Tests] ${name} completed: ${result.passed ? 'PASS' : 'FAIL'} (${result.duration}ms)`);
      
      // Notify test completed
      notifyTestProgress(name, result.passed ? 'passed' : 'failed', {
        duration: result.duration,
        message: result.message,
        details: result.details
      });
      
      // Finish Sentry span
      finishTestSpan(span, result.passed ? 'ok' : 'error');
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[Tests] ${name} error:`, error.message);
      
      // Record failed test
      tests.push({
        test: name,
        passed: false,
        duration: 0,
        message: `Test error: ${error.message}`,
        severity: 'critical'
      });
      
      notifyTestProgress(name, 'failed', {
        duration: 0,
        message: `Test error: ${error.message}`
      });
      
      // Finish span with error
      finishTestSpan(span, 'error');
    }
  }
  
  console.log(`\n[Tests] All health checks complete: ${tests.filter(t => t.passed).length}/${tests.length} passed`);
  
  return {
    url: url,
    tests,
    totalDuration: tests.reduce((sum, t) => sum + (t.duration || 0), 0)
  };
}
