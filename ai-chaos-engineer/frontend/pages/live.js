/**
 * REAL-TIME CHAOS TESTING DASHBOARD
 * Integrated into AI Chaos Engineer
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Reuse existing components with modifications
function LiveDashboard() {
  const [events, setEvents] = useState([]);
  const [stability, setStability] = useState(100);
  const [screenshots, setScreenshots] = useState([]);
  const [videos, setVideos] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Connect to WebSocket on same server
    const ws = new WebSocket('ws://localhost:3001/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to Real-Time Backend');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents(prev => [data, ...prev].slice(0, 100));
        
        switch (data.type) {
          case 'stability':
            setStability(data.value);
            break;
          case 'screenshot':
            setScreenshots(prev => [...prev, data]);
            break;
          case 'video':
            setVideos(prev => [...prev, data]);
            break;
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔥</div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  REAL-TIME CHAOS DASHBOARD
                  {connected ? (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full">
                      ● LIVE
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full">
                      ○ OFFLINE
                    </span>
                  )}
                </h1>
                <div className="flex gap-4 mt-1">
                  <button
                    onClick={() => router.push('/')}
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    ← Back to Main Dashboard
                  </button>
                  <p className="text-sm text-gray-500">
                    Live browser automation monitoring
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500">EVENTS</div>
                <div className="text-xl font-mono font-bold text-white">{events.length}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">SCREENSHOTS</div>
                <div className="text-xl font-mono font-bold text-chaos-400">{screenshots.length}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">VIDEOS</div>
                <div className="text-xl font-mono font-bold text-blue-400">{videos.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Stability Score */}
        <div className="mb-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">⚡ STABILITY SCORE</h2>
            <div className="text-5xl font-mono font-bold text-green-400">
              {stability}<span className="text-2xl text-gray-600">/100</span>
            </div>
          </div>
          <div className="h-8 bg-gray-900 rounded-full overflow-hidden border-2 border-gray-800">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${stability}%` }}
            />
          </div>
        </div>

        {/* Event Feed */}
        <div className="mb-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">📡 LIVE EVENT FEED</h2>
          </div>
          <div className="h-[400px] overflow-y-auto p-4">
            {events.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-600">
                <div className="text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p>Waiting for events...</p>
                  <p className="text-sm mt-1">Start a chaos test to see live updates</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <div className="flex items-center gap-2 text-xs text-blue-400 mb-1">
                      <span>{event.type}</span>
                      <span className="text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-300">{event.message || event.action || JSON.stringify(event)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Screenshots & Videos */}
        <div className="grid grid-cols-2 gap-6">
          {/* Screenshots */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">📸 SCREENSHOTS ({screenshots.length})</h2>
            </div>
            <div className="p-4 h-[300px] overflow-y-auto">
              {screenshots.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                  <p>No screenshots yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {screenshots.map((shot, idx) => (
                    <div key={idx} className="aspect-video bg-gray-900 rounded overflow-hidden border border-gray-800">
                      <img src={shot.url} alt={shot.description} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">🎥 VIDEOS ({videos.length})</h2>
            </div>
            <div className="p-4 h-[300px] overflow-y-auto">
              {videos.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                  <p>No videos yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {videos.map((video, idx) => (
                    <div key={idx} className="aspect-video bg-black rounded overflow-hidden border border-red-500/30">
                      <video controls className="w-full h-full">
                        <source src={video.url} type="video/webm" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LiveDashboard;

