import { useEffect, useState } from 'react';

/**
 * Live chaos injection stream - shows tests running in real-time
 */
export default function ChaosStream({ events, isActive }) {
  const [visibleEvents, setVisibleEvents] = useState([]);

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1];
      setVisibleEvents(prev => [...prev.slice(-4), latestEvent]); // Keep last 5
    }
  }, [events]);

  if (!isActive && visibleEvents.length === 0) {
    return null;
  }

  const getEventIcon = (testName) => {
    const icons = {
      'Latency Injection': '⚡',
      'Load Spike': '📈',
      'UI Check': '🎨',
      'Memory Leak': '🧠',
      'CPU Spike': '⚙️',
      'Rate Limiting': '🚦',
      'Error Recovery': '🔄',
      'Cascading Failure': '⛓️'
    };
    return icons[testName] || '🔥';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-full z-50">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-semibold">LIVE CHAOS STREAM</span>
          </div>
          {isActive && (
            <div className="text-xs text-gray-400">Running...</div>
          )}
        </div>

        {/* Events Stream */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {visibleEvents.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-8">
              Waiting for chaos tests...
            </div>
          )}
          
          {visibleEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg animate-slideIn"
            >
              <span className="text-2xl">{getEventIcon(event.testName)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {event.testName}
                </div>
                <div className="text-gray-400 text-xs">
                  {event.status === 'running' && 'Injecting chaos...'}
                  {event.status === 'passed' && '✓ Passed'}
                  {event.status === 'failed' && '✗ Failed'}
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isActive && (
          <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-600 border-t-blue-500"></div>
              <span>Chaos engineering in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

