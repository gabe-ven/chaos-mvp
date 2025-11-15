# ✅ Testing Checklist - AI Chaos Engineer

Use this checklist to verify everything works before demoing.

## 🔧 Pre-Demo Setup

### 1. Dependencies Installed
```bash
# Backend
cd ai-chaos-engineer/backend
npm install
# Should see: added X packages

# Frontend
cd ../frontend
npm install
# Should see: added Y packages
```

### 2. Environment Setup (Optional)
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys (or leave empty for fallback)
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd ai-chaos-engineer/backend
npm run dev
# Should see: 
# 🚀 AI Chaos Engineer backend running on http://localhost:3001
# 📊 Health check: http://localhost:3001/health
# [Sentry] Stub initialized
```

**Terminal 2 - Frontend:**
```bash
cd ai-chaos-engineer/frontend
npm run dev
# Should see:
# VITE v5.x.x ready in Xms
# ➜ Local: http://localhost:5173/
```

---

## 🧪 Functional Tests

### Test 1: Health Check
```bash
curl http://localhost:3001/health
```
**Expected**: `{"status":"ok","message":"AI Chaos Engineer API is running"}`

### Test 2: API Endpoint
```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```
**Expected**: JSON with `score`, `status`, `summary`, `issues`, `raw`

### Test 3: Frontend Loading
- Open http://localhost:5173
- **Expected**: Beautiful dark UI with form and "No test results yet"

### Test 4: Run Test from UI
1. Enter URL: `https://github.com/vercel/next.js`
2. Click "Run Chaos Test"
3. **Expected**: 
   - Loading spinner with progress messages
   - Score badge appears (colored)
   - Test summary displays
   - Test results show pass/fail

### Test 5: AI Analysis (if API key configured)
**Expected**: 
- "🤖 AI Analysis" section with summary
- "💡 Recommendations" section with 3-5 items

**Without API key**: 
- Should still show recommendations (fallback logic)

### Test 6: Raw JSON Viewer
- Click "View Raw JSON" at bottom
- **Expected**: Formatted JSON with all test data

### Test 7: Error Handling
- Try with empty URL
- **Expected**: Red error message "Please enter a URL or repository"

### Test 8: Multiple Tests
- Run test 2-3 times with different URLs
- **Expected**: New results replace old ones smoothly

---

## 🧪 Backend Unit Tests

```bash
cd backend
npm test
```

**Expected Output:**
```
PASS tests/chaosTests.test.js
  ✓ injectLatency should return test results
  ✓ loadSpike should return test results
  ✓ uiCheck should return test results
  ✓ runChaosTests should run all tests

Tests: 4 passed, 4 total
```

---

## 🎨 UI Visual Checklist

### Score Badge Colors
- [ ] Green (80-100) - "Excellent"
- [ ] Yellow (60-79) - "Good"
- [ ] Orange (40-59) - "Fair"
- [ ] Red (0-39) - "Poor"

### Sections Present
- [ ] Header with 🔥 icon
- [ ] Left side: Input form
- [ ] Right side: Report view
- [ ] AI Analysis (if available)
- [ ] Recommendations
- [ ] Test Summary
- [ ] Issues (if any)
- [ ] Test Results list
- [ ] Raw JSON expander

### Responsive Design
- [ ] Works on desktop (1920px)
- [ ] Works on laptop (1280px)
- [ ] Layout adjusts properly

---

## 🚨 Error Scenarios

### Test 9: Backend Crash Handling
1. Stop backend server
2. Try running test from UI
3. **Expected**: Error message displayed in UI

### Test 10: Invalid URL
- Enter: `not-a-url`
- **Expected**: Either validation error or graceful failure

### Test 11: Network Timeout
- Check console logs during test
- **Expected**: No unhandled promise rejections

---

## 🔐 API Key Tests (if configured)

### With OpenAI Key
```bash
# In .env
OPENAI_API_KEY=sk-...
```
- Run test
- **Expected**: 
  - Console: `[AI Analyzer] Using OpenAI`
  - UI shows AI-generated summary

### With Claude Key
```bash
# In .env
ANTHROPIC_API_KEY=sk-ant-...
```
- Run test
- **Expected**: 
  - Console: `[AI Analyzer] Using Claude`
  - UI shows AI-generated summary

### Without Any Key
- Comment out all API keys
- Run test
- **Expected**: 
  - Console: `[AI Analyzer] Using fallback analysis`
  - UI still shows recommendations

### With Sentry DSN
```bash
SENTRY_DSN=https://...
```
- **Expected**: Console shows Sentry initialization
- Errors captured to Sentry dashboard

---

## 📊 Performance Checks

### Load Time
- [ ] Frontend loads < 2 seconds
- [ ] Backend responds < 5 seconds
- [ ] Total test duration < 6 seconds

### Memory Usage
- [ ] Backend process < 100MB
- [ ] Frontend build < 50MB
- [ ] No memory leaks on repeated tests

---

## 🎯 Demo Talking Points Checklist

Prepare to explain:
- [ ] What chaos engineering is
- [ ] Why it matters (resilience, production readiness)
- [ ] How the 3 tests work
- [ ] AI analysis value-add
- [ ] Sentry integration benefits
- [ ] Fallback logic (works without keys)
- [ ] Tech stack choices
- [ ] Future enhancements

---

## ✅ Ready to Demo When:

- [x] All servers start without errors
- [x] Health check passes
- [x] UI loads properly
- [x] Can run test end-to-end
- [x] Results display correctly
- [x] AI analysis works (or fallback)
- [x] No console errors
- [x] Unit tests pass

---

## 🐛 Common Issues & Fixes

### Port 3001 already in use
```bash
lsof -ti:3001 | xargs kill
```

### Port 5173 already in use
```bash
lsof -ti:5173 | xargs kill
```

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Vite not found
```bash
cd frontend
npm install -D vite
```

### Tests fail
```bash
cd backend
rm -rf node_modules
npm install
npm test
```

### CORS errors in browser
- Check backend is running on port 3001
- Check frontend is accessing correct API URL
- Verify CORS is enabled in `index.js`

---

## 🎬 Demo Script

1. **Introduction** (30s)
   - "AI Chaos Engineer tests application resilience"
   - "Uses AI to provide actionable recommendations"

2. **Show Architecture** (1min)
   - Backend: Express + OpenAI/Claude + Sentry
   - Frontend: React + Tailwind
   - "Works without API keys using fallback logic"

3. **Live Demo** (2min)
   - Open http://localhost:5173
   - Enter GitHub repo URL
   - Click "Run Chaos Test"
   - **Highlight**: Loading → Score → AI Analysis → Recommendations

4. **Code Walkthrough** (2min)
   - Show `chaosTests.js` - test implementations
   - Show `aiAnalyzer.js` - LLM integration
   - Show `ReportView.jsx` - UI components

5. **Testing** (1min)
   - Run `npm test`
   - Show passing tests

6. **Q&A** (2min)

**Total Time**: ~8 minutes

---

**Good luck with your demo! 🚀**

