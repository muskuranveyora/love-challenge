import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, RefreshCw } from "lucide-react";

import GlassCard from "./GlassCard";
import { HeartButton } from "./HeartButton";
import { TID } from "../constants/testIds";
import { sounds } from "../lib/sounds";
import { uploadFile } from "../lib/cloudinary";

const MAX_SECONDS = 15;

function formatTime(s) {
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `0:${ss}`;
}

export default function AudioTask({ taskNum, emoji, title, hint, onComplete }) {
  const [status, setStatus] = useState("idle"); // idle | recording | recorded | playing
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const audioElRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl?.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const start = async () => {
    setError(null);
    sounds.heart();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });

        const previewUrl = URL.createObjectURL(blob);
        setAudioUrl(previewUrl);
        setStatus("recorded");
        setUploading(true);

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        try {
          const file = new File([blob], `voice-${Date.now()}.webm`, {
            type: blob.type || "audio/webm",
          });
          const cloudUrl = await uploadFile(file);
          if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
          setAudioUrl(cloudUrl);
          sounds.success();
        } catch (err) {
          console.error(err);
          if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
          setAudioUrl(null);
          setStatus("idle");
          setError("Voice upload failed. Please record again.");
        } finally {
          setUploading(false);
        }
      };

      mr.start();
      setStatus("recording");
      setElapsed(0);
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const e = (Date.now() - startedAt) / 1000;
        setElapsed(e);
        if (e >= MAX_SECONDS) {
          stop();
        }
      }, 100);
    } catch (err) {
      setError("Microphone permission denied. Please allow microphone access in your browser to continue.");
      setStatus("idle");
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlay = () => {
    const el = audioElRef.current;
    if (!el || uploading) return;
    if (el.paused) {
      el.play();
      setStatus("playing");
    } else {
      el.pause();
      setStatus("recorded");
    }
  };

  const reRecord = () => {
    if (uploading) return;
    if (audioUrl?.startsWith("blob:")) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setStatus("idle");
    setError(null);
    sounds.pop();
  };

  const remaining = Math.max(0, MAX_SECONDS - elapsed);

  return (
    <GlassCard data-testid={TID.taskCard(taskNum)}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-2" aria-hidden="true">
            {emoji}
          </div>
          <p className="font-script text-2xl text-love-muted mb-1">
            Task {taskNum} of 5
          </p>
          <h2
            data-testid={TID.taskTitle(taskNum)}
            className="font-script text-3xl sm:text-4xl text-love-burgundy leading-tight"
          >
            {title}
          </h2>
          {hint && <p className="mt-2 font-body text-sm text-love-muted">{hint}</p>}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-6 rounded-3xl bg-white/40 border border-white/70">
          <div
            data-testid={TID.audioTimer}
            className="font-script text-5xl text-love-burgundy tabular-nums leading-none"
          >
            {uploading
              ? "0:00"
              : status === "recording"
                ? formatTime(remaining)
                : audioUrl
                  ? formatTime(elapsed)
                  : "0:15"}
          </div>
          <div className="font-body text-xs text-love-muted uppercase tracking-widest">
            {uploading
              ? "uploading voice..."
              : status === "recording"
                ? "recording..."
                : audioUrl
                  ? "your voice note"
                  : "tap to record (max 15s)"}
          </div>

          {status === "recording" ? (
            <motion.button
              type="button"
              onClick={stop}
              data-testid={TID.audioStopBtn}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8A9D] to-[#E6A4D4] flex items-center justify-center shadow-[0_10px_28px_rgba(255,138,157,0.6)] heart-pulse"
              aria-label="Stop recording"
            >
              <Square fill="white" strokeWidth={0} size={26} />
            </motion.button>
          ) : audioUrl ? (
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                data-testid={TID.audioPlaybackBtn}
                disabled={uploading}
                className="w-16 h-16 rounded-full bg-white text-love-blushActive flex items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
                aria-label="Play recording"
              >
                {status === "playing" ? (
                  <Pause fill="currentColor" strokeWidth={0} size={22} />
                ) : (
                  <Play fill="currentColor" strokeWidth={0} size={22} className="ml-1" />
                )}
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={reRecord}
                data-testid={TID.audioReRecordBtn}
                disabled={uploading}
                className="w-16 h-16 rounded-full bg-pink-100 text-love-burgundy flex items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
                aria-label="Re-record"
              >
                <RefreshCw size={22} />
              </motion.button>
              <audio
                ref={audioElRef}
                src={audioUrl}
                onEnded={() => setStatus("recorded")}
              />
            </div>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={start}
              data-testid={TID.audioRecordBtn}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#FF8A9D] flex items-center justify-center shadow-[0_10px_28px_rgba(255,138,157,0.45)] heart-pulse"
              aria-label="Start recording"
            >
              <Mic fill="white" strokeWidth={0} size={28} />
            </motion.button>
          )}

          {status === "recording" && (
            <div className="flex items-end gap-1.5 h-10 mt-1">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          )}

          {error && (
            <p className="font-body text-xs text-rose-500 text-center max-w-xs px-4">
              {error}
            </p>
          )}
        </div>

        <HeartButton
          onClick={() => onComplete({ audioUrl })}
          disabled={!audioUrl || uploading}
          testId={TID.taskNextBtn(taskNum)}
        >
          {uploading
            ? "Uploading..."
            : audioUrl
              ? "So sweet, continue"
              : "Record a voice note first"}
        </HeartButton>
      </div>
    </GlassCard>
  );
}
