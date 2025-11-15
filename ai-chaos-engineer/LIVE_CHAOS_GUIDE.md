# Live Chaos Engineering - Real-Time Process Visualization

## What You'll See Now

Instead of just "Running", you'll see EXACTLY what's happening:

### Latency Injection
- "Initiating HTTP GET request to target"
- "Measuring response time..."
- "Response received in 342ms"
- "HTTP 200 - OK"

### Load Spike
- "Preparing concurrent request barrage"
- "Setting up 10 simultaneous connections..."
- "FIRING 10 CONCURRENT REQUESTS NOW"
- "Bombarding server with simultaneous load..."
- "8/10 succeeded | Avg: 156ms"

### UI Check (Browser)
- "Launching browser automation (Puppeteer)"
- "Initializing headless Chrome..."
- "Navigating to https://example.com"
- "Loading page and analyzing DOM structure..."
- "Scanning for broken links and console errors"
- "UI health check complete"

### Memory Leak Test
- "Testing memory allocation patterns"
- "Simulating 50 rapid consecutive requests..."
- "Analyzing memory growth patterns"
- "50 requests completed"

### CPU Spike Test
- "Simulating heavy CPU load"
- "Running 100,000 mathematical operations..."
- "CPU stress test complete"
- "Completed 100,000 operations"

### Rate Limit Test
- "Testing rate limiting behavior"
- "Sending rapid burst of 20 requests..."
- "Checking for throttling"
- "Analyzing request timing patterns..."

### Error Recovery Test
- "Injecting simulated errors"
- "Testing timeout, network, and server failures..."
- "Measuring recovery time"
- "3/3 errors recovered"

### Cascading Failure Test
- "Simulating multi-service failure chain"
- "Testing auth -> database -> cache -> API cascade..."
- "Analyzing failure isolation"
- "3/4 services isolated properly"

## How to Activate

### 1. Stop Both Servers
```bash
# Press Ctrl+C in both terminals
```

### 2. Restart Backend
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm run dev
```

**Watch for:**
```
[WebSocket] Server initialized on /ws
Server running on port 3001
```

### 3. Restart Frontend
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm run dev
```

### 4. Run a Test
1. Open http://localhost:5173
2. Open Browser DevTools (F12) → Console tab
3. Enter a URL (e.g., `https://google.com`)
4. Click "Run Tests"

## What You'll Experience

### On the Web Page:
- Each test will show a **colored border** (blue=running, green=passed, red=failed)
- **Action line** (blue): What's happening RIGHT NOW
- **Metric line** (gray): Real metrics and data
- Updates happen **multiple times per test** as it progresses

### In the Browser Console:
```
[WebSocket] Connected
[App] Received WebSocket message: {type: 'test_progress', testName: 'Latency Injection', ...}
[WebSocket] Message received: {action: 'Initiating HTTP GET request to target', ...}
```

### In the Backend Terminal:
```
[WebSocket] Broadcasting test progress: { testName: 'Latency Injection', status: 'running' }
[Latency Test] Testing https://google.com...
[WebSocket] Broadcasting test progress: { testName: 'Latency Injection', status: 'passed' }
```

## Live Browser Mode

To SEE the browser automation happening:

1. Edit `backend/.env`:
```env
BROWSER_LIVE=true
```

2. Restart backend

3. Run UI Check test

4. A Chrome window will **pop up and show you** the browser navigating, clicking, and analyzing the page!

## The Chaos is Now Visible

Every HTTP request, every browser action, every simulated failure - you can now watch it all happen in real-time with detailed metrics. This is chaos engineering made visible.

