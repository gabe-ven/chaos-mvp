# 🔧 Troubleshooting Guide

## "Failed to fetch" Error

### Problem
Frontend can't connect to the backend API.

### Solution

**1. Check if backend is running:**

```bash
# Terminal 1: Backend should be running
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm run dev
```

You should see:
```
🚀 AI Chaos Engineer backend running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

**2. Verify backend is accessible:**

Open http://localhost:3001/health in your browser. You should see:
```json
{
  "status": "ok",
  "message": "AI Chaos Engineer API is running"
}
```

**3. Check for port conflicts:**

```bash
# Kill any process using port 3001
lsof -ti:3001 | xargs kill -9

# Restart backend
cd backend && npm run dev
```

**4. Check CORS settings:**

The backend should have CORS enabled in `backend/src/index.js`:
```javascript
app.use(cors());
```

**5. Verify environment variables:**

Make sure `backend/.env` exists with at least:
```bash
PORT=3001
ANTHROPIC_API_KEY=your_key_here
```

---

## "Cannot find module" Errors

### Problem
Missing dependencies.

### Solution

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## Backend Crashes on Startup

### Problem
Missing API keys or invalid configuration.

### Solution

**1. Check for `.env` file:**

```bash
cd backend
ls -la .env
```

If missing:
```bash
cp .env.example .env
```

**2. Add Anthropic API key:**

Edit `backend/.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

**3. Restart backend:**

```bash
npm run dev
```

---

## Tests Return Empty Results

### Problem
API keys not configured or invalid.

### Solution

**Check Anthropic API key:**

1. Get key from https://console.anthropic.com/
2. Add to `backend/.env`:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```
3. Restart backend

---

## Frontend Shows Blank Page

### Problem
Build or runtime error.

### Solution

**1. Check browser console for errors**

Press F12 → Console tab

**2. Clear cache and reload:**

- Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

**3. Rebuild frontend:**

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## "EADDRINUSE" Error

### Problem
Port already in use.

### Solution

```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Restart both
cd backend && npm run dev
# In another terminal:
cd frontend && npm run dev
```

---

## Slow API Responses

### Problem
AI analysis taking too long.

### Solution

**1. Check backend logs** - Look for slow operations

**2. Verify API quotas** - Check Anthropic dashboard for rate limits

**3. Reduce test complexity** - Tests run 8 chaos tests; this is normal

Expected time: **5-15 seconds** for full test suite

---

## Common Issues Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] `backend/.env` file exists
- [ ] `ANTHROPIC_API_KEY` set in `.env`
- [ ] Dependencies installed (both frontend & backend)
- [ ] No CORS errors in browser console
- [ ] Backend `/health` endpoint returns `{"status": "ok"}`

---

## Still Having Issues?

1. **Check backend logs** for detailed error messages
2. **Check browser console** (F12) for frontend errors
3. **Restart everything:**
   ```bash
   # Kill all
   lsof -ti:3001 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   
   # Reinstall
   cd backend && npm install && npm run dev &
   cd frontend && npm install && npm run dev &
   ```

---

## Quick Test

**Backend health check:**
```bash
curl http://localhost:3001/health
```

**Run chaos test:**
```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

If this works but the frontend doesn't, it's a frontend issue. If this fails, it's a backend issue.

