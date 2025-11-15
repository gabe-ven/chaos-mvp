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

# Daytona (optional - stubbed for MVP)
DAYTONA_API_KEY=your_api_key
DAYTONA_API_URL=https://api.daytona.io

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

## API Endpoints

- `POST /run` - Run chaos tests
- `GET /health` - Health check



