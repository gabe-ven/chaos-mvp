import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useWebSocket Hook
 * 
 * Manages WebSocket connection for real-time test progress updates.
 * Handles connection, reconnection, message parsing, and cleanup.
 * 
 * Features:
 * - Automatic reconnection on disconnect
 * - Message queue management
 * - Connection status tracking
 * - Error handling and logging
 * 
 * @param {string} url - WebSocket server URL
 * @returns {Object} - WebSocket state and utilities
 * @returns {boolean} returns.isConnected - Whether WebSocket is connected
 * @returns {Array} returns.messages - Array of all received messages
 * @returns {Object|null} returns.lastMessage - Most recent message received
 * @returns {Function} returns.clearMessages - Function to clear message history
 * @returns {Function} returns.reconnect - Function to manually reconnect
 * 
 * @example
 * const { isConnected, lastMessage } = useWebSocket('ws://localhost:3001/ws');
 * 
 * useEffect(() => {
 *   if (lastMessage?.type === 'test_progress') {
 *     console.log('Test progress:', lastMessage);
 *   }
 * }, [lastMessage]);
 */
export function useWebSocket(url) {
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  
  // Refs for WebSocket instance and reconnection logic
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  /**
   * Manual reconnect function
   * Allows components to trigger reconnection
   */
  const reconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
    reconnectAttempts.current = 0;
  }, []);

  /**
   * Clear all messages from state
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);

  /**
   * WebSocket connection management
   * Handles connection, reconnection logic, and message processing
   */
  useEffect(() => {
    if (!url) {
      console.warn('[Frontend WebSocket] No URL provided, skipping connection');
      return;
    }

    console.log('[Frontend WebSocket] Attempting connection to:', url);
    
    /**
     * Establish WebSocket connection
     * Implements exponential backoff for reconnection
     */
    const connect = () => {
      // Don't reconnect if we've exceeded max attempts
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('[Frontend WebSocket] Max reconnection attempts reached. Please refresh the page.');
        return;
      }

      try {
        // Create new WebSocket connection
        ws.current = new WebSocket(url);

        /**
         * Handle connection opened
         */
        ws.current.onopen = () => {
          console.log('[Frontend WebSocket] ✅ CONNECTED to:', url);
          console.log('[Frontend WebSocket] Ready to receive messages');
          setIsConnected(true);
          reconnectAttempts.current = 0; // Reset attempts on successful connection
        };

        /**
         * Handle incoming messages
         * Parses JSON and updates state
         */
        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[Frontend WebSocket] 📨 Message received:', data.type, data);
            
            // Update state with new message
            setLastMessage(data);
            setMessages(prev => {
              // Keep only last 100 messages to prevent memory issues
              const updated = [...prev, data];
              return updated.slice(-100);
            });
            
            // Special handling for different message types
            if (data.type === 'browser_action') {
              console.log(`[Frontend] 🤖 Browser AI: ${data.action} - ${data.message}`);
            } else if (data.type === 'test_start') {
              console.log('[Frontend] 🚀 Test started:', data.url);
            } else if (data.type === 'test_complete') {
              console.log('[Frontend] ✅ Test completed');
            }
          } catch (error) {
            console.error('[Frontend WebSocket] Failed to parse message:', error);
            console.error('[Frontend WebSocket] Raw message:', event.data);
          }
        };

        /**
         * Handle connection closed
         * Implements reconnection with exponential backoff
         */
        ws.current.onclose = (event) => {
          console.log('[Frontend WebSocket] ❌ Disconnected', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          
          setIsConnected(false);
          
          // Only reconnect if it wasn't a clean close and we haven't exceeded max attempts
          if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            const delay = reconnectDelay * Math.pow(2, reconnectAttempts.current - 1); // Exponential backoff
            
            console.log(`[Frontend WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`);
            
            reconnectTimeout.current = setTimeout(() => {
              connect();
            }, delay);
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error('[Frontend WebSocket] Max reconnection attempts reached');
          }
        };

        /**
         * Handle connection errors
         */
        ws.current.onerror = (error) => {
          console.error('[Frontend WebSocket] ⚠️ WebSocket error:', error);
          console.error('[Frontend WebSocket] Connection URL:', url);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('[Frontend WebSocket] Failed to create connection:', error);
        setIsConnected(false);
      }
    };
    
    // Initial connection
    connect();

    /**
     * Cleanup function
     * Closes WebSocket and clears reconnection timeout
     */
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
      if (ws.current) {
        console.log('[Frontend WebSocket] Closing connection');
        ws.current.close();
        ws.current = null;
      }
      setIsConnected(false);
    };
  }, [url]);

  return {
    isConnected,
    messages,
    lastMessage,
    clearMessages,
    reconnect
  };
}

