# AI Chaos Engineer - Backend

Express API server for running chaos engineering tests.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Run

```bash
# Development mode (with watch)
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development

# No workspace deployment needed - tests run on live URLs directly

# AI Analysis (optional - choose one)
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
# OR
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Error Tracking (optional)
SENTRY_DSN=your_sentry_dsn
```

**Note**: All API keys are optional. The system will work with fallback logic if keys are not provided.

## Chaos Tests

The system runs **8 comprehensive chaos tests**:

1. **Latency Injection** - Simulates network delays
2. **Load Spike** - Tests concurrent request handling
3. **UI Check** - Validates URL accessibility
4. **Memory Leak Test** - Checks for resource cleanup issues
5. **CPU Spike Test** - Tests processing under load
6. **Rate Limit Test** - Validates burst request handling
7. **Error Recovery Test** - Tests resilience and recovery
8. **Cascading Failure Test** - Checks failure isolation

## API Endpoints

- `POST /run` - Run chaos tests
- `GET /health` - Health check



