# 🔥 AI Chaos Engineer - Complete Hackathon MVP

A fully functional chaos engineering platform that tests application resilience using latency injection, load spikes, and UI validation, powered by AI analysis (OpenAI/Claude) and error tracking (Sentry).

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# 1. Navigate to project
cd ai-chaos-engineer

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Create .env file (optional - works without API keys)
cd ../backend
cp .env.example .env
```

### Run the App

**Terminal 1 - Backend:**
```bash
cd ai-chaos-engineer/backend
npm run dev
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd ai-chaos-engineer/frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

**That's it!** Open `http://localhost:5173` in your browser.

---

## 🎯 Features

### Core Functionality
- ✅ **Latency Injection Test** - Simulates network delays
- ✅ **Load Spike Test** - Tests concurrent request handling
- ✅ **UI Check** - Validates accessibility and responsiveness
- ✅ **Stability Score** - 0-100 score with color-coded badge
- ✅ **AI Analysis** - LLM-powered insights (OpenAI/Claude)
- ✅ **Actionable Recommendations** - Specific improvement suggestions
- ✅ **Sentry Integration** - Error tracking and monitoring
- ✅ **Daytona Workspace** - Stub implementation for MVP

### Tech Stack

**Backend**
- Node.js + Express
- Jest for testing
- OpenAI API / Anthropic Claude API
- Sentry for error tracking
- Daytona (stubbed)

**Frontend**
- React 18
- Vite (fast builds)
- Tailwind CSS (modern UI)

---

## 🔧 Configuration (All Optional)

Create `backend/.env` with API keys (all optional):

```env
# Server
PORT=3001
NODE_ENV=development

# AI Analysis (choose one or leave empty for fallback)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# OR use Claude
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Error Tracking
SENTRY_DSN=https://...@sentry.io/...

# Daytona (stubbed for MVP)
DAYTONA_API_KEY=your_key
DAYTONA_API_URL=https://api.daytona.io
```

**Without API keys**: The app uses intelligent fallback logic
- **No LLM key**: Rule-based analysis generates recommendations
- **No Sentry DSN**: Errors logged to console
- **No Daytona key**: Stub workspace simulation

---

## 📂 Project Structure

```
ai-chaos-engineer/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server + routes
│   │   ├── chaosTests.js     # Test implementations
│   │   ├── daytonaClient.js  # Workspace provisioning (stub)
│   │   ├── reportBuilder.js  # Score calculation
│   │   ├── aiAnalyzer.js     # LLM analysis (NEW)
│   │   ├── sentry.js         # Error tracking (NEW)
│   │   └── utils/
│   │       └── timers.js     # Utilities
│   ├── tests/
│   │   └── chaosTests.test.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main layout
    │   ├── components/
    │   │   ├── RunForm.jsx   # Test input form
    │   │   └── ReportView.jsx # Results display
    │   └── lib/
    │       └── api.js        # API client
    ├── package.json
    └── vite.config.js
```

---

## 🧪 API Documentation

### `POST /run`
Run chaos tests on a URL

**Request:**
```json
{
  "url": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "score": 85,
  "status": "Excellent",
  "summary": "3/3 tests passed. Stability score: 85/100",
  "aiSummary": "Your application demonstrates strong resilience...",
  "recommendations": [
    "Implement proper timeout handling...",
    "Add circuit breakers...",
    "Set up alerting..."
  ],
  "issues": [],
  "raw": {
    "workspaceUrl": "https://workspace-xyz.daytona.dev",
    "totalDuration": 1234,
    "tests": [...]
  }
}
```

### `GET /health`
Health check

**Response:**
```json
{
  "status": "ok",
  "message": "AI Chaos Engineer API is running"
}
```

---

## 🎨 UI Components

### Color-Coded Stability Score
- 🟢 **80-100**: Excellent (Green)
- 🟡 **60-79**: Good (Yellow)
- 🟠 **40-59**: Fair (Orange)
- 🔴 **0-39**: Poor (Red)

### Key Sections
1. **Score Badge** - Large, color-coded score display
2. **AI Analysis** - LLM-generated insights (purple gradient)
3. **Recommendations** - Actionable improvement steps
4. **Test Summary** - Pass/fail counts
5. **Issues** - Detailed failure information
6. **Test Results** - Individual test status
7. **Raw JSON** - Expandable raw data viewer

---

## 🧪 Testing

```bash
cd backend
npm test
```

Tests cover:
- Chaos test functions
- Report builder logic
- API endpoints

---

## 🚢 Deployment Tips

### Backend (Railway, Render, Fly.io)
```bash
# Set environment variables in dashboard
PORT=3001
OPENAI_API_KEY=sk-...
SENTRY_DSN=https://...

# Build command (if needed)
npm install

# Start command
npm start
```

### Frontend (Vercel, Netlify)
```bash
# Build command
npm run build

# Output directory
dist

# Environment variable
VITE_API_URL=https://your-backend.railway.app
```

Update `frontend/src/lib/api.js` if needed:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

---

## 🎯 AI Analysis Details

### How It Works
1. Tests run and collect metrics
2. Results sent to `aiAnalyzer.js`
3. LLM analyzes test data (OpenAI or Claude)
4. Returns: summary + recommendations
5. Fallback: Rule-based analysis if no API key

### LLM Prompts
The analyzer sends:
- Test pass/fail status
- Duration metrics
- Error messages
- Severity levels

And receives:
- Plain-language summary (2-3 sentences)
- 3-5 actionable recommendations

### Cost Optimization
- Uses `gpt-4o-mini` by default (~$0.0001/request)
- 500 token limit
- Fallback prevents failures

---

## 🔍 Sentry Integration

### Features
- **Automatic error capture** - Unhandled exceptions
- **Breadcrumbs** - Request tracking
- **Context** - URL, method, headers
- **Graceful degradation** - Works without DSN

### Usage in Code
```javascript
import { captureException, addBreadcrumb } from './sentry.js';

// Capture errors
try {
  // risky code
} catch (error) {
  captureException(error, { context: 'additional data' });
}

// Add breadcrumbs
addBreadcrumb('User action', 'user', { action: 'click' });
```

---

## 🚀 Advanced Features

### Custom Test Configuration
Edit `chaosTests.js` to adjust:
- Latency ranges
- Concurrent request counts
- UI check criteria

### Custom Scoring
Edit `reportBuilder.js` severity penalties:
```javascript
const severityPenalties = {
  low: 0,
  medium: 5,
  high: 10,
  critical: 20
};
```

### Real Daytona Integration
Replace stub in `daytonaClient.js`:
```javascript
const response = await fetch(`${process.env.DAYTONA_API_URL}/workspaces`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.DAYTONA_API_KEY}`
  },
  body: JSON.stringify({ url })
});
```

---

## 📊 Demo Script

1. **Start servers** (2 terminals)
2. **Open browser** → `http://localhost:5173`
3. **Enter URL**: `https://github.com/vercel/next.js`
4. **Click "Run Chaos Test"**
5. **Watch**: Loading animation → Score → AI Analysis → Recommendations
6. **Expand**: Raw JSON to show full data

### Key Talking Points
- "Runs 3 chaos tests in parallel"
- "AI analyzes results using OpenAI/Claude"
- "Generates actionable recommendations"
- "Works without API keys using fallback logic"
- "Sentry tracks errors in production"
- "Color-coded stability score"

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill

# Or change port in .env
PORT=3002
```

### AI analysis not working
- Check API key in `.env`
- Verify API key format (sk-... for OpenAI)
- Check console for fallback message
- System works with fallback analysis

### Tailwind styles not loading
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

---

## 📦 Dependencies

### Backend
- `express` - Web framework
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `jest` - Testing framework

### Frontend
- `react` + `react-dom` - UI library
- `vite` - Build tool
- `tailwindcss` - Styling
- `postcss` + `autoprefixer` - CSS processing

---

## 🏆 Hackathon Checklist

- ✅ **Working demo** - Full end-to-end functionality
- ✅ **Clean UI** - Modern, responsive design
- ✅ **AI integration** - OpenAI/Claude analysis
- ✅ **Error tracking** - Sentry integration
- ✅ **Testing** - Jest tests included
- ✅ **Documentation** - Comprehensive README
- ✅ **Easy setup** - 5-minute installation
- ✅ **Fallback logic** - Works without API keys
- ✅ **Production-ready** - Deployment instructions

---

## 📝 License

MIT - Built for hackathons

---

## 👥 Team & Credits

Built with ❤️ in 6 hours as a hackathon MVP

**Tech Used**: React, Express, OpenAI/Claude, Sentry, Tailwind CSS, Daytona

---

## 🎉 Next Steps

1. **Add real Daytona integration** - Replace stubs
2. **Database** - Store test history (PostgreSQL/MongoDB)
3. **Authentication** - User accounts
4. **CI/CD integration** - GitHub Actions workflow
5. **More tests** - CPU spike, memory leak, disk I/O
6. **Notifications** - Slack/email alerts
7. **Scheduled tests** - Cron jobs
8. **Multi-region** - Test from different locations

---

**Ready to demo!** 🚀

Run `npm run dev` in both directories and visit `http://localhost:5173`

