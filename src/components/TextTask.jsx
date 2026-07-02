import { useState } from "react";
import GlassCard from "./GlassCard";
import { HeartButton } from "./HeartButton";
import { TID } from "../constants/testIds";

export default function TextTask({
  taskNum,
  emoji,
  title,
  hint,
  placeholder,
  initialValue = "",
  mode = "chars",
  minSentences = 3,
  minChars = 12,
  buttonLabel = "Continue",
  onComplete,
}) {
  const [value, setValue] = useState(initialValue);

  const sentenceCount = value
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3).length;

  const isValid =
    mode === "sentences"
      ? sentenceCount >= minSentences
      : value.trim().length >= minChars;

  const meta =
    mode === "sentences"
      ? `${sentenceCount} / ${minSentences} sentences`
      : `${value.trim().length} / ${minChars} characters`;

  return (
    <GlassCard data-testid={TID.taskCard(taskNum)}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-2">{emoji}</div>

          <p className="font-script text-2xl text-love-muted mb-1">
            Task {taskNum} of 5
          </p>

          <h2
            data-testid={TID.taskTitle(taskNum)}
            className="font-script text-3xl sm:text-4xl text-love-burgundy leading-tight"
          >
            {title}
          </h2>

          {hint && (
            <p className="mt-2 font-body text-sm text-love-muted">
              {hint}
            </p>
          )}
        </div>

        <div>
          <textarea
            data-testid={TID.textInput(taskNum)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 rounded-2xl bg-white/70 border border-pink-200 text-love-body placeholder:text-love-muted/70 font-body focus:outline-none focus:ring-4 focus:ring-pink-200/60 focus:border-pink-300 transition-all resize-none min-h-[160px] shadow-inner"
          />

          <div className="flex justify-end mt-2">
            <span
              data-testid={TID.textCounter(taskNum)}
              className={`font-body text-xs font-bold transition-colors ${
                isValid ? "text-emerald-500" : "text-love-muted"
              }`}
            >
              {meta}
              {isValid ? " ✓" : ""}
            </span>
          </div>
        </div>

        <HeartButton
          onClick={() => onComplete({ text: value.trim() })}
          disabled={!isValid}
          testId={TID.taskNextBtn(taskNum)}
        >
          {isValid
            ? buttonLabel
            : mode === "sentences"
            ? `Write ${minSentences} sentences`
            : "Write a little more"}
        </HeartButton>
      </div>
    </GlassCard>
  );
}
