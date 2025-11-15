import { motion } from 'framer-motion';

export default function StabilityScore({ score }) {
  const getColor = () => {
    if (score >= 80) return 'text-green-400 border-green-500 shadow-green-500/50';
    if (score >= 50) return 'text-yellow-400 border-yellow-500 shadow-yellow-500/50';
    return 'text-red-400 border-red-500 shadow-red-500/50';
  };

  const getStatus = () => {
    if (score >= 80) return 'Stable';
    if (score >= 50) return 'Degraded';
    return 'Critical';
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`px-6 py-3 rounded-lg border-2 ${getColor()} bg-gray-900 shadow-lg flex items-center gap-4`}
    >
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">System Stability</p>
        <motion.p
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold"
        >
          {score}%
        </motion.p>
      </div>
      
      <div className="h-12 w-px bg-gray-700" />
      
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
        <p className="text-lg font-semibold">{getStatus()}</p>
      </div>
    </motion.div>
  );
}

