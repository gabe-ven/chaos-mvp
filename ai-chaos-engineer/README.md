# Site Reliability Monitor

Real-time external health and performance testing for any website. Get a comprehensive stability report in 90 seconds with **AI-powered browser automation**.

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
