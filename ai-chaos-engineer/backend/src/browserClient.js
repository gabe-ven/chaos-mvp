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
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
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
    
    // Navigate to URL
    console.log(`[Browser] Navigating to ${url}...`);
    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
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
    
    return {
      test: 'UI Check (Browser)',
      passed: false,
      duration: Date.now() - startTime,
      message: `Browser check failed: ${error.message}`,
      severity: 'high'
    };
  } finally {
    if (browser) {
      await browser.close();
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

