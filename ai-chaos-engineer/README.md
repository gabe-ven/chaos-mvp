# Site Reliability Monitor

Real-time external health and performance testing for any website. Get a comprehensive stability report in 90 seconds.

## What It Does

Runs 8 real-time tests on any website:
- Response Time
- Concurrent Load  
- UI Health Check
- Performance Consistency
- Heavy Load Stress
- Rate Limiting
- Error Handling
- Endpoint Resilience

All tests make actual HTTP requests to your target site. Results are analyzed by AI for actionable recommendations.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup

1. **Clone and install:**
```bash
cd ai-chaos-engineer
npm install
```

2. **Configure environment:**
```bash
# Backend
cd backend
cp .env.example .env
# Add your API keys:
# - ANTHROPIC_API_KEY or OPENAI_API_KEY (for AI analysis)
# - SENTRY_DSN (optional, for error tracking)

# Frontend
cd ../frontend
cp .env.example .env
```

3. **Run:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

4. **Open:** http://localhost:5173

## Environment Variables

### Backend (.env)
```env
# Required for AI recommendations (choose one)
ANTHROPIC_API_KEY=your-key-here
# OR
OPENAI_API_KEY=your-key-here

# Optional
SENTRY_DSN=your-sentry-dsn
PORT=3001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001/ws
```

## How It Works

1. Enter any website URL
2. Watch live test execution in real-time
3. Get instant stability score (0-100)
4. Review AI-powered recommendations
5. Export detailed JSON report

## Tech Stack

- **Backend:** Node.js, Express, Puppeteer
- **Frontend:** React, Tailwind CSS, Vite
- **Real-Time:** WebSockets
- **AI:** Anthropic Claude / OpenAI GPT

## What It Actually Tests

This is an **external monitoring tool** that tests websites from the outside:
- ✅ Availability and response times
- ✅ Basic load handling
- ✅ UI health via browser automation
- ✅ Error page responses
- ✅ Rate limiting detection

**Not included:**
- ❌ Server-side metrics (CPU, memory)
- ❌ Infrastructure-level chaos (process killing, network faults)
- ❌ Large-scale load testing

Perfect for small-medium websites, development testing, and basic monitoring.

## License

MIT
