/**
 * Real-Time Chaos Testing Backend
 * WebSocket server for live event streaming + static file serving
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (screenshots & videos)
app.use('/screenshots', express.static(join(__dirname, 'public/screenshots')));
app.use('/videos', express.static(join(__dirname, 'public/videos')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', connections: wss.clients.size });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🔥 Chaos Testing Backend running on http://localhost:${PORT}`);
  console.log(`📁 Screenshots: http://localhost:${PORT}/screenshots/`);
  console.log(`🎥 Videos: http://localhost:${PORT}/videos/`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('✅ New WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'log',
    message: 'Connected to Chaos Testing Server',
    timestamp: Date.now()
  }));
  
  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast function - export for chaos runner to use
export function broadcastUpdate(payload) {
  const message = JSON.stringify({
    ...payload,
    timestamp: payload.timestamp || Date.now()
  });
  
  // Log to terminal
  console.log(`📡 Broadcasting: ${payload.type}`, 
    payload.message || payload.action || payload.value || '');
  
  // Send to all connected clients
  let sent = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
      sent++;
    }
  });
  
  if (sent === 0) {
    console.log('⚠️  No clients connected');
  }
}

// Global export for chaos runner
global.broadcastUpdate = broadcastUpdate;

console.log('');
console.log('🚀 WebSocket server ready on ws://localhost:8080');
console.log('💡 Run chaos tests with: npm run chaos');
console.log('');

