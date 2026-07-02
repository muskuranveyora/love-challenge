const KEY = "love_challenge_state";

const DEFAULT_STATE = {
  step: 0,
  completed: [],
  answers: {
    task1: "",
    task2: "",
    task3: "",
    task4: "",
    task5: "",
    finalChoice: null,
  },
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      completed: Array.isArray(parsed?.completed) ? parsed.completed : DEFAULT_STATE.completed,
      answers: {
        ...DEFAULT_STATE.answers,
        ...(parsed?.answers ?? {}),
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(KEY);
}
