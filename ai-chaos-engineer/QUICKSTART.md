# 🚀 AI Chaos Engineer - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn

---

## 🏃 Quick Start (2 Minutes)

### 1. Install Dependencies

```bash
# Backend
cd ai-chaos-engineer/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set Up Environment Variables

Copy the example `.env` file and configure your API keys:

```bash
cd ai-chaos-engineer/backend
cp .env.example .env
```

Edit `.env` and add your keys:

```bash
# Required for AI analysis
ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional (for production features)
DAYTONA_API_URL=https://api.daytona.io
DAYTONA_API_KEY=your_daytona_key
SENTRY_DSN=your_sentry_dsn
```

> **Note**: The app works without optional keys—it will use stub implementations.

### 3. Run the Application

```bash
# Terminal 1: Backend (port 3001)
cd ai-chaos-engineer/backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd ai-chaos-engineer/frontend
npm run dev
```

### 4. Open in Browser

- **Main Dashboard**: http://localhost:5173
- **Live Dashboard**: http://localhost:5173/live

---

## 🎯 Usage

1. Open the **Main Dashboard**
2. Enter a URL or GitHub repo URL
3. Click **"Run Chaos Test"**
4. Click **"Live Dashboard"** to watch real-time events
5. View the test results and AI analysis

---

## 🧪 Running Tests

```bash
cd ai-chaos-engineer/backend
npm test
```

---

## 📡 Real-Time Monitoring

The live dashboard shows:

- ✅ Real-time event stream
- 📊 Dynamic stability score
- 🌐 Browser automation events
- ⚡ Test progress
- ❌ Errors and failures

---

---

## 📚 Documentation

- **[REALTIME_FEATURES.md](./REALTIME_FEATURES.md)** - Real-time monitoring details
- **[README.md](./README.md)** - Full project documentation

---

## 🎉 You're Ready!

Start chaos testing and watch your system's resilience in action! 🔥
