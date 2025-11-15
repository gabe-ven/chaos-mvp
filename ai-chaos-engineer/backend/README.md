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
DAYTONA_API_KEY=your_api_key
DAYTONA_API_URL=https://api.daytona.io
NODE_ENV=development
```

## API Endpoints

- `POST /run` - Run chaos tests
- `GET /health` - Health check



