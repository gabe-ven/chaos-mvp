# 🚀 Real Integrations Setup Guide

Your AI Chaos Engineer now supports **real production integrations** for:
- ✅ Daytona API (workspace provisioning)
- ✅ Sentry (error tracking)
- ✅ Claude API (AI analysis)
- ✅ Puppeteer (browser automation for UI checks)

---

## 📦 Step 1: Install Dependencies

```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend

# Install all real integration packages
npm install @sentry/node puppeteer
```

**Note**: Puppeteer will download Chromium (~170MB). This is normal and takes a few minutes.

---

## 🔑 Step 2: Get Your API Keys

### 1. Daytona API Key
```
Website: https://www.daytona.io/
Steps:
  1. Sign up for account
  2. Go to Settings → API Keys
  3. Generate new API key
  4. Copy the API key and API URL
  
Format: 
  Key: daytona_...
  URL: https://api.daytona.io (or your instance URL)
```

### 2. Anthropic Claude API Key
```
Website: https://console.anthropic.com/
Steps:
  1. Sign up for account
  2. Go to API Keys section
  3. Create new API key
  4. Copy the key (starts with sk-ant-)
  
Cost: ~$0.01 per 1000 requests with Claude 3.5 Sonnet
Free tier: $5 credit for new accounts
```

### 3. Sentry DSN
```
Website: https://sentry.io/
Steps:
  1. Sign up / Create new project
  2. Choose "Node.js" as platform
  3. Copy the DSN from project settings
  
Format: https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
Free tier: 5,000 errors/month
```

---

## 📝 Step 3: Configure .env File

Create `backend/.env` with your real keys:

```env
# ============================================
# SERVER
# ============================================
PORT=3001
NODE_ENV=development

# ============================================
# DAYTONA API (Real Integration)
# ============================================
DAYTONA_API_KEY=your_actual_daytona_key_here
DAYTONA_API_URL=https://api.daytona.io

# ============================================
# ANTHROPIC CLAUDE (AI Analysis)
# ============================================
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# ============================================
# SENTRY (Error Tracking)
# ============================================
SENTRY_DSN=https://your-actual-dsn@sentry.ingest.io/project-id

# ============================================
# OPTIONAL: OpenAI (Alternative to Claude)
# ============================================
# OPENAI_API_KEY=sk-your-key-here
# OPENAI_MODEL=gpt-4o-mini
```

---

## 🔄 How It Works

### Smart Fallback System

Each integration uses a **smart fallback** pattern:

```
Check for API Key
    ├─> Has Key? → Use Real Integration
    └─> No Key?  → Use Stub/Fallback
```

### Daytona Integration
- **With Key**: Creates real workspaces via Daytona API
- **Without Key**: Uses simulated workspace (stub)

### Sentry Integration
- **With DSN**: Sends errors to Sentry dashboard
- **Without DSN**: Logs errors to console

### Claude Integration
- **With Key**: Uses Claude 3.5 Sonnet for AI analysis
- **Without Key**: Uses rule-based fallback recommendations

### Browser Automation
- **With Puppeteer**: Real browser checks (accessibility, console errors, responsiveness)
- **Without Puppeteer**: Basic HTTP checks with simulated results

---

## ✅ Step 4: Test Each Integration

### Test Daytona
```bash
# Start backend
npm run dev

# Should see:
# [Daytona] Using real Daytona API...
# (if key configured)
```

### Test Sentry
```bash
# Should see:
# [Sentry] ✓ Initialized successfully with real Sentry SDK
# (if DSN configured)

# Test error tracking:
# Trigger an error and check Sentry dashboard
```

### Test Claude
```bash
# Should see:
# [AI Analyzer] Using Claude
# (when running a test with Claude key)
```

### Test Browser Automation
```bash
# Should see:
# [Browser] Puppeteer loaded - real UI checks enabled
# [Browser] Launching browser for [url]...
```

---

## 🎯 Verify Setup

Run a complete test:

```bash
# Test API
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**Expected console output with all integrations**:
```
[Daytona] Using real Daytona API...
[Daytona] ✓ Workspace created: https://...
[Latency Test] Testing https://...
[Load Spike Test] Testing https://...
[Browser] Launching browser for https://...
[Browser] Check complete: PASS
[AI Analyzer] Using Claude
[Sentry] Captured breadcrumb: Chaos test completed
```

---

## 📊 Integration Status Display

When you start the backend, you'll see status for each integration:

```bash
npm run dev

# Output:
🚀 AI Chaos Engineer backend running on http://localhost:3001
📊 Health check: http://localhost:3001/health

Integration Status:
  ✅ Daytona: ENABLED (real API)
  ✅ Sentry: ENABLED (real SDK)
  ✅ Claude: ENABLED (AI analysis)
  ✅ Browser: ENABLED (Puppeteer)
  
OR if not configured:

Integration Status:
  ⚠️  Daytona: FALLBACK (no API key)
  ⚠️  Sentry: FALLBACK (no DSN)
  ✅ Claude: ENABLED
  ⚠️  Browser: FALLBACK (Puppeteer not installed)
```

---

## 🐛 Troubleshooting

### Puppeteer Issues

**Problem**: Puppeteer fails to download Chromium
```bash
# Solution: Use specific Chromium path
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
# Then install Chromium separately
npx puppeteer browsers install chrome
```

**Problem**: Permission denied
```bash
# Solution: Run with proper permissions
sudo npm install puppeteer
```

### Daytona API Issues

**Problem**: 401 Unauthorized
```
Solution: Check API key is correct and not expired
```

**Problem**: API endpoint not found
```
Solution: Verify DAYTONA_API_URL is correct
Check Daytona documentation for correct endpoint format
```

### Sentry Issues

**Problem**: Events not appearing in dashboard
```
Solution:
1. Check DSN is correct
2. Verify project is not rate-limited
3. Check Sentry quota (free tier: 5k errors/month)
4. Look for initialization errors in console
```

### Claude API Issues

**Problem**: 429 Too Many Requests
```
Solution: Rate limit hit - wait or upgrade plan
```

**Problem**: Invalid API key
```
Solution: Generate new key from https://console.anthropic.com/
```

---

## 💰 Cost Estimates

### With Real Integrations

**Claude API**:
- Cost: ~$0.015 per 1K tokens
- Per test: ~500 tokens = $0.0075
- 100 tests: ~$0.75

**Daytona**:
- Pricing varies by plan
- Check: https://www.daytona.io/pricing

**Sentry**:
- Free: 5,000 errors/month
- Paid: Starting at $26/month

**Puppeteer**:
- Free (open source)
- Requires server compute time

**Total for 100 tests**: ~$1-2 (mostly Claude)

---

## 🎉 You're All Set!

Your AI Chaos Engineer now has:
- ✅ Real workspace provisioning (Daytona)
- ✅ Production error tracking (Sentry)
- ✅ AI-powered analysis (Claude)
- ✅ Real browser automation (Puppeteer)
- ✅ Smart fallbacks for everything

Run your tests and watch the magic happen! 🚀

---

## 📞 Need Help?

- Daytona: https://docs.daytona.io/
- Sentry: https://docs.sentry.io/platforms/node/
- Claude: https://docs.anthropic.com/
- Puppeteer: https://pptr.dev/


