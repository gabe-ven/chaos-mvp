# ⚡ Quick Start - AI Chaos Engineer

Get up and running in **2 minutes**.

## 1. Install Dependencies

```bash
# Backend
cd ai-chaos-engineer/backend
npm install

# Frontend
cd ../frontend
npm install
```

## 2. Run the App

**Terminal 1:**
```bash
cd ai-chaos-engineer/backend
npm run dev
```

**Terminal 2:**
```bash
cd ai-chaos-engineer/frontend
npm run dev
```

## 3. Open Browser

Navigate to: **http://localhost:5173**

Enter any URL and click "Run Chaos Test"!

---

## Optional: Add API Keys

Create `backend/.env`:

```env
PORT=3001

# Optional: AI Analysis
OPENAI_API_KEY=sk-your-key-here

# Optional: Error Tracking
SENTRY_DSN=https://your-dsn@sentry.io/project
```

**Without API keys**: The app still works with fallback logic!

---

## Test the API Directly

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/vercel/next.js"}'
```

---

## Run Tests

```bash
cd backend
npm test
```

---

**That's it!** You're ready to demo. 🎉

