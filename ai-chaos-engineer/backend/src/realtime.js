/**
 * Real-Time WebSocket Streaming
 * Integrated into AI Chaos Engineer backend
 */

import { WebSocketServer } from 'ws';

let wss = null;
let clients = new Set();

/**
 * Initialize WebSocket server on existing HTTP server
 */
export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('✅ WebSocket client connected');
    clients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'log',
      message: 'Connected to AI Chaos Engineer',
      timestamp: Date.now()
    }));
    
    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  console.log('🚀 WebSocket server ready on ws://localhost:3001/ws');
}

/**
 * Broadcast event to all connected clients
 */
export function broadcast(payload) {
  if (!wss || clients.size === 0) return;
  
  const message = JSON.stringify({
    ...payload,
    timestamp: payload.timestamp || Date.now()
  });
  
  let sent = 0;
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
      sent++;
    }
  });
  
  if (sent > 0) {
    console.log(`📡 Broadcast: ${payload.type} (${sent} clients)`);
  }
}

/**
 * Send log message
 */
export function sendLog(message, level = 'info') {
  broadcast({
    type: 'log',
    message,
    level
  });
}

/**
 * Send browser event
 */
export function sendBrowserEvent(action, target, success = true, error = null) {
  broadcast({
    type: 'browser_event',
    action,
    target,
    success,
    error
  });
}

/**
 * Update stability score
 */
export function sendStability(value, reason = '') {
  broadcast({
    type: 'stability',
    value: Math.max(0, Math.min(100, value)),
    reason
  });
}

/**
 * Send screenshot notification
 */
export function sendScreenshot(filename, description = '') {
  broadcast({
    type: 'screenshot',
    filename,
    url: `http://localhost:3001/screenshots/${filename}`,
    description
  });
}

/**
 * Send video notification
 */
export function sendVideo(filename, description = '') {
  broadcast({
    type: 'video',
    filename,
    url: `http://localhost:3001/videos/${filename}`,
    description
  });
}

/**
 * Get connection count
 */
export function getConnectionCount() {
  return clients.size;
}

