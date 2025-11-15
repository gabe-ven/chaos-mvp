# 📦 Install Dependencies - Copy & Paste Commands

## Run these commands in your terminal:

### Backend Dependencies
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm install
```

### Frontend Dependencies
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm install
npm install react-router-dom@^6.20.1 framer-motion@^10.16.16
```

### Configure Environment
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
cp .env.example .env
```

Then edit `backend/.env` and add your Anthropic API key.

---

## All-in-One Command

```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer && \
cd backend && npm install && \
cd ../frontend && npm install && \
npm install react-router-dom@^6.20.1 framer-motion@^10.16.16 && \
cd ../backend && cp .env.example .env && \
echo "✅ Dependencies installed! Edit backend/.env to add your Anthropic API key."
```

---

## Start the Application

**Terminal 1:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/backend
npm run dev
```

**Terminal 2:**
```bash
cd /Users/gabrielvenezia/Desktop/chaos-mvp/ai-chaos-engineer/frontend
npm run dev
```

**Open:** http://localhost:5173

