# 🔥 Chaos MVP - AI Chaos Engineer

A hackathon-ready chaos engineering platform with AI analysis, Sentry error tracking, and a beautiful React UI.

> **👉 First time here? Start with [START_HERE.md](./START_HERE.md)**

## 🚀 Quick Start

```bash
# Install dependencies
cd ai-chaos-engineer/backend && npm install
cd ../frontend && npm install

# Run backend (Terminal 1)
cd backend && npm run dev

# Run frontend (Terminal 2)
cd frontend && npm run dev
```

Open **http://localhost:5173** and start testing!

## 📚 Documentation

- **[Comprehensive Guide](./HACKATHON_README.md)** - Full documentation
- **[Quick Start](./ai-chaos-engineer/QUICKSTART.md)** - 2-minute setup
- **[Backend README](./ai-chaos-engineer/backend/README.md)** - API docs
- **[Frontend README](./ai-chaos-engineer/frontend/README.md)** - UI docs
- **[Main README](./ai-chaos-engineer/README.md)** - Feature overview

## ✨ Features

- ✅ **3 Chaos Tests**: Latency, Load Spike, UI Check
- ✅ **AI Analysis**: OpenAI/Claude integration with fallback
- ✅ **Sentry Integration**: Error tracking & monitoring
- ✅ **Beautiful UI**: React + Tailwind with color-coded scores
- ✅ **Smart Recommendations**: Actionable improvement steps
- ✅ **Zero Config**: Works without API keys
- ✅ **Jest Tests**: Comprehensive test coverage

## 🎯 Tech Stack

**Backend**: Node.js, Express, OpenAI/Claude API, Sentry  
**Frontend**: React 18, Vite, Tailwind CSS  
**Testing**: Jest  

## 📦 What's Included

```
chaos-mvp/
├── ai-chaos-engineer/          # Main application
│   ├── backend/                # Express API
│   │   ├── src/
│   │   │   ├── index.js        # Server + routes
│   │   │   ├── chaosTests.js   # Test implementations
│   │   │   ├── aiAnalyzer.js   # LLM analysis ✨ NEW
│   │   │   ├── sentry.js       # Error tracking ✨ NEW
│   │   │   ├── reportBuilder.js
│   │   │   └── daytonaClient.js
│   │   └── .env.example        # ✨ Updated with AI keys
│   └── frontend/               # React UI
│       └── src/
│           ├── components/
│           │   ├── RunForm.jsx
│           │   └── ReportView.jsx  # ✨ Updated with AI display
│           └── App.jsx
├── HACKATHON_README.md         # ✨ Complete guide
└── README.md                   # This file
```

## 🔧 Optional: Add API Keys

Create `ai-chaos-engineer/backend/.env`:

```env
# AI Analysis (optional - works with fallback)
OPENAI_API_KEY=sk-your-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Error Tracking (optional)
SENTRY_DSN=https://...@sentry.io/...
```

## 🧪 Run Tests

```bash
cd ai-chaos-engineer/backend
npm test
```

## 📊 API Example

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/vercel/next.js"}'
```

**Response includes**:
- Stability score (0-100)
- AI-generated summary
- Actionable recommendations
- Detailed test results

## 🎉 Ready to Demo!

Built with ❤️ for hackathons. MIT License.
