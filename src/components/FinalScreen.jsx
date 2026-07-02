import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import GlassCard from './GlassCard';
import { TID } from '../constants/testIds';
import { sounds } from '../lib/sounds';
import { heartBlast, burst } from '../lib/confetti';

export default function FinalScreen({ initialChoice, onChoose, onRestart }) {
  const [choice, setChoice] = useState(initialChoice);

  const handleYes = () => {
    setChoice('yes');
    sounds.success();
    heartBlast();
    setTimeout(heartBlast, 600);
    onChoose('yes');
  };
  const handleMaybe = () => {
    setChoice('maybe');
    sounds.sparkle();
    burst();
    onChoose('maybe');
  };

  return (
    <GlassCard data-testid={TID.finalScreen}>
      <div className="flex flex-col items-center text-center gap-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="text-6xl"
          aria-hidden="true"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-script text-5xl sm:text-6xl text-love-burgundy leading-none"
        >
          Congratulations!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-body text-base text-love-body leading-relaxed"
        >
          You've completed every challenge.<br />
          Your prize is...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="my-2 px-6 py-5 rounded-3xl bg-gradient-to-br from-pink-100/80 to-purple-100/60 border border-white/70"
        >
          <p className="font-script text-3xl sm:text-4xl text-love-burgundy leading-tight">
            A date with me
          </p>
          <p className="font-body text-sm text-love-muted mt-1">
            (if you say yes <Heart fill="#FF8A9D" strokeWidth={0} size={14} className="inline -mt-0.5" />)
          </p>
        </motion.div>

        {choice === 'yes' ? (
          <motion.div
            data-testid={TID.finalCelebration}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl"
            >
              💖
            </motion.div>
            <p className="font-script text-3xl text-love-burgundy">
              you've made my whole month.
            </p>
            <p className="font-body text-sm text-love-muted">
              I'll see you soon, Mehak <Sparkles size={12} className="inline" />
            </p>
          </motion.div>
        ) : choice === 'maybe' ? (
          <motion.div
            data-testid={TID.finalCelebration}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="font-script text-3xl text-love-burgundy">
              i'll take that 😉
            </p>
            <p className="font-body text-sm text-love-muted">
              come back and tap yes whenever you're ready ❤️
            </p>
            <button
              onClick={handleYes}
              className="mt-2 font-body text-sm font-bold text-love-blushActive underline underline-offset-4"
            >
              actually, yes ❤️
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="w-full flex flex-col gap-3 mt-2"
          >
            <motion.button
              type="button"
              data-testid={TID.finalYesBtn}
              onClick={handleYes}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full rounded-full py-4 px-8 font-body font-extrabold text-lg text-white tracking-tight flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF8A9D] to-[#E6A4D4] shadow-[0_12px_28px_rgba(255,138,157,0.5)]"
            >
              <Heart fill="white" strokeWidth={0} size={22} />
              Say Yes
              <Heart fill="white" strokeWidth={0} size={22} />
            </motion.button>
            <motion.button
              type="button"
              data-testid={TID.finalMaybeBtn}
              onClick={handleMaybe}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="w-full rounded-full py-4 px-8 font-body font-bold text-lg text-love-burgundy tracking-tight flex items-center justify-center gap-2 bg-white/80 border border-pink-200 shadow-md"
            >
              Maybe 😉
            </motion.button>
          </motion.div>
        )}

        <button
          type="button"
          data-testid={TID.finalRestartBtn}
          onClick={onRestart}
          className="mt-2 text-xs font-body text-love-muted hover:text-love-burgundy transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={12} /> restart the journey
        </button>
      </div>
    </GlassCard>
  );
}
