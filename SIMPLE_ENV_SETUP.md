# 🎯 Simple .env Setup - Just API Keys!

Your `.env` file is now **much simpler**. Most values have smart defaults.

---

## ✅ Minimal Setup (Recommended)

### **Just Claude API Key**

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development

# AI Analysis - Just this one key to start!
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**That's it!** This gives you:
- ✅ AI-powered analysis
- ✅ Smart recommendations
- ✅ Full functionality
- ✅ All fallbacks work

Get your key: https://console.anthropic.com/

---

## 🔑 Add More Features (Optional)

### **Add Daytona - Just the key!**

```env
# Previous settings...

# Daytona API - URL defaults to https://api.daytona.io
DAYTONA_API_KEY=your_daytona_key_here
```

**No URL needed!** It automatically uses `https://api.daytona.io`

If you have a custom Daytona instance, you can override:
```env
DAYTONA_API_URL=https://your-custom-daytona.com
```

Get your key: https://www.daytona.io/

### **Add Sentry**

```env
# Previous settings...

# Error Tracking
SENTRY_DSN=https://your-dsn@sentry.ingest.io/project
```

Get your DSN: https://sentry.io/

---

## 📝 Complete Example

### **Full Production Setup**

```env
# Server
PORT=3001
NODE_ENV=development

# AI (Required for AI features)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Daytona (Optional - just the key!)
DAYTONA_API_KEY=dtna_xxxxx

# Sentry (Optional)
SENTRY_DSN=https://xxxxx@sentry.ingest.io/xxxxx
```

---

## 🎯 What Changed?

### Before:
```env
DAYTONA_API_KEY=your_key
DAYTONA_API_URL=https://api.daytona.io  # Had to specify
```

### Now:
```env
DAYTONA_API_KEY=your_key  # URL auto-defaults!
```

**Benefit**: One less thing to configure! 🎉

---

## 🚀 Quick Start

### **Option 1: AI Only**
```bash
cd backend
echo 'PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-your-key-here' > .env
npm run dev
```

### **Option 2: AI + Daytona**
```bash
cd backend
echo 'PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-your-key-here
DAYTONA_API_KEY=dtna-your-key-here' > .env
npm run dev
```

### **Option 3: Everything**
```bash
cd backend
echo 'PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-your-key-here
DAYTONA_API_KEY=dtna-your-key-here
SENTRY_DSN=https://your-dsn@sentry.ingest.io/project' > .env
npm run dev
```

---

## 📊 What Defaults Are Used?

| Variable | Default Value | When Used |
|----------|--------------|-----------|
| `PORT` | `3001` | If not specified |
| `NODE_ENV` | `development` | If not specified |
| `DAYTONA_API_URL` | `https://api.daytona.io` | When you have `DAYTONA_API_KEY` |

---

## ✅ Checklist

- [ ] Get Claude API key from https://console.anthropic.com/
- [ ] Create `backend/.env`
- [ ] Add `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] Optionally add `DAYTONA_API_KEY=...` (no URL needed!)
- [ ] Optionally add `SENTRY_DSN=...`
- [ ] Run `npm run dev`
- [ ] Test at http://localhost:3001/health

---

## 🎉 Benefits

### Simplified Configuration:
- ✅ **Fewer lines** in .env
- ✅ **Less confusion** about what's required
- ✅ **Sensible defaults** for everything
- ✅ **Works immediately** with just one key

### Smart Defaults:
- ✅ Daytona URL auto-configured
- ✅ Port defaults to 3001
- ✅ Node env defaults to development

### Flexible:
- ✅ Can still override any default
- ✅ Everything is optional
- ✅ Fallbacks for missing keys

---

## 🆚 Comparison

### Minimal .env (Start Here)
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
```
**Lines**: 1  
**Time to setup**: 30 seconds

### Full .env (All Features)
```env
PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-xxxxx
DAYTONA_API_KEY=dtna-xxxxx
SENTRY_DSN=https://xxxxx
```
**Lines**: 5  
**Time to setup**: 2 minutes

### Old Way (Before Simplification)
```env
PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
DAYTONA_API_KEY=dtna-xxxxx
DAYTONA_API_URL=https://api.daytona.io
SENTRY_DSN=https://xxxxx
```
**Lines**: 7  
**Time to setup**: 5 minutes

**Result**: **~60% fewer configuration lines!** 🎉

---

## 📞 Need Help?

- **Getting started**: Just add `ANTHROPIC_API_KEY`
- **Daytona not working**: Check your API key is correct
- **Custom Daytona instance**: Add `DAYTONA_API_URL=...`
- **Full setup guide**: See [SETUP_STEPS.md](./SETUP_STEPS.md)

---

**Now go test your app with minimal configuration!** 🚀

