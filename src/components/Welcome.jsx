import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

import GlassCard from "./GlassCard";
import { HeartButton } from "./HeartButton";
import { TID } from "../constants/testIds";

export default function Welcome({ name, onStart }) {
  return (
    <GlassCard data-testid={TID.welcomeScreen}>
      <div className="flex flex-col items-center text-center gap-6">

        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 14,
          }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FF9EAE] flex items-center justify-center shadow-[0_12px_28px_rgba(255,138,157,0.45)]">
            <Heart
              fill="white"
              strokeWidth={0}
              size={48}
            />
          </div>

          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute -top-1 -right-2 text-yellow-400"
          >
            <Sparkles
              fill="#FFD56B"
              strokeWidth={0}
              size={26}
            />
          </motion.div>
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-script text-5xl sm:text-6xl text-love-burgundy leading-none"
          >
            Hi {name} ❤️
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 font-body text-base sm:text-lg text-love-body leading-relaxed"
          >
            Complete these{" "}
            <span className="font-bold text-love-blushActive">
              5 little challenges
            </span>{" "}
            to unlock your final surprise.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-2 font-script text-2xl text-love-muted"
          >
            it'll be worth it, promise.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="w-full mt-2"
        >
          <HeartButton
            onClick={onStart}
            testId={TID.welcomeStartBtn}
          >
            Let's begin
          </HeartButton>
        </motion.div>

      </div>
    </GlassCard>
  );
}