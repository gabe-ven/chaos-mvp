# Browser Use Service

AI-powered browser automation using [Browser Use](https://github.com/browser-use/browser-use).

## Setup

1. **Install Python 3.11+** (if not already installed)

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Install Chromium:**
```bash
python -m browser_use install
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your API key
```

Get $10 free credits at [browser-use.com](https://browser-use.com)

5. **Run the service:**
```bash
python browser_service.py
```

Service runs on `http://localhost:3002`

## Features

- ✅ AI-powered UI checks using Browser Use
- ✅ Real-time WebSocket streaming of browser actions
- ✅ Automatic issue detection
- ✅ Live or headless mode
- ✅ Compatible with existing Node.js backend

## API

### POST /ui-check
```json
{
  "url": "https://example.com",
  "task": "Check for UI issues"
}
```

### WebSocket /ws
Real-time browser action streaming

