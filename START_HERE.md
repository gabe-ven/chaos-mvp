# 🎯 START HERE - AI Chaos Engineer

Welcome! This is your **complete hackathon MVP** for chaos engineering with AI analysis.

---

## ⚡ Quick Start (Choose Your Speed)

### 🏃 Fast Track (2 minutes)
```bash
# 1. Install
cd ai-chaos-engineer/backend && npm install
cd ../frontend && npm install

# 2. Run (2 terminals)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 3. Open browser
# http://localhost:5173
```

### 🚶 Guided Setup (5 minutes)
See **[QUICKSTART.md](./ai-chaos-engineer/QUICKSTART.md)** for step-by-step instructions.

### 📚 Complete Guide (Full Documentation)
See **[HACKATHON_README.md](./HACKATHON_README.md)** for everything.

---

## 🎯 What You Have

A **production-ready chaos engineering platform** that:

✅ **Works immediately** - No API keys required  
✅ **AI-powered** - OpenAI or Claude analysis  
✅ **Beautiful UI** - React + Tailwind  
✅ **Error tracking** - Sentry integration  
✅ **Well-tested** - 22+ Jest tests  
✅ **Documented** - 5 comprehensive guides  

---

## 📂 Project Structure

```
chaos-mvp/
├── START_HERE.md              ← You are here
├── HACKATHON_README.md        ← Full documentation
├── verify-setup.sh            ← Setup checker
│
└── ai-chaos-engineer/
    ├── QUICKSTART.md          ← 2-minute guide
    ├── TEST_CHECKLIST.md      ← Demo prep
    ├── SUMMARY.md             ← Implementation details
    │
    ├── backend/               ← Express API
    │   ├── src/
    │   │   ├── index.js       ── Server + routes
    │   │   ├── aiAnalyzer.js  ── 🤖 AI analysis
    │   │   ├── sentry.js      ── 📊 Error tracking
    │   │   ├── chaosTests.js  ── 🔥 Test logic
    │   │   ├── reportBuilder.js ─ Scoring
    │   │   └── daytonaClient.js ─ Workspace mgmt
    │   ├── tests/             ── 22+ Jest tests
    │   └── .env.example       ── Config template
    │
    └── frontend/              ← React UI
        ├── src/
        │   ├── App.jsx
        │   ├── components/
        │   │   ├── RunForm.jsx
        │   │   └── ReportView.jsx ── 🎨 Results display
        │   └── lib/
        │       └── api.js
        └── package.json
```

---

## 🔧 Optional: Add AI Analysis

For **AI-powered insights**, add to `backend/.env`:

```env
# Option 1: OpenAI (recommended)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini

# Option 2: Claude (alternative)
ANTHROPIC_API_KEY=sk-ant-your-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Option 3: Sentry (error tracking)
SENTRY_DSN=https://...@sentry.io/...
```

**Without API keys**: Uses intelligent fallback logic ✨

---

## 🧪 Verify Setup

Run the verification script:

```bash
./verify-setup.sh
```

This checks:
- ✓ Node.js & npm installed
- ✓ Dependencies installed
- ✓ All files present
- ✓ Ports available
- ✓ Configuration

---

## 🎬 Demo It

1. **Start servers** (see Quick Start above)
2. **Open** http://localhost:5173
3. **Enter URL**: `https://github.com/vercel/next.js`
4. **Click** "Run Chaos Test"
5. **Watch** the results appear with:
   - Color-coded stability score
   - AI analysis (if configured)
   - Actionable recommendations
   - Detailed test results

**Demo time**: 5-8 minutes  
**Demo script**: See `TEST_CHECKLIST.md`

---

## 🧪 Run Tests

```bash
cd ai-chaos-engineer/backend
npm test
```

Expected: **All tests pass** ✅

---

## 📊 API Testing

```bash
# Health check
curl http://localhost:3001/health

# Run chaos test
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## 📚 Documentation Map

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| **START_HERE.md** *(this file)* | Quick orientation | 2 min |
| **[QUICKSTART.md](./ai-chaos-engineer/QUICKSTART.md)** | Fast setup | 2 min |
| **[HACKATHON_README.md](./HACKATHON_README.md)** | Complete guide | 15 min |
| **[TEST_CHECKLIST.md](./ai-chaos-engineer/TEST_CHECKLIST.md)** | Demo prep | 10 min |
| **[SUMMARY.md](./ai-chaos-engineer/SUMMARY.md)** | What was built | 5 min |

---

## 🎯 Key Features

### 1. **Chaos Tests**
- **Latency Injection** - Network delay simulation
- **Load Spike** - Concurrent request testing
- **UI Check** - Accessibility & responsiveness

### 2. **AI Analysis**
- **OpenAI GPT-4o-mini** - Fast & cheap
- **Anthropic Claude** - Alternative option
- **Smart Fallback** - Works without keys

### 3. **Error Tracking**
- **Sentry Integration** - Production-ready
- **Breadcrumb Tracking** - Debug context
- **Graceful Degradation** - Works without DSN

### 4. **Beautiful UI**
- **React 18** - Modern framework
- **Tailwind CSS** - Beautiful styling
- **Responsive** - Works on all screens
- **Dark Theme** - Easy on the eyes

---

## 🚀 Tech Stack

**Backend**
- Node.js + Express
- OpenAI API / Claude API
- Sentry
- Jest (testing)

**Frontend**
- React 18
- Vite (fast builds)
- Tailwind CSS
- Modern JavaScript

**DevOps**
- Environment-based config
- Health checks
- Error tracking
- Comprehensive tests

---

## 🎉 What Makes This Special

1. **Zero Configuration** - Works out of the box
2. **Dual LLM Support** - OpenAI or Claude
3. **Smart Fallbacks** - Never fails due to missing keys
4. **Production Ready** - Sentry, tests, docs
5. **Hackathon Optimized** - Fast setup, beautiful demo

---

## 🐛 Troubleshooting

### Ports in use?
```bash
lsof -ti:3001 | xargs kill  # Backend
lsof -ti:5173 | xargs kill  # Frontend
```

### Dependencies missing?
```bash
cd ai-chaos-engineer/backend && npm install
cd ../frontend && npm install
```

### API not responding?
- Check backend is running on port 3001
- Check `http://localhost:3001/health`

### More issues?
See **[HACKATHON_README.md](./HACKATHON_README.md)** Troubleshooting section

---

## 🏆 Ready to Win

You have:
- ✅ Complete working application
- ✅ AI integration (2 providers)
- ✅ Error tracking
- ✅ Beautiful UI
- ✅ 22+ passing tests
- ✅ 5 comprehensive docs
- ✅ Production-ready code

---

## 📞 Next Steps

1. ✅ Read this file (done!)
2. 🚀 Run the app (see Quick Start)
3. 🧪 Test it (run `npm test`)
4. 📝 Review `TEST_CHECKLIST.md` for demo
5. 🎬 Practice your demo
6. 🏆 Win the hackathon!

---

## 💡 Tips for Your Demo

**Opening** (30s):
> "We built an AI-powered chaos engineering platform that tests application resilience and provides actionable recommendations using OpenAI or Claude."

**Live Demo** (2 min):
- Show the beautiful UI
- Run a test
- Highlight AI analysis
- Show recommendations

**Code Walkthrough** (2 min):
- Show `aiAnalyzer.js` - dual LLM support
- Show `chaosTests.js` - test logic
- Show fallback logic

**Technical Depth** (1 min):
- Mention Sentry integration
- Mention comprehensive testing
- Mention production-ready features

**Q&A** (Variable)

---

## 🎯 Remember

This isn't just a hackathon project - it's:
- **Actually functional** - End-to-end working
- **Well-architected** - Clean, modular code
- **Production-ready** - Error handling, testing, monitoring
- **Thoroughly documented** - 5 comprehensive guides
- **Demo-ready** - Beautiful UI, smooth flow

---

**Let's go win this! 🚀**

Questions? Check the docs:
- [HACKATHON_README.md](./HACKATHON_README.md) - Everything
- [TEST_CHECKLIST.md](./ai-chaos-engineer/TEST_CHECKLIST.md) - Demo prep
- [SUMMARY.md](./ai-chaos-engineer/SUMMARY.md) - Implementation details

