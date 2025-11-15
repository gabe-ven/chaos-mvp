# 🚀 Quick Start - AI Chaos Engineer

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version
```

---

## Step 1: Install Dependencies

```bash
# Navigate to project
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Configure Environment

```bash
# Create .env file
cd ../backend
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env
# or
code .env
```

**Required in `.env`:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Get your API key from: https://console.anthropic.com/

---

## Step 3: Start Backend

```bash
# Make sure you're in backend directory
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend

# Start backend server
npm run dev
```

**You should see:**
```
🚀 AI Chaos Engineer backend running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

**Leave this terminal running!**

---

## Step 4: Start Frontend

**Open a NEW terminal window:**

```bash
# Navigate to frontend
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend

# Start frontend dev server
npm run dev
```

**You should see:**
```
VITE v5.4.21 ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test the Application

1. **Open browser:** http://localhost:5173

2. **Enter a URL:**
   - Try: `https://example.com`
   - Or: `https://github.com/vercel/next.js`

3. **Click "Run Test"**

4. **Wait 5-15 seconds** for results

5. **View report:**
   - Stability Score (0-100)
   - 8 chaos test results
   - AI recommendations

---

## Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` file created with `ANTHROPIC_API_KEY`
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] http://localhost:3001/health returns `{"status": "ok"}`
- [ ] http://localhost:5173 opens successfully

---

## Common Issues

### "Failed to fetch"
→ Backend not running. See terminal 1, run `npm run dev` in backend folder.

### "Cannot find module"
→ Dependencies not installed. Run `npm install` in both folders.

### "Port already in use"
→ Kill process: `lsof -ti:3001 | xargs kill -9`

### Blank page
→ Check browser console (F12) for errors.

---

## Full Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## What You're Running

- **Backend** (Node.js + Express): Port 3001
  - 8 chaos tests
  - Claude AI analysis
  - Sentry error tracking
  - Daytona workspace provisioning

- **Frontend** (React + Vite + Tailwind): Port 5173
  - Clean UI
  - Real-time results
  - AI recommendations display

---

## Success!

When everything works, you'll see:

1. **Terminal 1** (Backend): Request logs
2. **Terminal 2** (Frontend): Vite dev server
3. **Browser**: Your AI Chaos Engineer running smoothly! 🔥

**Ready for your hackathon demo!** 🎉

