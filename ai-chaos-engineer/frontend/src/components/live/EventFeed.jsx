import { motion, AnimatePresence } from 'framer-motion';

const EVENT_ICONS = {
  log: '📝',
  browser_event: '🌐',
  test_start: '🚀',
  test_complete: '✅',
  error: '❌',
  stability: '📊',
  screenshot: '📸',
  video: '🎥',
};

const LEVEL_COLORS = {
  success: 'text-green-400 border-green-700 bg-green-950',
  info: 'text-blue-400 border-blue-700 bg-blue-950',
  warning: 'text-yellow-400 border-yellow-700 bg-yellow-950',
  error: 'text-red-400 border-red-700 bg-red-950',
};

export default function EventFeed({ events }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getEventMessage = (event) => {
    if (event.message) return event.message;
    if (event.action) return `${event.action} → ${event.target}`;
    if (event.testName) return `${event.testName} ${event.url ? `for ${event.url}` : ''}`;
    if (event.type === 'stability') return `Stability: ${event.value}%`;
    return 'Unknown event';
  };

  const getEventLevel = (event) => {
    if (event.level) return event.level;
    if (event.type === 'error') return 'error';
    if (event.type === 'test_start') return 'info';
    if (event.type === 'test_complete') return event.result?.passed ? 'success' : 'error';
    if (event.success === false) return 'error';
    return 'info';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>📡</span>
        <span>Real-Time Event Feed</span>
        <span className="text-sm text-gray-400 font-normal">({events.length})</span>
      </h2>

      <div className="space-y-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {events.map((event, index) => {
            const level = getEventLevel(event);
            const colorClass = LEVEL_COLORS[level] || LEVEL_COLORS.info;
            const icon = EVENT_ICONS[event.type] || '•';

            return (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg border ${colorClass} font-mono text-sm flex items-start gap-3`}
              >
                <span className="text-xl flex-shrink-0">{icon}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium break-words">{getEventMessage(event)}</p>
                    <span className="text-xs opacity-60 whitespace-nowrap">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  
                  {/* Additional details */}
                  {event.error && (
                    <p className="text-xs opacity-75 mt-1">Error: {event.error}</p>
                  )}
                  
                  {event.result && (
                    <p className="text-xs opacity-75 mt-1">
                      Result: {event.result.message} ({event.result.duration}ms)
                    </p>
                  )}
                  
                  {event.context && (
                    <p className="text-xs opacity-75 mt-1">Context: {event.context}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}

