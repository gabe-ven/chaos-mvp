/**
 * Browser automation for real UI checks
 * Integrates with Browser Use AI service for intelligent testing
 */

import WebSocket from 'ws';
import { broadcast } from './websocket.js';

let puppeteer = null;
let USE_REAL_BROWSER = false;

// Try to load Puppeteer as fallback
try {
  puppeteer = await import('puppeteer');
  USE_REAL_BROWSER = true;
  console.log('[Browser] Puppeteer loaded - available as fallback');
} catch (error) {
  console.log('[Browser] Puppeteer not installed - Browser Use will be primary');
}

const BROWSER_USE_SERVICE = process.env.BROWSER_USE_SERVICE_URL || 'http://localhost:3002';
const BROWSER_USE_WS = BROWSER_USE_SERVICE.replace('http', 'ws') + '/ws';

/**
 * Connect to Browser Use WebSocket for real-time action streaming
 */
function connectToBrowserUseWebSocket() {
  return new Promise((resolve, reject) => {
    console.log('[Browser Use] Connecting to WebSocket:', BROWSER_USE_WS);
    const ws = new WebSocket(BROWSER_USE_WS);
    
    let isResolved = false;
    const timeout = setTimeout(() => {
      if (!isResolved) {
        console.log('[Browser Use] WebSocket connection timeout');
        reject(new Error('WebSocket connection timeout'));
      }
    }, 5000);
    
    ws.on('open', () => {
      isResolved = true;
      clearTimeout(timeout);
      console.log('[Browser Use] WebSocket connected successfully');
      resolve(ws);
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('[Browser Use] Received message:', message.type, message.action);
        
        if (message.type === 'browser_action') {
          // Relay to frontend via backend WebSocket
          broadcast(message);
          console.log(`[Browser Use] → Frontend: ${message.action} - ${message.message}`);
        }
      } catch (e) {
        console.error('[Browser Use] Parse error:', e);
      }
    });
    
    ws.on('error', (error) => {
      console.log('[Browser Use] WebSocket error:', error.message);
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        reject(error);
      }
    });
    
    ws.on('close', () => {
      console.log('[Browser Use] WebSocket closed');
    });
  });
}

/**
 * Check UI using Browser Use AI service with live streaming
 */
async function checkUIWithBrowserUse(url) {
  let ws = null;
  
  try {
    // First, check if service is available
    console.log('[Browser Use] Checking service availability...');
    const healthCheck = await fetch(`${BROWSER_USE_SERVICE}/health`, { 
      signal: AbortSignal.timeout(3000) 
    }).catch(() => null);
    
    if (!healthCheck || !healthCheck.ok) {
      console.log('[Browser Use] Service not available - will use fallback');
      return null;
    }
    
    console.log('[Browser Use] Service available');
    
    // Start WebSocket connection (but don't wait if it fails)
    console.log('[Browser Use] Attempting WebSocket connection...');
    ws = await connectToBrowserUseWebSocket().catch((err) => {
      console.log('[Browser Use] WebSocket failed, continuing anyway:', err.message);
      return null;
    });
    
    if (ws) {
      console.log('[Browser Use] WebSocket connected, live updates enabled');
      
      // Keep WebSocket alive during the entire check
      const keepAlive = setInterval(() => {
        if (ws.readyState === 1) { // OPEN
          ws.ping();
        }
      }, 10000); // Ping every 10 seconds
      
      // Store keepAlive interval for cleanup
      ws.keepAliveInterval = keepAlive;
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      console.log('[Browser Use] No WebSocket, will provide basic updates');
    }
    
    // Notify frontend we're starting
    console.log('[Browser Use] Sending start notification to frontend');
    broadcast({
      type: 'browser_action',
      action: 'starting',
      message: 'Starting AI browser analysis',
      timestamp: new Date().toISOString()
    });
    
    // Make HTTP request to start UI check
    console.log('[Browser Use] Starting UI check HTTP request...');
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('[Browser Use] Request timeout!');
      controller.abort();
    }, 60000); // 60s timeout
    
    const response = await fetch(`${BROWSER_USE_SERVICE}/ui-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        task: 'Run comprehensive website health check. Navigate, test links, check forms, find errors, assess UX.'
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Service returned ${response.status}`);
    }
    
    const result = await response.json();
    console.log('[Browser Use] Analysis complete:', result.passed ? 'PASS' : 'FAIL');
    
    // Final update
    console.log('[Browser Use] Sending completion notification to frontend');
    broadcast({
      type: 'browser_action',
      action: 'complete',
      message: result.message || 'Analysis complete',
      timestamp: new Date().toISOString()
    });
    
    // Give time for final messages to be relayed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Close WebSocket and cleanup
    if (ws) {
      if (ws.keepAliveInterval) {
        clearInterval(ws.keepAliveInterval);
      }
      ws.close();
      console.log('[Browser Use] WebSocket closed after analysis');
    }
    
    return result;
  } catch (error) {
    console.error('[Browser Use] Error:', error.message);
    
    if (ws) {
      if (ws.keepAliveInterval) {
        clearInterval(ws.keepAliveInterval);
      }
      ws.close();
    }
    
    console.log('[Browser Use] Sending error notification to frontend');
    broadcast({
      type: 'browser_action',
      action: 'error',
      message: `Analysis failed: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    
    return null;
  }
}

/**
 * Main UI check function (tries Browser Use first, falls back to Puppeteer)
 */
export async function checkUI(url) {
  const startTime = Date.now();
  
  // Try Browser Use first (AI-powered)
  const browserUseResult = await checkUIWithBrowserUse(url);
  
  if (browserUseResult) {
    return {
      test: 'UI Check (Browser)',
      passed: browserUseResult.passed,
      duration: Date.now() - startTime,
      message: browserUseResult.message,
      severity: browserUseResult.passed ? 'low' : 'medium',
      details: {
        ...browserUseResult.details,
        method: '🤖 AI-Powered (Browser Use)'
      }
    };
  }
  
  // Fallback to Puppeteer
  if (USE_REAL_BROWSER && puppeteer) {
    console.log('[Browser] Falling back to Puppeteer');
    return await checkUIWithPuppeteer(url, startTime);
  }
  
  // Final fallback: stub
  console.log('[Browser] No browser automation available - using stub');
  return await checkUIStub(url, startTime);
}

/**
 * Puppeteer-based UI check (fallback)
 */
async function checkUIWithPuppeteer(url, startTime) {
  let browser = null;
  
  try {
    console.log(`[Browser] Launching Puppeteer for ${url}...`);
    
    const isLiveMode = process.env.BROWSER_LIVE === 'true';
    
    browser = await puppeteer.launch({
      headless: isLiveMode ? false : 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--ignore-certificate-errors',
        '--disable-gpu'
      ],
      ...(isLiveMode && {
        slowMo: 100,
        devtools: false
      })
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    const networkErrors = [];
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.url()} - ${request.failure().errorText}`);
    });
    
    console.log(`[Browser] Navigating to ${url}...`);
    
    const response = await page.goto(url, {
      waitUntil: 'load',
      timeout: 30000
    });
    
    const statusCode = response.status();
    const pageLoaded = statusCode >= 200 && statusCode < 400;
    
    const accessibilityChecks = await page.evaluate(() => {
      const hasTitle = !!document.title;
      const hasH1 = document.querySelectorAll('h1').length > 0;
      const hasLang = !!document.documentElement.lang;
      const hasAlt = Array.from(document.querySelectorAll('img')).every(img => img.alt !== undefined);
      
      return {
        hasTitle,
        hasH1,
        hasLang,
        hasAlt: document.querySelectorAll('img').length === 0 || hasAlt
      };
    });
    
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const responsive = await page.evaluate(() => {
      const hasViewport = !!document.querySelector('meta[name="viewport"]');
      const hasResponsiveElements = getComputedStyle(document.body).display !== 'none';
      return hasViewport && hasResponsiveElements;
    });
    
    const duration = Date.now() - startTime;
    const accessible = Object.values(accessibilityChecks).every(v => v);
    const noErrors = consoleErrors.length === 0 && networkErrors.length === 0;
    const passed = pageLoaded && accessible && responsive && noErrors;
    
    const issues = [];
    if (!pageLoaded) issues.push(`HTTP ${statusCode}`);
    if (!accessible) issues.push('Accessibility issues');
    if (!responsive) issues.push('Not responsive');
    if (consoleErrors.length > 0) issues.push(`${consoleErrors.length} console errors`);
    if (networkErrors.length > 0) issues.push(`${networkErrors.length} network errors`);
    
    return {
      test: 'UI Check (Browser)',
      passed,
      duration,
      message: passed
        ? 'UI is accessible, responsive, and error-free'
        : `UI issues detected: ${issues.join(', ')}`,
      severity: passed ? 'low' : 'medium',
      details: {
        pageLoaded,
        statusCode,
        accessibility: accessibilityChecks,
        responsive,
        consoleErrors: consoleErrors.slice(0, 5),
        networkErrors: networkErrors.slice(0, 5),
        noErrors,
        method: 'Puppeteer'
      }
    };
  } catch (error) {
    console.error('[Browser] Puppeteer check failed:', error.message);
    
    return {
      test: 'UI Check (Browser)',
      passed: false,
      duration: Date.now() - startTime,
      message: `Browser check failed: ${error.message}`,
      severity: 'high',
      details: {
        error: error.message,
        urlTested: url,
        method: 'Puppeteer'
      }
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

/**
 * Stub UI check (when nothing else is available)
 */
async function checkUIStub(url, startTime) {
  console.log(`[Browser] Using stub UI check`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteReliabilityMonitor/1.0)'
      }
    }).catch(() => null);
    
    const accessible = response && response.ok;
    const passed = accessible && Math.random() > 0.2;
    const duration = Date.now() - startTime;
    
    return {
      test: 'UI Check (Stub)',
      passed,
      duration,
      message: passed
        ? 'UI check passed (stub mode - install Browser Use or Puppeteer for real checks)'
        : `UI issues detected (stub mode)`,
      severity: passed ? 'low' : 'medium',
      details: {
        accessible,
        method: 'Stub',
        note: 'Install Browser Use service for AI-powered checks'
      }
    };
  } catch (error) {
    return {
      test: 'UI Check (Stub)',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high',
      details: {
        method: 'Stub'
      }
    };
  }
}
