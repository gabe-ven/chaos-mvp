# 🚀 Setup Steps - Real Integrations

Quick reference for setting up your AI Chaos Engineer with full production integrations.

---

## ⚡ Step-by-Step Setup

### **1. Install Basic Dependencies** ✅
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm install
```

### **2. Install Real Integration Packages** 🆕
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer
./setup-real-integrations.sh
```

This installs:
- `@sentry/node` - Real Sentry SDK
- `puppeteer` - Browser automation (~170MB, takes 2-3 minutes)

### **3. Create .env File**

The setup script creates a template. Edit `backend/.env`:

```bash
cd backend
nano .env
# Or use your favorite editor
```

Add your API keys:

```env
PORT=3001
NODE_ENV=development

# REQUIRED: Choose one AI provider
ANTHROPIC_API_KEY=sk-ant-xxxxx
# OR
# OPENAI_API_KEY=sk-xxxxx

# OPTIONAL: For real workspace provisioning
DAYTONA_API_KEY=your_key
DAYTONA_API_URL=https://api.daytona.io

# OPTIONAL: For error tracking
SENTRY_DSN=https://xxxxx@sentry.ingest.io/xxxxx
```

### **4. Get Your API Keys**

| Service | URL | Free Tier |
|---------|-----|-----------|
| **Claude** | https://console.anthropic.com/ | $5 credit |
| **Daytona** | https://www.daytona.io/ | Varies |
| **Sentry** | https://sentry.io/ | 5k errors/month |

### **5. Start the Backend**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 AI Chaos Engineer backend running on http://localhost:3001
[Sentry] ✓ Initialized successfully with real Sentry SDK
[Browser] Puppeteer loaded - real UI checks enabled
```

### **6. Start the Frontend** (New Terminal)
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm install  # If not already done
npm run dev
```

Opens at: http://localhost:5173

---

## 🎯 What You Get

### Without Any API Keys (Still Works!)
- ✅ Chaos tests run
- ✅ Scoring works
- ⚠️ Rule-based recommendations (fallback)
- ⚠️ Simulated workspaces
- ⚠️ Console error logging
- ⚠️ Basic HTTP UI checks

### With Claude Key Only
- ✅ All above +
- ✅ **AI-powered summaries**
- ✅ **Smart recommendations**
- ✅ Better insights

### With All Keys + Packages
- ✅ All above +
- ✅ **Real Daytona workspaces**
- ✅ **Sentry error dashboard**
- ✅ **Real browser automation**
- ✅ **Production-grade checks**

---

## 🧪 Test Each Integration

### Test Backend Health
```bash
curl http://localhost:3001/health
```

### Test Full Chaos Run
```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### Test from UI
1. Open http://localhost:5173
2. Enter URL: `https://github.com/vercel/next.js`
3. Click "Run Chaos Test"
4. Watch results appear!

---

## 📊 Integration Status Check

When backend starts, you'll see status for each:

```
✅ Daytona: ENABLED (real API)
✅ Sentry: ENABLED (real SDK)  
✅ Browser: ENABLED (Puppeteer)
✅ Claude: ENABLED (AI analysis)
```

OR

```
⚠️  Daytona: FALLBACK (no API key)
⚠️  Sentry: FALLBACK (no DSN)
⚠️  Browser: FALLBACK (Puppeteer not installed)
✅ Claude: ENABLED
```

---

## 🐛 Troubleshooting

### Puppeteer Installation Fails
```bash
# Try with specific version
npm install puppeteer@21.6.0

# Or skip Chromium download and install separately
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
npx puppeteer browsers install chrome
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill

# Or change port in .env
PORT=3002
```

### API Keys Not Working
- Check for typos (no spaces, correct prefix)
- Claude keys start with: `sk-ant-`
- OpenAI keys start with: `sk-proj-` or `sk-`
- Sentry DSN format: `https://xxx@xxx.ingest.sentry.io/xxx`

---

## 📚 Full Documentation

- **[REAL_INTEGRATIONS_SUMMARY.md](./REAL_INTEGRATIONS_SUMMARY.md)** - What was added
- **[backend/REAL_INTEGRATIONS.md](./ai-chaos-engineer/backend/REAL_INTEGRATIONS.md)** - Detailed setup
- **[HACKATHON_README.md](./HACKATHON_README.md)** - Complete guide
- **[START_HERE.md](./START_HERE.md)** - Quick start

---

## ✅ Quick Checklist

- [ ] Run `npm install` in backend
- [ ] Run `./setup-real-integrations.sh`
- [ ] Get Claude API key from https://console.anthropic.com/
- [ ] Get Daytona key from https://www.daytona.io/ (optional)
- [ ] Get Sentry DSN from https://sentry.io/ (optional)
- [ ] Create/edit `backend/.env` with keys
- [ ] Run `npm run dev` in backend
- [ ] Run `npm run dev` in frontend (new terminal)
- [ ] Open http://localhost:5173
- [ ] Test with a URL!

---

## 🎉 You're Ready!

You now have a **production-grade chaos engineering platform** with:
- Real browser automation
- Real AI analysis
- Real error tracking
- Real workspace provisioning

**Go break some apps (in a good way)!** 🚀

