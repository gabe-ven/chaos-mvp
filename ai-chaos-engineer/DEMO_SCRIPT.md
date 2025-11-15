# AI Chaos Engineer - Demo Script

## Setup (Before Demo)

1. **Start the Backend**
```bash
cd backend
npm install
npm run dev
```
Wait for: `🚀 AI Chaos Engineer backend running on http://localhost:3001`

2. **Start the Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Wait for: `Local: http://localhost:5173`

3. **Open Browser**
Navigate to: `http://localhost:5173`

---

## Demo Flow (3-5 minutes)

### Part 1: Introduction (30 seconds)

**Say:**
> "This is the AI Chaos Engineer - an automated tool that tests your application's resilience through controlled chaos. It spins up isolated workspaces using Daytona, runs chaos tests, and provides AI-powered recommendations to improve stability."

### Part 2: Run a Test (1 minute)

1. **Show the interface**
   - Point out the clean, minimalist design
   - Explain the input field accepts GitHub repos or URLs

2. **Enter a test URL**
   ```
   Example: https://github.com/facebook/react
   Or: https://example.com
   ```

3. **Click "Run Test"**
   - Point out the loading state
   - Mention: "Behind the scenes, we're:"
     - Spinning up a Daytona workspace
     - Running 8 comprehensive chaos tests
     - Collecting performance data
     - Analyzing with AI

### Part 3: Review Results (2 minutes)

Once results appear:

1. **Stability Score**
   - "Here's our stability score - 0 to 100"
   - "Color-coded: Green (excellent), Yellow (good), Orange (fair), Red (poor)"
   - Show the status badge

2. **Summary Section**
   - "Quick overview of test results"
   - Point out total duration (under 90 seconds)

3. **AI Analysis** (if available)
   - "Our AI analyzes all test results"
   - "Provides plain-English summary"
   - "No need to interpret raw metrics"

4. **Recommendations**
   - "Specific, actionable recommendations"
   - "Based on which tests failed"
   - "Prioritized by severity"

5. **Test Results**
   - Scroll to individual test results
   - Show the 8 chaos tests:
     - ⚡ Latency Injection
     - 📈 Load Spike
     - 🎨 UI Check
     - 🧠 Memory Leak
     - ⚙️ CPU Spike
     - 🚦 Rate Limiting
     - 🔄 Error Recovery
     - ⛓️ Cascading Failure

6. **Issues Found**
   - Show severity badges (low, medium, high, critical)
   - Detailed error messages

7. **Raw JSON**
   - Expand the "View Raw JSON" section
   - "Full programmatic access to all data"
   - "Easy to integrate with CI/CD"

### Part 4: Key Features (1 minute)

**Highlight:**

1. **Speed**: "Complete chaos testing in under 90 seconds"

2. **No Setup Required**: "Works out of the box - all API keys optional"
   - Daytona: stubbed if no key
   - AI: falls back to rule-based analysis
   - Sentry: logs locally if no DSN

3. **Comprehensive**: "8 different chaos scenarios covering:"
   - Network resilience
   - Performance under load
   - UI accessibility
   - Resource management
   - Error recovery

4. **Production Ready**:
   - RESTful API
   - React + Tailwind frontend
   - Full test coverage
   - CI/CD ready

### Part 5: Technical Architecture (30 seconds)

**Quick overview:**

**Backend:**
- Node.js + Express
- Daytona workspace integration
- Browser Use for UI testing
- Sentry for error tracking
- Anthropic/OpenAI for AI analysis

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Real-time loading states
- Responsive design

---

## Q&A Prep

### Common Questions:

**Q: Does this require API keys?**
A: No! All integrations are optional. The system gracefully falls back to stub implementations. Perfect for quick demos or testing without credentials.

**Q: How long does a full test run take?**
A: Under 90 seconds from submission to results. We optimized for speed while maintaining comprehensive coverage.

**Q: Can this integrate with CI/CD?**
A: Absolutely. The `/run` endpoint returns JSON. Easy to integrate with GitHub Actions, Jenkins, CircleCI, etc.

**Q: What happens if a test fails?**
A: You get:
1. Detailed error messages
2. Severity classification
3. AI-generated recommendations
4. Specific next steps to fix

**Q: Is this production-ready?**
A: Yes! Features:
- Comprehensive test coverage
- Error handling
- Monitoring with Sentry
- GitHub Actions CI
- Clean architecture
- Full documentation

**Q: How does it compare to manual chaos testing?**
A: Manual chaos testing:
- Takes hours to set up
- Requires deep expertise
- Hard to reproduce
- Inconsistent

AI Chaos Engineer:
- One-click testing
- Automated analysis
- Reproducible results
- Consistent methodology

---

## Demo Tips

1. **Keep it fast** - Don't dwell on loading screens
2. **Show the score first** - It's the most visual element
3. **Explain AI value** - Most people struggle to interpret raw chaos test data
4. **Mention extensibility** - Easy to add more tests
5. **Emphasize speed** - 90 seconds is impressive
6. **Show the API** - Technical audience loves the `/run` endpoint

---

## Backup Plan

If live demo fails:

1. **Show recorded video** (if available)
2. **Walk through screenshots**
3. **Demonstrate API with curl:**

```bash
curl -X POST http://localhost:3001/run \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/facebook/react"}'
```

4. **Show code structure:**
```bash
tree -L 2 backend/src
tree -L 2 frontend/src
```

---

## Post-Demo

**Call to Action:**
- GitHub: `github.com/yourusername/ai-chaos-engineer`
- Try it: `git clone && npm install && npm run dev`
- Contribute: Issues and PRs welcome!
- Follow: Updates and improvements coming soon

**Next Steps:**
- Real Daytona integration
- More chaos test types
- Historical tracking
- Team collaboration features
- Slack/Discord notifications

