import { motion } from 'framer-motion';
import { TID } from '../constants/testIds';

export default function ProgressBar({ completed, total }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="w-full max-w-md mx-auto relative z-10 mb-6 px-2">
      <div className="flex items-center justify-between mb-2 text-sm font-bold text-love-burgundy">
        <span data-testid={TID.progressLabel} className="font-body">
          {completed} / {total} complete
        </span>
        <span className="font-script text-2xl text-love-blushActive leading-none">{pct}%</span>
      </div>
      <div
        data-testid={TID.progressBar}
        className="w-full h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/70 shadow-inner"
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FFB6C1 0%, #E6A4D4 60%, #C9B8F0 100%)',
            boxShadow: '0 0 12px rgba(255, 138, 157, 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
