/**
 * WebSocket server for live test streaming
 */
import { WebSocketServer } from 'ws';

let wss = null;
const clients = new Set();

/**
 * Initialize WebSocket server
 */
export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('[WebSocket] Client connected');
    clients.add(ws);
    
    // Send connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to AI Chaos Engineer live stream'
    }));
    
    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error.message);
      clients.delete(ws);
    });
  });
  
  console.log('[WebSocket] Server initialized on /ws');
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(data) {
  if (!wss) {
    console.log('[WebSocket] No WSS instance, cannot broadcast');
    return;
  }
  
  if (clients.size === 0) {
    console.log('[WebSocket] No connected clients');
    return;
  }
  
  const message = JSON.stringify(data);
  let sent = 0;
  
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      try {
        client.send(message);
        sent++;
      } catch (error) {
        console.error('[WebSocket] Failed to send:', error.message);
      }
    }
  });
  
  if (data.type === 'browser_action') {
    console.log(`[WebSocket] Broadcast to ${sent} clients: ${data.action}`);
  }
}

/**
 * Send test start event
 */
export function notifyTestStart(url) {
  console.log('[WebSocket] Broadcasting test start:', url);
  broadcast({
    type: 'test_start',
    url,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send test progress update
 */
export function notifyTestProgress(testName, status, details = {}) {
  const message = {
    type: 'test_progress',
    testName,
    status, // 'running', 'passed', 'failed'
    details,
    timestamp: new Date().toISOString()
  };
  console.log('[WebSocket] Broadcasting test progress:', { testName, status });
  broadcast(message);
}

/**
 * Send test complete event
 */
export function notifyTestComplete(results) {
  broadcast({
    type: 'test_complete',
    results,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send chaos injection event
 */
export function notifyChaosInjected(chaosType, details) {
  broadcast({
    type: 'chaos_injected',
    chaosType,
    details,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send AI analysis progress update
 */
export function notifyAIProgress(status, message) {
  console.log('[WebSocket] AI Progress:', status, message);
  broadcast({
    type: 'ai_progress',
    status, // 'analyzing', 'complete', 'error'
    message,
    timestamp: new Date().toISOString()
  });
}

