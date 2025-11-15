# Quick Test - Live Updates Troubleshooting

## Did you restart BOTH servers?

The code changes won't take effect until you restart both:

### 1. Stop Backend
In the backend terminal, press **Ctrl+C**

### 2. Stop Frontend  
In the frontend terminal, press **Ctrl+C**

### 3. Restart Backend
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm run dev
```

**WAIT** until you see:
```
[WebSocket] Server initialized on /ws
Server running on port 3001
```

### 4. Restart Frontend
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm run dev
```

## Test It

1. Open http://localhost:5173
2. **Press F12** to open DevTools
3. Go to **Console tab**
4. Enter URL: `https://google.com`
5. Click "Run Tests"

## What to Look For

### In Browser Console:
You should see:
```
[App] WebSocket URL: ws://localhost:3001/ws
[App] WebSocket connected: true
[WebSocket] Connected
[App] Received WebSocket message: {type: 'test_start', ...}
[App] Received WebSocket message: {type: 'test_progress', testName: 'Latency Injection', status: 'running', details: {action: '...', metric: '...'}}
```

### On the Page:
Each test should show:
- Blue border when running
- **Action line** (blue text): "Initiating HTTP GET request to target"
- **Metric line** (gray text): "Measuring response time..."
- Updates **change in real-time** as the test progresses

### In Backend Terminal:
You should see:
```
[WebSocket] Broadcasting test start: https://google.com
[WebSocket] Broadcasting test progress: { testName: 'Latency Injection', status: 'running' }
[Latency Test] Testing https://google.com...
[WebSocket] Broadcasting test progress: { testName: 'Latency Injection', status: 'running' }
[WebSocket] Broadcasting test progress: { testName: 'Latency Injection', status: 'passed' }
```

## If Still Not Working

### Check 1: Are WebSocket messages being received?
Look in browser console for `[WebSocket] Message received:`

- **YES**: WebSocket is connected, but events might not be rendering
- **NO**: WebSocket not connecting properly

### Check 2: Are events being added to state?
Look for `[App] Total events now: X` where X increases

- **YES**: Events are being stored, but UI might not be updating
- **NO**: Events aren't being added to state

### Check 3: Network Tab
1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Click on `ws://localhost:3001/ws`
4. Click "Messages" tab
5. You should see messages flowing in real-time

If you see messages there but not in the UI, it's a React rendering issue.
If you don't see messages at all, it's a WebSocket connection issue.

