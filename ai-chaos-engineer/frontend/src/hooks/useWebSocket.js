import { useEffect, useRef, useState } from 'react';

/**
 * Hook for WebSocket connection to receive live test updates
 */
export function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    console.log('[Frontend WebSocket] Attempting connection to:', url);
    
    const connect = () => {
      try {
        // Connect to WebSocket
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
          console.log('[Frontend WebSocket] ✅ CONNECTED to:', url);
          console.log('[Frontend WebSocket] Ready to receive messages');
          setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[Frontend WebSocket] 📨 Message received:', data.type);
            setLastMessage(data);
            setMessages(prev => [...prev, data]);
            
            // If it's a browser action, log it prominently
            if (data.type === 'browser_action') {
              console.log(`[Frontend] 🤖 Browser AI: ${data.action} - ${data.message}`);
            }
          } catch (error) {
            console.error('[Frontend WebSocket] Failed to parse message:', error);
          }
        };

        ws.current.onclose = () => {
          console.log('[Frontend WebSocket] ❌ Disconnected - will reconnect in 3s');
          setIsConnected(false);
          
          // Auto-reconnect after 3 seconds
          reconnectTimeout.current = setTimeout(() => {
            console.log('[Frontend WebSocket] Reconnecting...');
            connect();
          }, 3000);
        };

        ws.current.onerror = (error) => {
          console.error('[Frontend WebSocket] ⚠️ Error:', error);
          console.error('[Frontend WebSocket] URL:', url);
        };
      } catch (error) {
        console.error('[Frontend WebSocket] Failed to create connection:', error);
      }
    };
    
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        console.log('[Frontend WebSocket] Closing connection');
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

