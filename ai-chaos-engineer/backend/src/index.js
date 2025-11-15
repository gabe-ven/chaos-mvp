import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import crypto from 'crypto';
import { runChaosTests } from './chaosTests.js';
import { buildReport } from './reportBuilder.js';
import { analyzeResults } from './llmClient.js';
import { 
  initSentry, 
  captureException, 
  captureMessage,
  addBreadcrumb,
  sentryErrorHandler,
  sentryRequestHandler,
  startTransaction,
  finishTransaction
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
  let transaction = null;
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

    // Generate a stable run ID to tie UI and Sentry together
    const runId = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    addBreadcrumb(`Starting chaos test for ${url}`, 'chaos-test', { runId });

    // Start Sentry transaction for this run
    transaction = startTransaction('Strux /run', { 
      url: trimmedUrl,
      mode: 'url',
      run_id: runId
    }, { url: trimmedUrl, runId });

    // Notify clients that tests are starting
    notifyTestStart(url);

    // Run all chaos tests (URL-only health checks)
    const testResults = await runChaosTests(url, { transaction });

    // Get AI analysis with live updates
    const { notifyAIProgress } = await import('./websocket.js');
    let aiAnalysis = null;
    try {
      addBreadcrumb('Running AI analysis', 'ai');
      
      // Notify start of AI analysis
      notifyAIProgress('analyzing', 'Analyzing test results with AI...');
      
      aiAnalysis = await analyzeResults(testResults);
      
      // Notify completion
      notifyAIProgress('complete', 'AI analysis complete');
    } catch (aiError) {
      console.error('AI analysis failed, continuing without it:', aiError.message);
      captureException(aiError, { context: 'AI Analysis' });
      notifyAIProgress('error', 'AI analysis failed - continuing without recommendations');
    }

    // Build the final report with score (no Browser Use walkthrough)
    const report = buildReport(testResults, aiAnalysis, { runId });

    addBreadcrumb('Chaos test completed successfully', 'chaos-test', { score: report.score });

    // Record summary in Sentry as a message with tags
    captureMessage('Strux run complete', 'info', {
      url: trimmedUrl,
      score: report.score,
      status: report.status,
      passedTests: report.raw?.tests?.filter(t => t.passed).length || 0,
      failedTests: report.raw?.tests?.filter(t => !t.passed).length || 0,
      runId
    });

    // Finish transaction as success
    finishTransaction(transaction, 'ok');
    
    // Notify clients that tests are complete
    notifyTestComplete(report);
    
    res.json(report);
  } catch (error) {
    console.error('Error running chaos tests:', error);
    captureException(error, { url: req.body.url });

    // Mark transaction as failed, if it exists
    if (transaction) {
      finishTransaction(transaction, 'internal_error');
    }
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



