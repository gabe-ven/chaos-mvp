import { useState, useEffect, useRef } from 'react';
import EventFeed from '../components/live/EventFeed';
import StabilityScore from '../components/live/StabilityScore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

export default function LiveDashboard() {
  const [events, setEvents] = useState([]);
  const [stability, setStability] = useState(100);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  // Connect to WebSocket
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      console.log('Connecting to WebSocket:', WS_URL);
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        addEvent({
          type: 'log',
          message: 'Connected to real-time monitoring',
          level: 'success',
          timestamp: Date.now()
        });
      };

      ws.current.onmessage = (message) => {
        try {
          const event = JSON.parse(message.data);
          console.log('[WebSocket] Received:', event);
          
          addEvent(event);

          // Update stability score
          if (event.type === 'stability') {
            setStability(event.value);
          }

          // Calculate stability from test results
          if (event.type === 'test_complete') {
            if (!event.result.passed) {
              setStability(prev => Math.max(0, prev - 10));
            } else {
              setStability(prev => Math.min(100, prev + 2));
            }
          }

          // Decrease stability on errors
          if (event.level === 'error' || event.type === 'error') {
            setStability(prev => Math.max(0, prev - 5));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        addEvent({
          type: 'log',
          message: 'Disconnected from server. Reconnecting...',
          level: 'warning',
          timestamp: Date.now()
        });
        
        // Reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addEvent({
          type: 'log',
          message: 'WebSocket connection error',
          level: 'error',
          timestamp: Date.now()
        });
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
    }
  };

  const addEvent = (event) => {
    setEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                AI Chaos Engineer
                <span className="text-blue-400 text-xl">Live</span>
              </h1>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-400">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <StabilityScore score={stability} />
              
              <a
                href="/"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventFeed events={events} />
        
        {/* Empty State */}
        {events.length === 0 && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 border border-gray-700 text-center">
            <div className="text-6xl mb-4">📡</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Waiting for Chaos Events...
            </h2>
            <p className="text-gray-400 mb-6">
              Run a chaos test from the main dashboard to see real-time events here.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <span>Go to Dashboard</span>
              <span>→</span>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

