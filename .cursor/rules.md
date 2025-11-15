You are helping build a 6-hour hackathon MVP called AI Chaos Engineer.
Please generate clean, readable code inside this structure:

/backend
/frontend


All backend code goes into /backend.
All frontend code goes into /frontend.

Keep everything simple, human-readable, and MVP-friendly.

📂 Required Project Structure
backend/
backend/
├─ package.json
├─ src/
│  ├─ index.js
│  ├─ chaosTests.js
│  ├─ daytonaClient.js
│  ├─ reportBuilder.js
│  ├─ utils/
│  │   └─ timers.js
├─ tests/
│  └─ chaosTests.test.js
├─ .env.example
└─ README.md

frontend/
frontend/
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ src/
│  ├─ App.jsx
│  ├─ components/
│  │    ├─ RunForm.jsx
│  │    ├─ ScoreBadge.jsx
│  │    └─ ReportViewer.jsx
│  └─ index.css
└─ README.md

🎯 Goal of the App

The user enters a URL or GitHub repo →
Backend stubs a Daytona workspace →
Runs 3 small chaos tests →
Calculates a Stability Score (0–100) →
Returns JSON →
Frontend displays score + JSON.

This is an MVP, so using fake/stubbed chaos results is OK.

🛠 Backend Requirements (inside /backend)
1. /run endpoint

Must:

Accept { url: string }

Validate URL

Create Daytona workspace (stub)

Run chaos tests:

injectLatency(url)

loadSpike(url)

uiCheck(url)

Build final Stability Score report

Return JSON like:

{
  "stability_score": 82,
  "raw_results": { ... },
  "summary": "...",
  "issues": [],
  "recommendations": []
}

2. Daytona Stub (daytonaClient.js)

Return something like:

{
  "workspaceId": "stub-workspace",
  "publicUrl": "https://preview.stub.daytona.io"
}


Also include a waitForReady() stub that resolves after a small timeout.

3. Chaos Tests (chaosTests.js)

All chaos test functions should return fake but well-structured data:

injectLatency(url)
{
  "load_time_ms": 1200,
  "load_time_with_latency_ms": 3200,
  "errors": []
}

loadSpike(url)
{
  "p95": 450,
  "failure_rate": 0.10
}

uiCheck(url)
{
  "broken_routes": [],
  "console_errors": []
}


Comment inside your code what each test simulates.

4. Stability Score (reportBuilder.js)

Use this formula:

score = 100
- (failure_rate * 0.5)
- (#errors * 2)
- (broken_routes * 5)
- latency_penalty


Return a structured object with:

stability_score

summary

issues

recommendations

raw_results

5. Jest Tests (inside /backend/tests)

Create simple unit tests for:

injectLatency()

waitForReady()

buildReport()

🎨 Frontend Requirements (inside /frontend)

The UI only needs:

Input field for URL

“Run Chaos Test” button

Score Badge (color-coded)

JSON Viewer

Use React + Tailwind.

Components
<RunForm />

Text input

Submit button

Calls backend /run

<ScoreBadge />

Circular badge

Color-coded:

green → score > 80

yellow → 50–80

red → < 50

<ReportViewer />

Card UI

Scrollable <pre> block for JSON

📐 General Rules

Cursor must follow these rules:

Write clean, human-readable code

Add comments in all files

Keep backend <300 lines

Keep frontend <200 lines

All API responses must be valid JSON

Do not overbuild — this is a hackathon MVP

🚀 What Cursor Should Output

Full backend implementation

Full frontend implementation

Daytona stub

Chaos test functions

Report builder

Jest tests

Clean Tailwind UI components

Working /run endpoint

README instructions