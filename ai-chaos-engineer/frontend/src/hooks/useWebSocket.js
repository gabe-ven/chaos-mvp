import { useEffect, useRef, useState } from 'react';

/**
 * Hook for WebSocket connection to receive live test updates
 */
export function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('[WebSocket] Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WebSocket] Message received:', data);
        setLastMessage(data);
        setMessages(prev => [...prev, data]);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const clearMessages = () => setMessages([]);

  return {
    isConnected,
    messages,
    lastMessage,
    clearMessages
  };
}

