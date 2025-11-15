import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runChaosTests } from './chaosTests.js';
import { buildReport } from './reportBuilder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

    // Run all chaos tests
    const testResults = await runChaosTests(url);

    // Build the final report with score
    const report = buildReport(testResults);

    res.json(report);
  } catch (error) {
    console.error('Error running chaos tests:', error);
    res.status(500).json({
      error: 'Failed to run chaos tests',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI Chaos Engineer backend running on http://localhost:${PORT}`);
});

export default app;



