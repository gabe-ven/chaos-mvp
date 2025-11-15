# 🔗 Real-Time Features - Integration Complete!

The Chaos Live system has been **integrated into** your main AI Chaos Engineer project!

---

## ✅ What Was Integrated

### **Backend Changes:**
1. ✅ Added WebSocket server (`src/realtime.js`)
2. ✅ Integrated WebSocket into existing Express server
3. ✅ Added `/screenshots` and `/videos` static file serving
4. ✅ Updated health check to show WebSocket status
5. ✅ Same port (3001) for everything

### **Frontend Changes:**
1. ✅ Added `/live` page for real-time dashboard
2. ✅ Added "Open Live Dashboard" button to main UI
3. ✅ Reuses existing Tailwind styling

### **File Structure:**
```
ai-chaos-engineer/
├── backend/
│   ├── src/
│   │   ├── index.js        # ✅ Updated with WebSocket
│   │   ├── realtime.js     # ✅ NEW - WebSocket streaming
│   │   └── ...existing files...
│   └── public/             # ✅ NEW
│       ├── screenshots/    # Auto-captured images
│       └── videos/         # Recorded sessions
│
└── frontend/
    ├── pages/
    │   ├── index.js        # Existing main dashboard
    │   └── live.js         # ✅ NEW - Real-time dashboard
    └── src/
        └── App.jsx         # ✅ Updated with Live button
```

---

## 🚀 How to Use (Now Unified!)

### **Step 1: Install WebSocket Dependency**

```bash
cd backend
npm install ws
```

### **Step 2: Start Everything Together**

```bash
# Terminal 1: Backend (with WebSocket)
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**One backend, one frontend - everything integrated!** ✅

### **Step 3: Access Both Dashboards**

- **Main Dashboard**: http://localhost:5173
- **Live Dashboard**: http://localhost:5173/live (or click button)

---

## 📡 WebSocket Endpoint

Now available at: **ws://localhost:3001/ws**

All on the same server as your API!

---

## 🎯 How It Works

### **When You Run a Test:**

1. Frontend sends POST to `/run` (existing)
2. Backend runs chaos tests (existing)
3. **NEW:** Tests can broadcast events via WebSocket
4. **NEW:** Live dashboard shows real-time updates
5. Backend returns final report (existing)

### **Two Viewing Modes:**

**Mode 1: Standard (Existing)**
- Go to http://localhost:5173
- Submit URL → Get final report
- See AI analysis & recommendations

**Mode 2: Live Monitoring (New)**
- Go to http://localhost:5173/live
- Watch real-time events stream in
- See screenshots & videos as they're captured
- Monitor stability score live

---

## 🔧 Update Chaos Tests for Real-Time

To broadcast events from your chaos tests, import the realtime functions:

```javascript
// In backend/src/chaosTests.js (example)
import { sendBrowserEvent, sendStability, sendScreenshot } from './realtime.js';

export async function uiCheck(url) {
  // ... existing code ...
  
  // Add real-time broadcasting
  sendBrowserEvent('ui_check_start', url);
  
  // ... test logic ...
  
  if (passed) {
    sendStability(stability + 1, 'UI check passed');
  } else {
    sendStability(stability - 5, 'UI check failed');
    sendScreenshot('ui-failure.png', 'UI Check Failed');
  }
  
  // ... return existing result ...
}
```

---

## 📊 Available Real-Time Functions

```javascript
// From backend/src/realtime.js

sendLog(message, level)           // Send log message
sendBrowserEvent(action, target)  // Send browser event
sendStability(value, reason)      // Update stability score
sendScreenshot(filename, desc)    // Notify screenshot captured
sendVideo(filename, desc)         // Notify video recorded
```

---

## 🎨 UI Features

### **Main Dashboard (/):**
- ✅ Existing URL input form
- ✅ Existing report view
- ✅ **NEW:** "Open Live Dashboard" button (top right)

### **Live Dashboard (/live):**
- ✅ Real-time event feed
- ✅ Animated stability score
- ✅ Screenshot gallery
- ✅ Video player
- ✅ Connection status indicator
- ✅ "Back to Main Dashboard" link

---

## 🔥 Next Steps

### **1. Test the Integration**

```bash
# Start backend
cd backend && npm install ws && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Open both dashboards
open http://localhost:5173        # Main
open http://localhost:5173/live   # Live
```

### **2. Optional: Add Real-Time to Existing Tests**

Update `backend/src/chaosTests.js` to broadcast events:

```javascript
import { sendLog, sendBrowserEvent, sendStability } from './realtime.js';

// Add at key points in your tests
sendLog('Starting chaos test...', 'info');
sendBrowserEvent('test_action', 'description', true);
sendStability(currentScore, 'reason for change');
```

### **3. Run a Test and Watch Both Views**

- Main dashboard: See final AI-analyzed report
- Live dashboard: Watch real-time progress

---

## 🎯 Benefits of Integration

### **Before (Separate Systems):**
- ❌ Two separate projects
- ❌ Two backends to run
- ❌ Two frontends to manage
- ❌ Different ports everywhere

### **After (Integrated):**
- ✅ One unified project
- ✅ One backend (with WebSocket)
- ✅ One frontend (with two views)
- ✅ Same port for everything
- ✅ Shared components and styling
- ✅ Easier to maintain

---

## 📁 What About chaos-live/?

The standalone `chaos-live/` folder is still there for reference, but you don't need it anymore! 

**Your main `ai-chaos-engineer/` project now has all the features.**

You can either:
- Keep it as reference documentation
- Delete it: `rm -rf chaos-live`

---

## 🚀 Summary

**One Command to Rule Them All:**

```bash
# Install WebSocket
cd backend && npm install ws

# Run everything
npm run dev  # (in both backend and frontend)
```

**Two Dashboards, One System:**
- http://localhost:5173 → Main (AI reports)
- http://localhost:5173/live → Live monitoring

**No more separate projects!** 🎉

---

## 🎨 Customization

### **Change Live Dashboard Route:**

Edit `frontend/pages/live.js` filename to whatever you want:
- `realtime.js` → http://localhost:5173/realtime
- `monitor.js` → http://localhost:5173/monitor

### **Add More Real-Time Features:**

Create new event types in `backend/src/realtime.js`:

```javascript
export function sendCustomEvent(data) {
  broadcast({
    type: 'custom_event',
    ...data
  });
}
```

---

**Integration complete! Everything now runs together! 🚀**

