/**
 * Event Broadcasting Utilities
 * Helper functions for sending different event types
 */

// Import broadcast function (set by server.js)
const getBroadcast = () => global.broadcastUpdate;

/**
 * Send a log message
 */
export function sendLog(message, level = 'info') {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'log',
      message,
      level,
      timestamp: Date.now()
    });
  }
}

/**
 * Send a browser event
 */
export function sendBrowserEvent(action, target, success = true, error = null) {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'browser_event',
      action,
      target,
      success,
      error,
      timestamp: Date.now()
    });
  }
}

/**
 * Update stability score
 */
export function sendStability(value) {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'stability',
      value: Math.max(0, Math.min(100, value)),
      timestamp: Date.now()
    });
  }
}

/**
 * Send screenshot notification
 */
export function sendScreenshot(filename, description = '') {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'screenshot',
      filename,
      url: `http://localhost:8080/screenshots/${filename}`,
      description,
      timestamp: Date.now()
    });
  }
}

/**
 * Send video notification
 */
export function sendVideo(filename, description = '') {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'video',
      filename,
      url: `http://localhost:8080/videos/${filename}`,
      description,
      timestamp: Date.now()
    });
  }
}

/**
 * Send test completion
 */
export function sendTestComplete(summary) {
  const broadcast = getBroadcast();
  if (broadcast) {
    broadcast({
      type: 'test_complete',
      summary,
      timestamp: Date.now()
    });
  }
}

