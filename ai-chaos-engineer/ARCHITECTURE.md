# 🏗️ Architecture - AI Chaos Engineer

A detailed technical overview of the system architecture.

---

## 📐 System Overview

```
┌─────────────┐         HTTP/REST        ┌─────────────┐
│             │ ───────────────────────> │             │
│   Browser   │                          │   Express   │
│  (React UI) │ <─────────────────────── │   Server    │
│             │         JSON             │             │
└─────────────┘                          └──────┬──────┘
                                                │
                                                ├──> Chaos Tests
                                                ├──> AI Analyzer
                                                ├──> Sentry
                                                └──> Daytona Client
```

---

## 🎯 Component Architecture

### Frontend Layer (React + Vite)

```
┌─────────────────────────────────────────────────┐
│                   App.jsx                       │
│  - Main layout                                  │
│  - State management                             │
│  - Component orchestration                      │
└────────────────┬───────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼─────┐   ┌───────▼──────┐
│  RunForm.jsx│   │ReportView.jsx│
│  - URL input│   │ - Score badge│
│  - Validate │   │ - AI summary │
│  - Submit   │   │ - Recommends │
└─────────────┘   │ - Test list  │
                  │ - Raw JSON   │
                  └──────────────┘
                        │
                  ┌─────▼─────┐
                  │  api.js   │
                  │ - Fetch   │
                  │ - Error   │
                  └───────────┘
```

**Key Features**:
- Single-page application (SPA)
- Real-time loading states
- Error boundaries
- Responsive design
- Dark theme

---

### Backend Layer (Node.js + Express)

```
                    ┌──────────────┐
                    │  index.js    │
                    │  - Routes    │
                    │  - Middleware│
                    │  - CORS      │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼────┐ ┌───────▼────┐ ┌──────▼──────┐
    │  POST /run │ │ GET /health│ │   Sentry    │
    └──────┬─────┘ └────────────┘ │ Middleware  │
           │                       └─────────────┘
           │
    ┌──────▼──────────┐
    │ chaosTests.js   │
    │ - runChaosTests │
    └──────┬──────────┘
           │
    ┌──────┴────────────────────────────┐
    │                                   │
┌───▼────────────┐              ┌───────▼──────┐
│ Daytona Client │              │ Chaos Tests  │
│ - spinUp()     │              ├──────────────┤
│ - tearDown()   │              │ injectLatency│
└────────────────┘              │ loadSpike    │
                                │ uiCheck      │
                                └───────┬──────┘
                                        │
                                ┌───────▼──────┐
                                │ AI Analyzer  │
                                │ - OpenAI     │
                                │ - Claude     │
                                │ - Fallback   │
                                └───────┬──────┘
                                        │
                                ┌───────▼──────┐
                                │Report Builder│
                                │ - Score calc │
                                │ - Status     │
                                │ - Issues     │
                                └──────────────┘
```

---

## 🔄 Request Flow

### 1. User Initiates Test

```
User enters URL → RunForm validates → Calls api.runChaosTest()
                                    ↓
                          POST /run endpoint receives request
```

### 2. Backend Processing

```
index.js receives request
    │
    ├─> Add breadcrumb (Sentry)
    │
    ├─> runChaosTests(url)
    │     │
    │     ├─> spinUpWorkspace() [Daytona]
    │     │     └─> Returns workspace URL (stub)
    │     │
    │     ├─> Promise.all([
    │     │     injectLatency(),
    │     │     loadSpike(),
    │     │     uiCheck()
    │     │   ])
    │     │
    │     └─> Returns test results
    │
    ├─> analyzeResults(testResults) [AI]
    │     │
    │     ├─> Check for API keys
    │     │   ├─> OpenAI available? → Use GPT
    │     │   ├─> Claude available? → Use Claude
    │     │   └─> Neither? → Fallback logic
    │     │
    │     └─> Returns { aiSummary, recommendations }
    │
    ├─> buildReport(testResults, aiAnalysis)
    │     │
    │     ├─> Calculate score (0-100)
    │     ├─> Apply severity penalties
    │     ├─> Determine status
    │     ├─> Collect issues
    │     └─> Include AI analysis
    │
    └─> Return JSON response
```

### 3. Frontend Displays Results

```
Response received → setReport(data)
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    Score Badge                      AI Summary
    - Calculate color                - Display summary
    - Show status                    - List recommendations
    - Animate entry                  - Highlight insights
        │                                 │
        └─────────────┬───────────────────┘
                      │
              ┌───────▼────────┐
              │ Test Results   │
              │ - Pass/Fail    │
              │ - Duration     │
              │ - Issues       │
              └────────────────┘
```

---

## 🧠 AI Analysis Architecture

### Multi-Provider Strategy

```
analyzeResults() called
    │
    ├─> Check environment variables
    │   │
    │   ├─> OPENAI_API_KEY set?
    │   │   └─> Yes → analyzeWithOpenAI()
    │   │             │
    │   │             ├─> Build prompt
    │   │             ├─> Call OpenAI API
    │   │             ├─> Parse response
    │   │             └─> Return structured data
    │   │
    │   ├─> ANTHROPIC_API_KEY set?
    │   │   └─> Yes → analyzeWithClaude()
    │   │             │
    │   │             ├─> Build prompt
    │   │             ├─> Call Claude API
    │   │             ├─> Parse response
    │   │             └─> Return structured data
    │   │
    │   └─> Neither set?
    │       └─> generateFallbackAnalysis()
    │             │
    │             ├─> Analyze test results
    │             ├─> Generate rule-based summary
    │             ├─> Create recommendations
    │             └─> Return structured data
    │
    └─> Unified response format:
        {
          aiSummary: string,
          recommendations: string[]
        }
```

**Key Features**:
- **Provider agnostic** - Same interface for all
- **Graceful degradation** - Always works
- **Cost optimized** - 500 token limit
- **Smart prompting** - Structured output

---

## 📊 Error Tracking (Sentry)

### Integration Points

```
Application Start
    │
    ├─> initSentry()
    │   └─> Check SENTRY_DSN
    │       ├─> Present → Initialize Sentry
    │       └─> Absent → Use console logging
    │
Request Handling
    │
    ├─> sentryRequestHandler() [Middleware]
    │   └─> Add breadcrumb for each request
    │
    ├─> Route Handler
    │   │
    │   ├─> Success path
    │   │   └─> Add success breadcrumb
    │   │
    │   └─> Error path
    │       ├─> captureException(error)
    │       └─> Return error response
    │
    └─> sentryErrorHandler() [Middleware]
        └─> Catch unhandled errors
```

**Captured Data**:
- Exception stack traces
- Request context (URL, method, headers)
- User actions (breadcrumbs)
- Environment info
- Custom context

---

## 🧪 Test Architecture

### Test Coverage

```
Backend Tests
    │
    ├─> chaosTests.test.js
    │   ├─> Test injectLatency()
    │   ├─> Test loadSpike()
    │   ├─> Test uiCheck()
    │   └─> Test runChaosTests()
    │
    ├─> aiAnalyzer.test.js
    │   ├─> Test fallback analysis
    │   ├─> Test recommendation generation
    │   ├─> Test error handling
    │   └─> Test various scenarios
    │
    ├─> reportBuilder.test.js
    │   ├─> Test score calculation
    │   ├─> Test severity penalties
    │   ├─> Test status categorization
    │   ├─> Test AI integration
    │   └─> Test edge cases
    │
    └─> sentry.test.js
        ├─> Test error capture
        ├─> Test message logging
        ├─> Test breadcrumbs
        └─> Test graceful degradation
```

**Total**: 22+ test cases

---

## 🔐 Security Architecture

### Environment-Based Configuration

```
.env file (NOT committed)
    │
    ├─> API Keys (sensitive)
    │   ├─> OPENAI_API_KEY
    │   ├─> ANTHROPIC_API_KEY
    │   └─> SENTRY_DSN
    │
    └─> Configuration (public)
        ├─> PORT
        ├─> NODE_ENV
        └─> API URLs

.env.example file (committed)
    │
    └─> Template with dummy values
```

**Security Features**:
- API keys never committed
- CORS configuration
- Input validation
- Error message sanitization
- Rate limiting ready

---

## 🚀 Deployment Architecture

### Backend Deployment

```
Platform (Railway, Render, Fly.io)
    │
    ├─> Build
    │   └─> npm install
    │
    ├─> Environment Variables
    │   ├─> Set PORT
    │   ├─> Set API keys
    │   └─> Set NODE_ENV=production
    │
    └─> Start
        └─> npm start (node src/index.js)
```

### Frontend Deployment

```
Platform (Vercel, Netlify)
    │
    ├─> Build
    │   ├─> npm install
    │   └─> npm run build
    │       └─> Outputs to /dist
    │
    ├─> Environment Variables
    │   └─> VITE_API_URL=https://backend.railway.app
    │
    └─> Deploy
        └─> Serve static files from /dist
```

---

## 📦 Data Flow

### Test Results Object

```javascript
{
  workspaceUrl: "https://workspace-xyz.daytona.dev",
  totalDuration: 1500,
  tests: [
    {
      test: "Latency Injection",
      passed: true,
      duration: 450,
      message: "Response time: 450ms (acceptable)",
      severity: "low"
    },
    // ... more tests
  ]
}
```

### AI Analysis Object

```javascript
{
  aiSummary: "Your application demonstrates strong resilience...",
  recommendations: [
    "Implement proper timeout handling...",
    "Add circuit breakers...",
    "Set up monitoring..."
  ]
}
```

### Final Report Object

```javascript
{
  score: 85,
  status: "Excellent",
  summary: "3/3 tests passed. Stability score: 85/100",
  aiSummary: "...",              // From AI
  recommendations: [...],         // From AI
  issues: [],                     // Failed tests
  raw: {
    workspaceUrl: "...",
    totalDuration: 1500,
    tests: [...],
    timestamp: "2025-11-15T12:00:00.000Z"
  }
}
```

---

## 🔌 External Integrations

### OpenAI API

```
POST https://api.openai.com/v1/chat/completions
Headers:
  - Authorization: Bearer <OPENAI_API_KEY>
  - Content-Type: application/json
Body:
  - model: gpt-4o-mini
  - messages: [system, user]
  - max_tokens: 500
Response:
  - choices[0].message.content
```

### Anthropic Claude API

```
POST https://api.anthropic.com/v1/messages
Headers:
  - x-api-key: <ANTHROPIC_API_KEY>
  - anthropic-version: 2023-06-01
  - Content-Type: application/json
Body:
  - model: claude-3-5-sonnet-20241022
  - messages: [user]
  - max_tokens: 500
Response:
  - content[0].text
```

### Sentry (Optional)

```
POST https://sentry.io/api/<project>/envelope/
Headers:
  - X-Sentry-Auth: Sentry sentry_key=...
Body:
  - Event data (errors, breadcrumbs, context)
```

### Daytona (Stubbed)

```
POST https://api.daytona.io/workspaces
Headers:
  - Authorization: Bearer <DAYTONA_API_KEY>
Body:
  - url: github repo or web URL
Response:
  - workspace_id, workspace_url
```

---

## 🎯 Design Patterns

### 1. **Fallback Pattern** (AI Analyzer)
```
Try primary → Try secondary → Use fallback
```

### 2. **Middleware Pattern** (Sentry)
```
Request → Middleware → Handler → Middleware → Response
```

### 3. **Factory Pattern** (AI Provider Selection)
```
Check config → Create appropriate analyzer → Execute
```

### 4. **Builder Pattern** (Report Construction)
```
Base report → Add tests → Add AI → Build final
```

### 5. **Singleton Pattern** (Sentry Instance)
```
Single shared instance across application
```

---

## 📈 Performance Considerations

### Backend
- Parallel test execution (`Promise.all`)
- Async/await throughout
- Minimal dependencies
- Fast AI models (gpt-4o-mini)
- 500 token limit for AI

### Frontend
- Vite for fast builds
- Code splitting ready
- Lazy loading support
- Optimized bundle size
- Tailwind CSS purging

### API Efficiency
- Single endpoint for all tests
- Batch processing
- Error caching ready
- Rate limiting ready

---

## 🔄 Extensibility Points

### Add New Chaos Test
```javascript
// In chaosTests.js
export async function newTest(url) {
  // Your test logic
  return {
    test: 'Test Name',
    passed: true/false,
    duration: ms,
    message: 'Description',
    severity: 'low/medium/high/critical'
  };
}

// In runChaosTests()
const tests = await Promise.all([
  injectLatency(url),
  loadSpike(url),
  uiCheck(url),
  newTest(url)  // Add here
]);
```

### Add New AI Provider
```javascript
// In aiAnalyzer.js
async function analyzeWithNewProvider(testData) {
  // API call
  // Parse response
  return { aiSummary, recommendations };
}

// In analyzeResults()
if (process.env.NEW_PROVIDER_KEY) {
  return await analyzeWithNewProvider(testData);
}
```

---

## 🎓 Best Practices Implemented

1. **Separation of Concerns** - Each module has one responsibility
2. **Error Handling** - Try-catch throughout, graceful degradation
3. **Environment Config** - All secrets in .env
4. **Testing** - Comprehensive test coverage
5. **Documentation** - Extensive inline and external docs
6. **Type Safety** - JSDoc comments for IDE support
7. **Security** - Input validation, API key protection
8. **Observability** - Sentry integration, breadcrumbs
9. **Performance** - Parallel execution, optimized builds
10. **Maintainability** - Clean code, modular structure

---

**Architecture built for scale, security, and hackathon success!** 🚀

