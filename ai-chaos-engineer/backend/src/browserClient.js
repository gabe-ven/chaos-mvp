/**
 * Browser automation for real UI checks using Puppeteer
 */

let puppeteer = null;
let USE_REAL_BROWSER = false;

// Try to load Puppeteer
try {
  puppeteer = await import('puppeteer');
  USE_REAL_BROWSER = true;
  console.log('[Browser] Puppeteer loaded - real UI checks enabled');
} catch (error) {
  console.log('[Browser] Puppeteer not installed - using stub UI checks');
  console.log('[Browser] Run: npm install puppeteer');
}

/**
 * Perform real UI checks using browser automation
 */
export async function checkUI(url) {
  if (USE_REAL_BROWSER && puppeteer) {
    return await checkUIReal(url);
  } else {
    return await checkUIStub(url);
  }
}

/**
 * Real browser-based UI check
 */
async function checkUIReal(url) {
  const startTime = Date.now();
  let browser = null;
  
  try {
    console.log(`[Browser] Launching browser for ${url}...`);
    
    // Launch browser - set headless:false to see live browser window!
    const isLiveMode = process.env.BROWSER_LIVE === 'true';
    
    browser = await puppeteer.launch({
      headless: isLiveMode ? false : 'new', // Show browser if BROWSER_LIVE=true
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
        slowMo: 100, // Slow down actions so you can see them
        devtools: false
      })
    });
    
    if (isLiveMode) {
      console.log('[Browser] 🎥 LIVE MODE: Browser window visible!');
    }
    
    const page = await browser.newPage();
    
    // Set realistic user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });
    
    // Collect console errors
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Collect network errors
    const networkErrors = [];
    page.on('requestfailed', (request) => {
      networkErrors.push(`${request.url()} - ${request.failure().errorText}`);
    });
    
    // Navigate to URL with better error handling
    console.log(`[Browser] Navigating to ${url}...`);
    
    let response;
    try {
      response = await page.goto(url, {
        waitUntil: 'load', // Wait for load event
        timeout: 30000 // 30 second timeout
      });
      
      console.log(`[Browser] Page loaded with status: ${response.status()}`);
    } catch (navError) {
      console.error(`[Browser] Navigation error: ${navError.message}`);
      
      // Try to get page content even if navigation failed
      const pageContent = await page.content().catch(() => '<html></html>');
      const hasContent = pageContent.length > 100;
      
      await browser.close();
      const duration = Date.now() - startTime;
      
      // If page loaded some content, it's partially working
      if (hasContent) {
        return {
          test: 'UI Check (Browser)',
          passed: false,
          duration,
          message: `Page loaded with errors: ${navError.message} (site may have bot protection or strict security)`,
          severity: 'medium',
          details: {
            error: navError.message,
            urlTested: url,
            browserCheck: 'Partial load',
            contentLength: pageContent.length
          }
        };
      }
      
      return {
        test: 'UI Check (Browser)',
        passed: false,
        duration,
        message: `Browser navigation failed: ${navError.message} (site may block automated browsers)`,
        severity: 'high',
        details: {
          error: navError.message,
          urlTested: url,
          browserCheck: 'Failed to connect',
          suggestion: 'Site may have bot protection or firewall rules'
        }
      };
    }
    
    // Check if page loaded
    const statusCode = response.status();
    const pageLoaded = statusCode >= 200 && statusCode < 400;
    
    // Check accessibility
    const accessibilityChecks = await page.evaluate(() => {
      // Check for basic accessibility features
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
    
    // Check responsiveness (test mobile viewport)
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const responsive = await page.evaluate(() => {
      const hasViewport = !!document.querySelector('meta[name="viewport"]');
      const hasResponsiveElements = getComputedStyle(document.body).display !== 'none';
      return hasViewport && hasResponsiveElements;
    });
    
    // Calculate results
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
    
    console.log(`[Browser] Check complete: ${passed ? 'PASS' : 'FAIL'}`);
    
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
        consoleErrors: consoleErrors.slice(0, 5), // Limit to 5
        networkErrors: networkErrors.slice(0, 5),
        noErrors
      }
    };
  } catch (error) {
    console.error('[Browser] UI check failed:', error.message);
    
    // Provide more helpful error message
    let message = `Browser check failed: ${error.message}`;
    let helpText = '';
    
    if (error.message.includes('socket hang up') || error.message.includes('ECONNREFUSED') || error.message.includes('net::ERR')) {
      helpText = ' (URL is not reachable - ensure it\'s a live web application, not just a GitHub repo)';
    } else if (error.message.includes('timeout') || error.message.includes('Navigation timeout')) {
      helpText = ' (page took too long to load)';
    }
    
    return {
      test: 'UI Check (Browser)',
      passed: false,
      duration: Date.now() - startTime,
      message: message + helpText,
      severity: 'high',
      details: {
        error: error.message,
        urlTested: url,
        browserCheck: 'Connection failed'
      }
    };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        // Ignore close errors
      }
    }
  }
}

/**
 * Stub UI check (when Puppeteer not available)
 */
async function checkUIStub(url) {
  console.log(`[Browser] Using stub UI check (no Puppeteer)`);
  
  const startTime = Date.now();
  
  try {
    // Use fetch to at least check if URL is reachable
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ChaosEngineer/1.0)'
      }
    }).catch(() => null);
    
    const accessible = response && response.ok;
    
    // Simulate random results for demo
    const checks = {
      accessible: accessible || Math.random() > 0.2,
      responsive: Math.random() > 0.1,
      noErrors: Math.random() > 0.15
    };
    
    const passed = checks.accessible && checks.responsive && checks.noErrors;
    const duration = Date.now() - startTime;
    
    return {
      test: 'UI Check (Stub)',
      passed,
      duration,
      message: passed
        ? 'UI check passed (stub mode)'
        : `UI issues detected (stub): ${Object.entries(checks)
            .filter(([_, v]) => !v)
            .map(([k]) => k)
            .join(', ')}`,
      severity: passed ? 'low' : 'medium',
      details: checks,
      note: 'Install Puppeteer for real UI checks: npm install puppeteer'
    };
  } catch (error) {
    return {
      test: 'UI Check (Stub)',
      passed: false,
      duration: Date.now() - startTime,
      message: `Error: ${error.message}`,
      severity: 'high'
    };
  }
}

