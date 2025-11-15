# 🔥 AI Chaos Engineer

A 6-hour MVP for automated chaos engineering testing. Test your application's resilience with latency injection, load spikes, and UI checks, all powered by Daytona workspaces.

## 🚀 Features

- **Latency Injection**: Simulates network delays to test timeout handling
- **Load Spike Testing**: Tests performance under concurrent requests
- **UI Validation**: Checks accessibility, responsiveness, and error states
- **Stability Score**: Get a 0-100 score based on your app's resilience
- **Detailed Reports**: JSON reports with issues, severity levels, and recommendations

## 📁 Project Structure

```
ai-chaos-engineer/
├── backend/          # Express API server
│   ├── src/
│   │   ├── index.js           # Main server
│   │   ├── chaosTests.js      # Chaos test implementations
│   │   ├── daytonaClient.js   # Daytona workspace manager
│   │   ├── reportBuilder.js   # Report generation
│   │   └── utils/
│   │       └── timers.js      # Timer utilities
│   ├── tests/
│   │   └── chaosTests.test.js # Jest tests
│   └── package.json
├── frontend/         # React + Vite + Tailwind UI
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── RunForm.jsx    # Test input form
│   │   │   └── ReportView.jsx # Results display
│   │   └── lib/
│   │       └── api.js         # API client
│   └── package.json
└── README.md         # This file
```

## 🏃 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
DAYTONA_API_KEY=your_daytona_api_key_here
DAYTONA_API_URL=https://api.daytona.io
NODE_ENV=development
```

> **Note**: For the MVP, Daytona integration is stubbed. The app will work without a real API key.

### 3. Run the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3001`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Use the Application

1. Open your browser to `http://localhost:5173`
2. Enter a GitHub repository URL or web URL
3. Click **"Run Chaos Test"**
4. View your stability score and detailed report

## 🧪 Running Tests

```bash
cd backend
npm test
```

## 📊 API Endpoints

### `POST /run`

Runs chaos tests on the provided URL.

**Request:**
```json
{
  "url": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "score": 85,
  "status": "Excellent",
  "summary": "3/3 tests passed. Stability score: 85/100",
  "issues": [],
  "raw": {
    "workspaceUrl": "https://workspace-xyz.daytona.dev",
    "totalDuration": 1234,
    "tests": [
      {
        "test": "Latency Injection",
        "passed": true,
        "duration": 456,
        "message": "Response time: 456ms (acceptable)",
        "severity": "low"
      }
    ],
    "timestamp": "2025-11-15T12:00:00.000Z"
  }
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "AI Chaos Engineer API is running"
}
```

## 🎨 Tech Stack

### Backend
- **Express** - Web framework
- **Node.js** - Runtime
- **Jest** - Testing framework
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## 🔧 Development

### Backend Structure

- `src/index.js` - Express server setup and routes
- `src/chaosTests.js` - Core chaos testing logic
- `src/daytonaClient.js` - Daytona workspace management (stubbed for MVP)
- `src/reportBuilder.js` - Report generation and scoring
- `src/utils/timers.js` - Utility functions for timing

### Frontend Structure

- `src/App.jsx` - Main application layout
- `src/components/RunForm.jsx` - Input form for URLs
- `src/components/ReportView.jsx` - Test results display
- `src/lib/api.js` - API communication layer

## 🚧 Current Limitations (MVP)

- Daytona workspace integration is stubbed (simulated)
- Tests use simulated delays rather than real network calls
- No authentication or user management
- No test result persistence
- Limited error handling

## 🎯 Future Enhancements

- [ ] Real Daytona API integration
- [ ] Database for test history
- [ ] User authentication
- [ ] Custom test configuration
- [ ] Scheduled recurring tests
- [ ] Slack/email notifications
- [ ] More chaos test types (CPU spike, memory leak, etc.)
- [ ] Multi-region testing
- [ ] CI/CD integration

## 📝 License

MIT

## 🤝 Contributing

This is a 6-hour MVP. Contributions welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ in 6 hours



