/**
 * StatusIndicator Component
 * 
 * Displays connection status, test status, or other state indicators.
 * Provides visual feedback for application state.
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - Status type ('connected', 'disconnected', 'loading', 'error', 'success')
 * @param {string} props.label - Optional label text
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
export default function StatusIndicator({ status, label, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      pulse: true,
      label: label || 'Connected'
    },
    disconnected: {
      color: 'bg-red-500',
      pulse: false,
      label: label || 'Disconnected'
    },
    loading: {
      color: 'bg-blue-500',
      pulse: true,
      label: label || 'Loading...'
    },
    error: {
      color: 'bg-red-500',
      pulse: false,
      label: label || 'Error'
    },
    success: {
      color: 'bg-green-500',
      pulse: false,
      label: label || 'Success'
    }
  };

  const config = statusConfig[status] || statusConfig.disconnected;
  const sizeClass = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClass} ${config.color} rounded-full ${config.pulse ? 'animate-pulse' : ''}`}></div>
        {config.pulse && (
          <div className={`absolute inset-0 ${sizeClass} ${config.color} rounded-full animate-ping opacity-75`}></div>
        )}
      </div>
      {label && (
        <span className="text-xs text-neutral-400">{config.label}</span>
      )}
    </div>
  );
}

