/**
 * LoadingSkeleton Component
 * 
 * Provides skeleton loading states for better perceived performance.
 * Shows placeholder content while data is loading to improve UX.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Skeleton variant ('card', 'text', 'circle', 'rect')
 * @param {number} props.width - Width of skeleton (default: '100%')
 * @param {number} props.height - Height of skeleton (default: '1rem')
 * @param {string} props.className - Additional CSS classes
 */
export default function LoadingSkeleton({ 
  variant = 'rect', 
  width = '100%', 
  height = '1rem',
  className = '' 
}) {
  const baseClasses = 'animate-pulse bg-neutral-800 rounded';
  
  const variantClasses = {
    card: 'rounded-xl p-4',
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * CardSkeleton Component
 * 
 * Skeleton loader for card components
 */
export function CardSkeleton() {
  return (
    <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950/80 space-y-4">
      <LoadingSkeleton variant="text" width="60%" height="1.5rem" />
      <LoadingSkeleton variant="text" width="100%" height="1rem" />
      <LoadingSkeleton variant="text" width="80%" height="1rem" />
    </div>
  );
}

/**
 * TestCardSkeleton Component
 * 
 * Skeleton loader for test result cards
 */
export function TestCardSkeleton() {
  return (
    <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/50 space-y-3">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" width="40%" height="1rem" />
        <LoadingSkeleton variant="circle" width="1.5rem" height="1.5rem" />
      </div>
      <LoadingSkeleton variant="text" width="70%" height="0.875rem" />
    </div>
  );
}

/**
 * ReportSkeleton Component
 * 
 * Skeleton loader for full report view
 */
export function ReportSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Score Card Skeleton */}
      <div className="border border-neutral-800 rounded-2xl p-8 bg-neutral-950/90">
        <LoadingSkeleton variant="text" width="30%" height="0.75rem" className="mx-auto mb-4" />
        <LoadingSkeleton variant="text" width="20%" height="4rem" className="mx-auto mb-2" />
        <LoadingSkeleton variant="text" width="15%" height="1.25rem" className="mx-auto" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Summary Skeleton */}
      <CardSkeleton />

      {/* Test Results Skeleton */}
      <div className="border border-neutral-900 rounded-xl p-6 space-y-3">
        <LoadingSkeleton variant="text" width="25%" height="1rem" />
        {[1, 2, 3, 4].map((i) => (
          <TestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

