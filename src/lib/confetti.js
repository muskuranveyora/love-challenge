import confetti from "canvas-confetti";

const PINK = [
  "#FFB6C1",
  "#FF9EAE",
  "#FF8A9D",
  "#FFC8DD",
  "#FFFFFF",
  "#E6E6FA",
];

export function burst() {
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.85 },
    colors: PINK,
    scalar: 0.9,
    ticks: 200,
  });
}

export function sideBursts() {
  const end = Date.now() + 600;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: PINK,
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: PINK,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function heartBlast() {
  const defaults = {
    startVelocity: 35,
    spread: 360,
    ticks: 250,
    zIndex: 9999,
    colors: PINK,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(250 * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { y: 0.7 },
  });

  fire(0.2, {
    spread: 60,
    origin: { y: 0.7 },
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.9,
    origin: { y: 0.7 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    origin: { y: 0.7 },
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin: { y: 0.7 },
  });

  sideBursts();
}