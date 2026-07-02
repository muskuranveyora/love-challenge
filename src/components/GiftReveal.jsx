import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';
import { TID } from "../constants/testIds";
import { sounds } from "../lib/sounds";
import { heartBlast } from "../lib/confetti";
export default function GiftReveal({ onOpen }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    sounds.unwrap();
    heartBlast();
    setTimeout(() => onOpen(), 1300);
  };

  return (
    <GlassCard data-testid={TID.giftScreen}>
      <div className="flex flex-col items-center text-center gap-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-3xl text-love-burgundy leading-tight"
        >
          You did it, all 5 done!
        </motion.p>
        <p className="font-body text-sm text-love-muted -mt-3">tap the box below to open your surprise</p>

        <motion.button
          type="button"
          data-testid={TID.giftOpenBtn}
          onClick={handleOpen}
          whileHover={{ scale: opening ? 1 : 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative outline-none"
          aria-label="Open gift box"
        >
          <motion.div
            data-testid={TID.giftBox}
            animate={
              opening
                ? { rotate: [0, -8, 8, -8, 8, 0], scale: [1, 1.05, 1.1, 1.15, 1.2, 0] }
                : { y: [0, -6, 0] }
            }
            transition={
              opening
                ? { duration: 1.2, ease: 'easeInOut' }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative w-56 h-56 sm:w-64 sm:h-64"
          >
            {/* Box base */}
            <div className="absolute inset-x-0 bottom-0 h-[60%] rounded-2xl bg-gradient-to-br from-[#FF9EAE] via-[#FFB6C1] to-[#FFC8DD] shadow-[0_16px_40px_rgba(255,138,157,0.5)]" />
            {/* Vertical ribbon */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-[60%] bg-gradient-to-b from-[#E6A4D4] to-[#C9B8F0]" />
            {/* Lid */}
            <motion.div
              animate={opening ? { y: -120, rotate: -25, opacity: [1, 1, 0] } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-x-0 top-[28%] h-[16%] rounded-xl bg-gradient-to-br from-[#FFB6C1] to-[#FF8A9D] shadow-md"
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-full bg-gradient-to-b from-[#E6A4D4] to-[#C9B8F0]" />
            </motion.div>
            {/* Bow */}
            <motion.div
              animate={opening ? { y: -150, rotate: 40, opacity: 0 } : { rotate: [-2, 2, -2] }}
              transition={opening ? { duration: 1, ease: 'easeOut' } : { duration: 3, repeat: Infinity }}
              className="absolute left-1/2 -translate-x-1/2 top-[18%] w-20 h-12"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6A4D4] to-[#C9B8F0] shadow-md z-10" />
                <div className="absolute -left-1 w-10 h-7 rounded-full bg-gradient-to-br from-[#E6A4D4] to-[#C9B8F0] -rotate-12 shadow-md" />
                <div className="absolute -right-1 w-10 h-7 rounded-full bg-gradient-to-br from-[#E6A4D4] to-[#C9B8F0] rotate-12 shadow-md" />
              </div>
            </motion.div>

            {/* Sparkles flying out when opening */}
            {opening && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      x: (Math.random() - 0.5) * 220,
                      y: -120 - Math.random() * 160,
                      opacity: [0, 1, 0],
                      scale: [0, 1.3, 0.5],
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1.2, delay: i * 0.05, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 text-yellow-400"
                  >
                    <Sparkles fill="#FFD56B" strokeWidth={0} size={22} />
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>

          {!opening && (
            <motion.div
              animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-yellow-400"
            >
              <Sparkles fill="#FFD56B" strokeWidth={0} size={28} />
            </motion.div>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={opening}
          className="font-body text-sm font-bold text-love-blushActive hover:text-love-burgundy transition-colors flex items-center gap-2"
        >
          <Gift size={16} /> {opening ? 'opening...' : 'tap to open'}
        </motion.button>
      </div>
    </GlassCard>
  );
}
