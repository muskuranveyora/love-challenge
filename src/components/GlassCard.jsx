import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card w-full max-w-md mx-auto p-8 sm:p-10 rounded-[28px] relative z-10 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
