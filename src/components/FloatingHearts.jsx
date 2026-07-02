import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { TID } from '../constants/testIds';

// Generates a fixed set of floating hearts with randomized properties.
const HEART_COUNT = 18;

export default function FloatingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: HEART_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 26,
      duration: 14 + Math.random() * 14,
      delay: Math.random() * 12,
      drift: (Math.random() - 0.5) * 80,
      opacity: 0.35 + Math.random() * 0.45,
      hue: Math.random() > 0.6 ? '#E6A4D4' : '#FF9EAE',
    }));
  }, []);

  return (
    <div
      data-testid={TID.floatingHearts}
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="floating-heart"
          style={{ left: `${h.left}%`, color: h.hue, opacity: h.opacity }}
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{
            y: '-110vh',
            x: [0, h.drift, -h.drift / 2, h.drift, 0],
            rotate: [0, 15, -10, 20, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Heart fill="currentColor" strokeWidth={0} size={h.size} />
        </motion.div>
      ))}
    </div>
  );
}
