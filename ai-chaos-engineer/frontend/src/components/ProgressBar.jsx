/**
 * ProgressBar Component
 * 
 * Displays a progress bar for visual feedback on task completion.
 * Supports animated progress updates and custom styling.
 * 
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress value (0-100)
 * @param {string} props.label - Optional label text
 * @param {string} props.color - Color variant ('blue', 'green', 'yellow', 'red')
 * @param {boolean} props.showPercentage - Whether to show percentage text
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
export default function ProgressBar({ 
  progress = 0, 
  label, 
  color = 'blue',
  showPercentage = true,
  size = 'md'
}) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500'
  };

  return (
    <div className="w-full space-y-1">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-neutral-400">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="font-mono">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-neutral-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} transition-all duration-300 ease-out rounded-full ${sizeClasses[size]}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="sr-only">{clampedProgress}% complete</span>
        </div>
      </div>
    </div>
  );
}

