// Lightweight sound effects using Web Audio API — no external assets needed.

let audioCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

function tone(freq, duration = 0.12, type = "sine", gain = 0.08, when = 0) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  g.gain.value = 0;

  osc.connect(g);
  g.connect(ctx.destination);

  const t = ctx.currentTime + when;

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const sounds = {
  pop: () => {
    tone(880, 0.09, "sine", 0.08, 0);
    tone(1320, 0.09, "sine", 0.05, 0.04);
  },

  success: () => {
    tone(523.25, 0.14, "sine", 0.08, 0);
    tone(659.25, 0.14, "sine", 0.08, 0.1);
    tone(783.99, 0.16, "sine", 0.08, 0.2);
    tone(1046.5, 0.22, "sine", 0.09, 0.32);
  },

  sparkle: () => {
    tone(1568, 0.08, "triangle", 0.05, 0);
    tone(2093, 0.08, "triangle", 0.05, 0.05);
    tone(2637, 0.12, "triangle", 0.06, 0.1);
  },

  unwrap: () => {
    tone(440, 0.15, "triangle", 0.07, 0);
    tone(587.33, 0.15, "triangle", 0.07, 0.1);
    tone(880, 0.2, "triangle", 0.08, 0.2);
    tone(1318.5, 0.25, "sine", 0.09, 0.32);
  },

  heart: () => {
    tone(700, 0.06, "sine", 0.06, 0);
    tone(900, 0.06, "sine", 0.06, 0.07);
  },
};