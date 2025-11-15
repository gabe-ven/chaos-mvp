# 🔥 AI Chaos Engineer - Complete Setup Guide

## Quick Start (2 Steps)

### Step 1: Install Dependencies

Run these commands in your terminal:

```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer

# Backend
cd backend
npm install

# Frontend (install base + required packages)
cd ../frontend
npm install
npm install react-router-dom framer-motion
```

### Step 2: Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

> **Note**: Daytona and Sentry are optional. The app works with stubs if not configured.

---

## ✅ Verify Setup

After installing dependencies, your Vite error should disappear. Check that you see:

```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🚀 Run the Application

**Terminal 1 - Backend:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm run dev
```

You should see:
```
🚀 AI Chaos Engineer backend running on http://localhost:3001
📊 Health check: http://localhost:3001/health
📡 WebSocket endpoint: ws://localhost:3001/ws
```

**Terminal 2 - Frontend:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm run dev
```

You should see:
```
VITE ready
➜  Local:   http://localhost:5173/
```

---

## 🎯 Test the Application

1. **Open Main Dashboard**: http://localhost:5173

2. **Open Live Dashboard**: Click "Live Dashboard" button or go to http://localhost:5173/live

3. **Run a Test**:
   - Enter a URL (e.g., `https://example.com`)
   - Click "Run Chaos Test"
   - Watch events stream in real-time on the Live Dashboard!

---

## 📋 What You Have

### ✅ Backend Features

- ✅ **Daytona Integration** - Workspace provisioning (real + stub)
- ✅ **Chaos Tests**:
  - Latency injection
  - Load spike simulation
  - UI/URL accessibility checks
- ✅ **Sentry Integration** - Error tracking (real + stub)
- ✅ **Anthropic Claude** - AI analysis and recommendations
- ✅ **WebSocket Server** - Real-time event streaming
- ✅ **Express API** - `/run` endpoint with CORS

### ✅ Frontend Features

- ✅ **Main Dashboard** - Submit URL, view results
- ✅ **Live Dashboard** - Real-time event feed
- ✅ **Stability Score** - Dynamic 0-100 score with color coding
- ✅ **AI Recommendations** - Display Claude's analysis
- ✅ **React Router** - Multi-page navigation
- ✅ **Framer Motion** - Smooth animations
- ✅ **Tailwind CSS** - Beautiful styling

---

## 🔑 API Keys You Need

### Required

**Anthropic Claude API Key**
- Sign up: https://console.anthropic.com/
- Get API key from dashboard
- Add to `backend/.env` as `ANTHROPIC_API_KEY`

### Optional

**Daytona API Key** (for real workspace provisioning)
- Sign up: https://daytona.io/
- Get API key
- Add to `backend/.env` as `DAYTONA_API_KEY`

**Sentry DSN** (for production error tracking)
- Sign up: https://sentry.io/
- Create project, get DSN
- Add to `backend/.env` as `SENTRY_DSN`

---

## 🐛 Troubleshooting

### Frontend: "Failed to resolve import react-router-dom"

**Solution:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm install react-router-dom framer-motion
```

### Backend: "ANTHROPIC_API_KEY is not defined"

**Solution:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
cp .env.example .env
# Edit .env and add your API key
```

### WebSocket: "Connection failed"

**Solution:**
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify `ws://localhost:3001/ws` is accessible

### Port already in use

**Solution:**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Expected Test Flow

1. **User submits URL** → Backend receives `/run` request
2. **Daytona provisions workspace** → Returns workspace URL (or stub)
3. **Chaos tests execute**:
   - Latency injection (200-700ms)
   - Load spike (10 concurrent requests)
   - UI check (HTTP accessibility)
4. **Sentry captures errors** → Logs exceptions
5. **Claude analyzes results** → Generates recommendations
6. **Stability score calculated** → 0-100 based on failures
7. **Response sent to frontend** → Display results
8. **WebSocket events** → Stream to live dashboard

---

## 🎉 Success Criteria

✅ Run end-to-end test in < 90 seconds  
✅ Display stability score (0-100)  
✅ Show AI recommendations  
✅ Real-time event streaming  
✅ Clean React + Tailwind UI  
✅ No crashes or errors  

---

## 📚 Documentation

- `README.md` - Project overview
- `QUICKSTART.md` - Fast setup guide
- `REALTIME_FEATURES.md` - WebSocket details
- `CHANGES.md` - Recent updates

---

## 🚀 You're Ready!

Your AI Chaos Engineer is fully configured and ready to test applications! 🔥

**Next Steps:**
1. Install dependencies (see Step 1 above)
2. Add Anthropic API key
3. Start both servers
4. Open http://localhost:5173
5. Run your first chaos test!

