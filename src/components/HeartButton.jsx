import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

// Main pill primary button with heart accent.
export function HeartButton({ children, onClick, disabled, testId, type = 'button', icon = true }) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { y: -2, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`relative w-full rounded-full py-4 px-8 font-body font-bold text-lg
        text-white tracking-tight flex items-center justify-center gap-2
        transition-shadow duration-300 select-none
        ${disabled
          ? 'bg-pink-200/70 cursor-not-allowed shadow-none'
          : 'bg-gradient-to-r from-[#FF9EAE] to-[#FF8A9D] shadow-[0_10px_24px_rgba(255,138,157,0.45)] hover:shadow-[0_14px_30px_rgba(255,138,157,0.55)] active:shadow-[0_6px_14px_rgba(255,138,157,0.4)]'
        }`}
    >
      {icon && <Heart fill="white" strokeWidth={0} size={20} />}
      <span>{children}</span>
      {!disabled && <ArrowRight size={20} className="opacity-90" />}
    </motion.button>
  );
}

// Smaller ghost button for secondary actions
export function GhostButton({ children, onClick, testId }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-testid={testId}
      className="text-sm font-body font-semibold text-love-muted hover:text-love-burgundy underline-offset-4 hover:underline transition-colors px-3 py-1.5"
    >
      {children}
    </motion.button>
  );
}
