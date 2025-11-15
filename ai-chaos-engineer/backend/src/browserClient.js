/**
 * Simple HTTP-based UI checks
 * Browser automation removed for stability
 */

import { sendLog, sendTestStart, sendTestComplete, sendError } from './realtime.js';

/**
 * Perform UI checks
 */
export async function checkUI(url) {
  console.log(`[UI Check] Running HTTP-based check for ${url}`);
  
  sendTestStart('UI Check', url);
  sendLog(`Checking URL accessibility for ${url}...`, 'info');
  
  const startTime = Date.now();
  
  try {
    // Use fetch to check if URL is reachable
    sendLog('Sending HTTP request...', 'info');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ChaosEngineer/1.0)'
      },
      signal: controller.signal
    }).catch((err) => {
      clearTimeout(timeout);
      sendLog(`Request failed: ${err.message}`, 'error');
      return null;
    });
    
    clearTimeout(timeout);
    
    const duration = Date.now() - startTime;
    const accessible = response && response.ok;
    const statusCode = response?.status || 0;
    
    if (accessible) {
      sendLog(`✅ URL accessible (HTTP ${statusCode})`, 'success');
    } else {
      sendLog(`❌ URL not accessible (HTTP ${statusCode || 'timeout'})`, 'error');
    }
    
    // Simple checks based on HTTP response
    const checks = {
      accessible: accessible,
      validStatusCode: statusCode >= 200 && statusCode < 400,
      fastResponse: duration < 3000
    };
    
    const passed = checks.accessible && checks.validStatusCode && checks.fastResponse;
    
    const issues = [];
    if (!checks.accessible) issues.push('URL not accessible');
    if (!checks.validStatusCode) issues.push(`HTTP ${statusCode}`);
    if (!checks.fastResponse) issues.push(`Slow response (${duration}ms)`);
    
    const result = {
      test: 'UI Check',
      passed,
      duration,
      message: passed
        ? `URL is accessible and responsive (${duration}ms)`
        : `Issues detected: ${issues.join(', ')}`,
      severity: passed ? 'low' : 'medium',
      details: {
        accessible: checks.accessible,
        statusCode,
        responseTime: duration,
        fastResponse: checks.fastResponse
      }
    };
    
    sendTestComplete('UI Check', result);
    sendLog(`UI Check ${passed ? 'PASSED' : 'FAILED'}: ${result.message}`, passed ? 'success' : 'error');
    
    return result;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    sendError(error, 'UI Check');
    
    const result = {
      test: 'UI Check',
      passed: false,
      duration,
      message: `Check failed: ${error.message}`,
      severity: 'high',
      details: {
        error: error.message
      }
    };
    
    sendTestComplete('UI Check', result);
    sendLog(`UI Check FAILED: ${error.message}`, 'error');
    
    return result;
  }
}
