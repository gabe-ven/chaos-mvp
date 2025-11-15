/**
 * CHAOS RUNNER - Playwright Automation
 * Performs random chaos testing on localhost app
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const CHAOS_DURATION = parseInt(process.env.CHAOS_DURATION) || 30000; // 30 seconds
const SCREENSHOT_DIR = join(__dirname, '../backend/public/screenshots');
const VIDEO_DIR = join(__dirname, '../backend/public/videos');

// Stability tracking
let stability = 100;
let eventCount = 0;

// Connect to backend WebSocket
let ws;
async function connectToBackend() {
  const WebSocket = (await import('ws')).default;
  ws = new WebSocket('ws://localhost:8080');
  
  ws.on('open', () => {
    console.log('✅ Connected to backend WebSocket');
    broadcast({ type: 'log', message: '🔥 Chaos Runner Started', level: 'success' });
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });
}

function broadcast(payload) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({
      ...payload,
      timestamp: Date.now()
    }));
  } else {
    console.log('⚠️  Backend not connected, logging locally:', payload.type);
  }
}

/**
 * Update stability score
 */
function updateStability(change, reason) {
  stability = Math.max(0, Math.min(100, stability + change));
  broadcast({
    type: 'stability',
    value: stability,
    reason,
    change
  });
}

/**
 * Random chaos actions
 */
const chaosActions = [
  {
    name: 'clickRandomElement',
    weight: 30,
    async execute(page) {
      const clickableSelectors = [
        'button', 'a', '[role="button"]', 'input[type="submit"]',
        '[onclick]', '.btn', '.button'
      ];
      
      const selector = clickableSelectors[Math.floor(Math.random() * clickableSelectors.length)];
      const elements = await page.$$(selector);
      
      if (elements.length > 0) {
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const text = await randomElement.textContent().catch(() => 'unknown');
        
        broadcast({
          type: 'browser_event',
          action: 'click',
          target: `${selector} ("${text?.substring(0, 20)}")`
        });
        
        await randomElement.click();
        updateStability(1, 'Successful click');
        return true;
      }
      return false;
    }
  },
  {
    name: 'randomNavigation',
    weight: 20,
    async execute(page) {
      const links = await page.$$('a[href]');
      if (links.length > 0) {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        const href = await randomLink.getAttribute('href');
        
        broadcast({
          type: 'browser_event',
          action: 'navigate',
          target: href
        });
        
        await randomLink.click();
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        updateStability(1, 'Navigation successful');
        return true;
      }
      return false;
    }
  },
  {
    name: 'fillRandomInput',
    weight: 15,
    async execute(page) {
      const inputs = await page.$$('input:not([type="submit"]):not([type="button"])');
      if (inputs.length > 0) {
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        const testData = ['test', '12345', 'chaos@test.com', '<script>alert("xss")</script>', '../../../../etc/passwd'];
        const data = testData[Math.floor(Math.random() * testData.length)];
        
        broadcast({
          type: 'browser_event',
          action: 'fill',
          target: `input with "${data}"`
        });
        
        await randomInput.fill(data);
        updateStability(1, 'Input fill successful');
        return true;
      }
      return false;
    }
  },
  {
    name: 'triggerError404',
    weight: 10,
    async execute(page) {
      const badPath = '/nonexistent-' + Math.random().toString(36);
      
      broadcast({
        type: 'browser_event',
        action: 'navigate_invalid',
        target: badPath,
        success: false
      });
      
      await page.goto(TARGET_URL + badPath, { waitUntil: 'domcontentloaded' }).catch(() => {});
      updateStability(-5, '404 triggered');
      
      // Take screenshot
      const screenshotName = `error-404-${Date.now()}.png`;
      await page.screenshot({ path: join(SCREENSHOT_DIR, screenshotName) });
      broadcast({
        type: 'screenshot',
        filename: screenshotName,
        url: `http://localhost:8080/screenshots/${screenshotName}`,
        description: '404 Error Page'
      });
      
      return true;
    }
  },
  {
    name: 'rapidClicks',
    weight: 10,
    async execute(page) {
      broadcast({
        type: 'browser_event',
        action: 'rapid_clicks',
        target: 'multiple elements'
      });
      
      const buttons = await page.$$('button, a');
      const clickCount = Math.min(buttons.length, 5);
      
      for (let i = 0; i < clickCount; i++) {
        await buttons[i].click().catch(() => {});
        await page.waitForTimeout(100);
      }
      
      updateStability(-2, 'Rapid click stress test');
      return true;
    }
  },
  {
    name: 'consoleErrorDetection',
    weight: 15,
    async execute(page) {
      const errors = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.reload();
      await page.waitForTimeout(2000);
      
      if (errors.length > 0) {
        broadcast({
          type: 'browser_event',
          action: 'console_error',
          target: `${errors.length} errors detected`,
          success: false,
          error: errors[0]
        });
        
        updateStability(-10, `Console errors: ${errors.length}`);
        
        // Take screenshot
        const screenshotName = `console-error-${Date.now()}.png`;
        await page.screenshot({ path: join(SCREENSHOT_DIR, screenshotName), fullPage: true });
        broadcast({
          type: 'screenshot',
          filename: screenshotName,
          url: `http://localhost:8080/screenshots/${screenshotName}`,
          description: `Console Errors (${errors.length})`
        });
      } else {
        updateStability(2, 'No console errors');
      }
      
      return true;
    }
  }
];

/**
 * Pick weighted random action
 */
function getRandomAction() {
  const totalWeight = chaosActions.reduce((sum, action) => sum + action.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const action of chaosActions) {
    random -= action.weight;
    if (random <= 0) {
      return action;
    }
  }
  
  return chaosActions[0];
}

/**
 * Main chaos testing loop
 */
async function runChaosTests() {
  console.log('\n🔥 CHAOS RUNNER STARTING 🔥\n');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Duration: ${CHAOS_DURATION}ms`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`Videos: ${VIDEO_DIR}\n`);
  
  // Ensure directories exist
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  await fs.mkdir(VIDEO_DIR, { recursive: true });
  
  // Connect to backend
  await connectToBackend();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Launch browser
  const browser = await chromium.launch({
    headless: false // Set to true for production
  });
  
  const context = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  broadcast({
    type: 'log',
    message: `Browser launched, navigating to ${TARGET_URL}`,
    level: 'info'
  });
  
  // Initial page load
  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
    broadcast({
      type: 'log',
      message: 'Page loaded successfully',
      level: 'success'
    });
    
    // Take initial screenshot
    const initialScreenshot = `initial-${Date.now()}.png`;
    await page.screenshot({ path: join(SCREENSHOT_DIR, initialScreenshot) });
    broadcast({
      type: 'screenshot',
      filename: initialScreenshot,
      url: `http://localhost:8080/screenshots/${initialScreenshot}`,
      description: 'Initial page load'
    });
  } catch (error) {
    broadcast({
      type: 'log',
      message: `Failed to load ${TARGET_URL}: ${error.message}`,
      level: 'error'
    });
    
    updateStability(-20, 'Page load failed');
    await browser.close();
    return;
  }
  
  // Run chaos actions for specified duration
  const startTime = Date.now();
  
  while (Date.now() - startTime < CHAOS_DURATION) {
    try {
      const action = getRandomAction();
      console.log(`\n[${++eventCount}] Executing: ${action.name}`);
      
      const success = await action.execute(page);
      
      if (!success) {
        console.log(`   ⚠️  Action ${action.name} skipped (no targets)`);
      }
      
      // Random delay between actions
      const delay = Math.random() * 2000 + 500; // 500-2500ms
      await page.waitForTimeout(delay);
      
    } catch (error) {
      console.error(`   ❌ Error during ${action?.name}:`, error.message);
      
      broadcast({
        type: 'browser_event',
        action: 'error',
        target: action?.name || 'unknown',
        success: false,
        error: error.message
      });
      
      updateStability(-5, `Action failed: ${error.message}`);
      
      // Take error screenshot
      const errorScreenshot = `error-${Date.now()}.png`;
      await page.screenshot({ path: join(SCREENSHOT_DIR, errorScreenshot) }).catch(() => {});
      broadcast({
        type: 'screenshot',
        filename: errorScreenshot,
        url: `http://localhost:8080/screenshots/${errorScreenshot}`,
        description: `Error: ${error.message}`
      });
    }
  }
  
  // Cleanup
  console.log('\n🏁 Chaos testing complete!\n');
  
  // Final screenshot
  const finalScreenshot = `final-${Date.now()}.png`;
  await page.screenshot({ path: join(SCREENSHOT_DIR, finalScreenshot), fullPage: true });
  broadcast({
    type: 'screenshot',
    filename: finalScreenshot,
    url: `http://localhost:8080/screenshots/${finalScreenshot}`,
    description: 'Final state'
  });
  
  // Close browser (this saves the video)
  await context.close();
  await browser.close();
  
  // Get video filename
  const videoFiles = await fs.readdir(VIDEO_DIR);
  const latestVideo = videoFiles.filter(f => f.endsWith('.webm')).sort().pop();
  
  if (latestVideo) {
    broadcast({
      type: 'video',
      filename: latestVideo,
      url: `http://localhost:8080/videos/${latestVideo}`,
      description: 'Full chaos test recording'
    });
  }
  
  // Send final summary
  broadcast({
    type: 'test_complete',
    summary: {
      finalStability: stability,
      eventsExecuted: eventCount,
      duration: CHAOS_DURATION,
      screenshotCount: (await fs.readdir(SCREENSHOT_DIR)).length,
      videoRecorded: !!latestVideo
    }
  });
  
  console.log(`Final Stability Score: ${stability}/100`);
  console.log(`Events Executed: ${eventCount}`);
  console.log(`Screenshots: ${(await fs.readdir(SCREENSHOT_DIR)).length}`);
  
  // Close WebSocket
  if (ws) {
    ws.close();
  }
  
  process.exit(0);
}

// Run chaos tests
runChaosTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

