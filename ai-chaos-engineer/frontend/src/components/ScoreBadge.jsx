/**
 * ScoreBadge Component
 * Displays the stability score with color-coded styling
 */
export default function ScoreBadge({ score, status, size = 'large' }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  // Size variants
  const sizeClasses = {
    small: {
      container: 'p-4',
      score: 'text-3xl',
      divider: 'text-sm',
      status: 'text-xs px-3 py-1'
    },
    medium: {
      container: 'p-6',
      score: 'text-4xl',
      divider: 'text-base',
      status: 'text-sm px-3 py-1.5'
    },
    large: {
      container: 'p-10',
      score: 'text-6xl',
      divider: 'text-xl',
      status: 'text-sm px-4 py-2'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.large;

  return (
    <div className={`bg-white rounded-2xl border ${getScoreBgColor(score)} ${sizes.container}`}>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Stability Score</p>
        <div className={`${sizes.score} font-semibold ${getScoreColor(score)} mb-3`}>
          {score}
        </div>
        <div className={`${sizes.divider} text-gray-500 mb-6`}>/ 100</div>
        {status && (
          <div className={`inline-block ${sizes.status} rounded-full font-medium border ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

