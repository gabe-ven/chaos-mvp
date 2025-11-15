import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { runChaosTests } from './chaosTests.js';
import { buildReport } from './reportBuilder.js';
import { analyzeResults } from './llmClient.js';
import { 
  initSentry, 
  captureException, 
  addBreadcrumb,
  sentryErrorHandler,
  sentryRequestHandler 
} from './sentryClient.js';
import { initWebSocket, notifyTestStart, notifyTestComplete } from './websocket.js';

dotenv.config();

// Initialize Sentry (async)
await initSentry();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket for live streaming
initWebSocket(server);

app.use(cors());
app.use(express.json());
app.use(sentryRequestHandler());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Chaos Engineer API is running' });
});

// Main chaos test endpoint
app.post('/run', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL or repository is required' });
    }

    // Validate URL format
    const trimmedUrl = url.trim();
    const urlPattern = /^https?:\/\/.+\..+/;
    const isValidUrl = urlPattern.test(trimmedUrl);
    
    if (!isValidUrl) {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: 'Please provide a valid URL starting with http:// or https:// (e.g., https://example.com or https://github.com/user/repo)'
      });
    }

    // Verify URL is reachable (lenient check)
    console.log(`Verifying URL accessibility: ${url}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      let response;
      
      // Try HEAD first (faster)
      try {
        response = await fetch(trimmedUrl, {
          method: 'HEAD',
          signal: controller.signal,
          redirect: 'follow'
        });
      } catch (headError) {
        // Some sites block HEAD, try GET instead
        console.log('[Verify] HEAD failed, trying GET...');
        response = await fetch(trimmedUrl, {
          method: 'GET',
          signal: controller.signal,
          redirect: 'follow'
        });
      }
      
      clearTimeout(timeoutId);
      
      // Be lenient - only reject if it's clearly broken (404, 500, etc)
      if (!response.ok && (response.status === 404 || response.status >= 500)) {
        return res.status(400).json({
          error: 'URL not accessible',
          message: `The URL "${trimmedUrl}" returned ${response.status}. Please verify the URL is correct and accessible.`
        });
      }
      
      console.log(`✓ URL accessible (status: ${response.status})`);
    } catch (fetchError) {
      console.error('URL verification failed:', fetchError.message);
      
      // Only reject for clear connection errors, not timeouts
      if (fetchError.name === 'AbortError') {
        console.log('⚠️  URL verification timeout, proceeding anyway...');
      } else if (fetchError.message.includes('ENOTFOUND') || fetchError.message.includes('ECONNREFUSED')) {
        return res.status(400).json({
          error: 'URL not reachable',
          message: `Cannot reach "${trimmedUrl}". Please check:\n• The URL is spelled correctly\n• The website is online\n• You have internet connectivity`
        });
      } else {
        // For other errors (SSL, CORS, etc), proceed with warning
        console.log(`⚠️  URL verification inconclusive: ${fetchError.message}, proceeding anyway...`);
      }
    }

    console.log(`✓ URL verified, running chaos tests for: ${url}`);
    addBreadcrumb(`Starting chaos test for ${url}`, 'chaos-test');

    // Notify clients that tests are starting
    notifyTestStart(url);

    // Run all chaos tests
    const testResults = await runChaosTests(url);

    // Get AI analysis
    let aiAnalysis = null;
    try {
      addBreadcrumb('Running AI analysis', 'ai');
      aiAnalysis = await analyzeResults(testResults);
    } catch (aiError) {
      console.error('AI analysis failed, continuing without it:', aiError.message);
      captureException(aiError, { context: 'AI Analysis' });
    }

    // Build the final report with score
    const report = buildReport(testResults, aiAnalysis);

    addBreadcrumb('Chaos test completed successfully', 'chaos-test', { score: report.score });
    
    // Notify clients that tests are complete
    notifyTestComplete(report);
    
    res.json(report);
  } catch (error) {
    console.error('Error running chaos tests:', error);
    captureException(error, { url: req.body.url });
    res.status(500).json({
      error: 'Failed to run chaos tests',
      message: error.message
    });
  }
});

// Sentry error handler (must be before other error handlers)
app.use(sentryErrorHandler());

server.listen(PORT, () => {
  console.log(`🚀 AI Chaos Engineer backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔴 WebSocket live stream: ws://localhost:${PORT}/ws`);
});

export default app;



