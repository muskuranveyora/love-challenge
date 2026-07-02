export const TID = {
  // App-level
  app: "love-app-root",
  background: "romantic-background",
  floatingHearts: "floating-hearts",
  progressBar: "progress-bar",
  progressLabel: "progress-label",
  resetBtn: "reset-progress-btn",

  // Welcome
  welcomeScreen: "welcome-screen",
  welcomeStartBtn: "welcome-start-btn",

  // Task wrappers
  taskCard: (n) => `task-${n}-card`,
  taskTitle: (n) => `task-${n}-title`,
  taskNextBtn: (n) => `task-${n}-next-btn`,

  // Task 1 & 2 (photo)
  photoInput: (n) => `task-${n}-photo-input`,
  photoDropzone: (n) => `task-${n}-photo-dropzone`,
  photoPreview: (n) => `task-${n}-photo-preview`,
  photoRetakeBtn: (n) => `task-${n}-photo-retake-btn`,

  // Task 3 & 5 (text)
  textInput: (n) => `task-${n}-text-input`,
  textCounter: (n) => `task-${n}-text-counter`,

  // Task 4 (audio)
  audioRecordBtn: "task-4-audio-record-btn",
  audioStopBtn: "task-4-audio-stop-btn",
  audioPlaybackBtn: "task-4-audio-playback-btn",
  audioReRecordBtn: "task-4-audio-rerecord-btn",
  audioTimer: "task-4-audio-timer",

  // Gift reveal
  giftScreen: "gift-screen",
  giftBox: "gift-box",
  giftOpenBtn: "gift-open-btn",

  // Final
  finalScreen: "final-screen",
  finalYesBtn: "final-yes-btn",
  finalMaybeBtn: "final-maybe-btn",
  finalCelebration: "final-celebration",
  finalRestartBtn: "final-restart-btn",
};