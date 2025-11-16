Strux – Site Reliability Checks with Sentry‑Deep Visibility
===========================================================

Strux is a small site reliability checker built for this hackathon.  
You paste in a URL, Strux runs a focused set of HTTP health checks, streams the progress in a clean UI, and ties every run into Sentry as a first‑class trace.

## Features

- **URL health checks**  
  Seven real HTTP tests against a live URL:
  - Response Time  
  - Concurrent Load  
  - Performance Consistency  
  - Heavy Load Stress  
  - Rate Limiting  
  - Error Handling  
  - Endpoint Resilience  

- **Live dashboard**  
  - Shows elapsed time and how many tests have completed.  
  - Each test card transitions from “Waiting” → “Running” → “Complete”.  
  - Cards display what each test is doing in plain language (e.g. “Sending 10 concurrent HEAD requests…”).

- **Report view**  
  - Stability score out of 100 with a short summary.  
  - Stats: tests passed, issues found, total duration, total tests.  
  - Detailed list of each test with message, duration, and pass/fail.  
  - Raw JSON payload for debugging and integration.  
  - A **Run ID** that matches the Sentry trace for this run.

- **Sentry integration (backend)**  
  - Each `/run` call starts a Sentry **transaction** (`Strux /run`) with tags:
    - `url` – target URL  
    - `mode` – currently `url` (room for `sandbox` later)  
    - `run_id` – unique ID also shown in the Strux UI  
  - Each health check runs as a **child span** (`op: strux.test`, `description: test name`) with:
    - status (`ok` or `error`)  
    - duration and basic data (e.g. URL)  
  - Errors inside tests are captured with `captureException`, tagged with the test name and URL.  
  - On completion, Strux sends a summary `captureMessage("Strux run complete")` with:
    - score, status, passed/failed counts, and `runId`.  

This makes Sentry the observability backbone of Strux: every run is a trace, every test is a span, and the UI links back via Run ID.

## Tech Stack

- **Backend**: Node.js, Express, ws (WebSockets), native `fetch`, `@sentry/node`.  
- **Frontend**: React, Vite, Tailwind CSS.  
- **Error monitoring**: Sentry (backend only; frontend Sentry is currently disabled).  
- **Experimental**: A separate FastAPI + Browser Use service for headless UI checks (not in the main flow right now).

## Getting Started

### 1. Backend

```bash
cd ai-chaos-engineer/backend
npm install
```

Create a `.env` file:

```env
PORT=3001
SENTRY_DSN=your_backend_sentry_dsn_here   # optional but recommended
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

The backend will start on `http://localhost:3001` and expose:
- `POST /run` – run all health checks for a given URL.  
- `GET /health` – simple API health check.  
- `ws://localhost:3001/ws` – WebSocket stream used by the frontend.

### 2. Frontend

```bash
cd ai-chaos-engineer/frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

Open the UI at the URL printed by Vite (usually `http://localhost:5173`).

## How to Use

1. Start backend and frontend as described above.  
2. Open the Strux UI in the browser.  
3. Paste any reachable URL (e.g. `https://example.com`).  
4. Click **Start test**.  
5. Watch the live dashboard as tests run.  
6. When complete, browse the report:
   - Score and summary at the top  
   - Test breakdown  
   - Run ID under the score  
   - Raw JSON at the bottom  

To investigate further in Sentry:
1. Copy the Run ID from the report.  
2. In Sentry, search by `run_id:<that id>`.  
3. Open the matching transaction to see per‑test spans and any linked errors.  

## Notes

- If `SENTRY_DSN` is not set, Strux still runs; Sentry helpers fall back to console logging.  
- The Browser Use service is intentionally decoupled and currently not part of the default run path, keeping Strux focused on HTTP‑level reliability checks.  

## What’s Next

- Add a “sandbox mode” that uses Daytona to run the same checks against repositories in isolated sandboxes.  
- Tighten Sentry dashboards around `run_id` to visualize reliability trends over time.  
- Explore CodeRabbit integration for automatic review of test logic and resilience changes.  

# Site Reliability Monitor

Real-time external health and performance testing for any website, with a comprehensive stability report and **AI-powered browser automation**.

## What It Does

Runs 8 real-time tests on any website:
- Response Time
- Concurrent Load  
- **UI Health Check (AI-Powered with Browser Use)** ✨
- Performance Consistency
- Heavy Load Stress
- Rate Limiting
- Error Handling
- Endpoint Resilience

All tests make actual HTTP requests to your target site. UI checks use [Browser Use](https://github.com/browser-use/browser-use) for AI-powered browser automation with real-time streaming.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+ (for AI browser automation)
- npm & pip

### Setup

**1. Install Node.js dependencies:**
```bash
cd ai-chaos-engineer
npm install
```

**2. Setup Browser Use Service (AI-powered):**
```bash
cd browser-use-service
./setup.sh
```

**3. Configure environment:**
```bash
# Backend
cd backend
cp .env.example .env
# Add your API keys:
# - ANTHROPIC_API_KEY or OPENAI_API_KEY (for AI analysis)
# - BROWSER_USE_API_KEY (get $10 free at browser-use.com)
# - SENTRY_DSN (optional)

# Frontend
cd ../frontend
cp .env.example .env

# Browser Use Service
cd ../browser-use-service
# Edit .env and add BROWSER_USE_API_KEY
```

**4. Run all services:**

```bash
# Terminal 1 - Browser Use Service (Python)
cd browser-use-service
source venv/bin/activate
python browser_service.py

# Terminal 2 - Backend (Node.js)
cd backend
npm run dev

# Terminal 3 - Frontend (React)
cd frontend
npm run dev
```

**5. Open:** http://localhost:5173

## Features

### 🤖 AI-Powered Browser Automation
Uses [Browser Use](https://github.com/browser-use/browser-use) to intelligently check websites:
- Automated navigation and interaction
- Real-time streaming of browser actions
- AI-driven issue detection
- Live or headless mode

### 📡 Real-Time Updates
- WebSocket streaming of all test progress
- Live browser action feed
- AI analysis progress tracking
- Instant results

### 🎨 Minimal Black UI
- ChatGPT/Vercel-inspired design
- Pure black background (#000)
- Clean, professional interface
- Real-time progress visualization

## Architecture

```
┌─────────────┐
│   Frontend  │ (React, Tailwind, WebSocket)
│   :5173     │
└──────┬──────┘
       │
       ├─────WebSocket────┐
       │                  │
┌──────▼──────┐    ┌──────▼──────────┐
│   Backend   │───▶│  Browser Use    │
│   :3001     │    │  Service :3002  │
└─────────────┘    └─────────────────┘
   (Node.js)         (Python + AI)
```

## Environment Variables

### Backend (.env)
```env
# AI Analysis (choose one)
ANTHROPIC_API_KEY=your-key
OPENAI_API_KEY=your-key

# Optional
SENTRY_DSN=your-sentry-dsn
PORT=3001
BROWSER_USE_SERVICE_URL=http://localhost:3002
```

### Browser Use Service (.env)
```env
# Get $10 free at browser-use.com
BROWSER_USE_API_KEY=your-key

# Or use your own LLM
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key

PORT=3002
BROWSER_LIVE=true  # Set to false for headless
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001/ws
```

## Tech Stack

- **Backend:** Node.js, Express, Puppeteer
- **Frontend:** React, Tailwind CSS, Vite
- **AI Browser:** Python, Browser Use, FastAPI
- **Real-Time:** WebSockets
- **AI:** Anthropic Claude / OpenAI GPT
- **Error Tracking:** Sentry

## What It Actually Tests

This is an **external monitoring tool** that tests websites from the outside:
- ✅ Availability and response times
- ✅ Basic load handling
- ✅ **AI-powered UI health via Browser Use**
- ✅ Error page responses
- ✅ Rate limiting detection
- ✅ Real-time action streaming

**Not included:**
- ❌ Server-side metrics (CPU, memory)
- ❌ Infrastructure-level chaos (process killing, network faults)
- ❌ Large-scale load testing

Perfect for small-medium websites, development testing, and basic monitoring.

## License

MIT
