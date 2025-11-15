import { useEffect, useState } from 'react';

/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages to the user.
 * Automatically dismisses after a specified duration.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message text
 * @param {string} props.type - Toast type ('success', 'error', 'info', 'warning')
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 3000)
 * @param {Function} props.onDismiss - Callback when toast is dismissed
 * @param {boolean} props.show - Whether to show the toast
 */
export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onDismiss,
  show = true 
}) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 300); // Wait for fade-out animation
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) {
    return null;
  }

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${typeStyles[type]} shadow-lg max-w-md`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) {
              setTimeout(onDismiss, 300);
            }
          }}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Toast Container Component
 * 
 * Manages multiple toast notifications
 */
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          show={true}
          onDismiss={() => onDismiss && onDismiss(toast.id || index)}
        />
      ))}
    </div>
  );
}

