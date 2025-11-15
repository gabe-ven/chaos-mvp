import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runChaosTests } from './chaosTests.js';
import { buildReport } from './reportBuilder.js';
import { analyzeResults } from './aiAnalyzer.js';
import { 
  initSentry, 
  captureException, 
  addBreadcrumb,
  sentryErrorHandler,
  sentryRequestHandler 
} from './sentry.js';

dotenv.config();

// Initialize Sentry (async)
await initSentry();

const app = express();
const PORT = process.env.PORT || 3001;

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

    console.log(`Running chaos tests for: ${url}`);
    addBreadcrumb(`Starting chaos test for ${url}`, 'chaos-test');

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

app.listen(PORT, () => {
  console.log(`🚀 AI Chaos Engineer backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;



