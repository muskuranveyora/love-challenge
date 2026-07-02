import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import "./App.css";

import FloatingHearts from "./components/FloatingHearts";
import ProgressBar from "./components/ProgressBar";
import Welcome from "./components/Welcome";
import PhotoTask from "./components/PhotoTask";
import TextTask from "./components/TextTask";
import AudioTask from "./components/AudioTask";
import GiftReveal from "./components/GiftReveal";
import FinalScreen from "./components/FinalScreen";
import { loadState, saveState, resetState } from "./lib/storage";
import { burst, heartBlast } from "./lib/confetti";
import { sounds } from "./lib/sounds";
import { TID } from "./constants/testIds";
import { login } from "./lib/firebase";
import { createSessionId, saveSubmission, SESSION_KEY } from "./lib/submitResponse";

const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

const NAME = "Mehak";
const TOTAL_TASKS = 5;
const IS_ADMIN_ROUTE = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

function getOrCreateSessionId() {
  if (typeof window === "undefined") return createSessionId();
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = createSessionId();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

function defaultAnswers() {
  return {
    task1: "",
    task2: "",
    task3: "",
    task4: "",
    task5: "",
    finalChoice: null,
  };
}

function buildSubmissionPayload(state) {
  const answers = state.answers || defaultAnswers();

  return {
    name: NAME,
    step: state.step,
    status:
      state.step >= 7 ? "completed" : state.step > 0 ? "in_progress" : "started",
    completed: state.completed || [],
    currentTask: Math.min(state.step || 0, TOTAL_TASKS),
    answers: {
      ...answers,
      finalChoice: answers.finalChoice ?? null,
    },
    task1Photo: answers.task1 || "",
    task2Photo: answers.task2 || "",
    task3Text: answers.task3 || "",
    task4Audio: answers.task4 || "",
    task5Text: answers.task5 || "",
    finalChoice: answers.finalChoice ?? null,
    app: "love-challenge",
  };
}

export default function App() {
  if (IS_ADMIN_ROUTE) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen romantic-bg flex items-center justify-center px-4">
            <div className="glass-card rounded-[32px] p-8 text-center max-w-md w-full">
              <div className="text-5xl mb-3">💞</div>
              <p className="font-script text-4xl text-love-burgundy">Loading admin...</p>
              <p className="mt-2 text-sm text-love-muted">Preparing your private dashboard.</p>
            </div>
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    );
  }

  const [state, setState] = useState(loadState);
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId());
  const firstSyncRef = useRef(true);

  useEffect(() => {
    login().catch(() => {});
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    let active = true;

    saveSubmission(sessionId, buildSubmissionPayload(state), {
      create: firstSyncRef.current,
    })
      .catch((err) => {
        if (active) console.error(err);
      })
      .finally(() => {
        if (active) firstSyncRef.current = false;
      });

    return () => {
      active = false;
    };
  }, [state, sessionId]);

  const setStep = (step) =>
    setState((s) => ({
      ...s,
      step,
    }));

  const completeTask = useCallback((taskNum, payload = {}) => {
    sounds.success();
    burst();

    setState((s) => {
      const completed = s.completed.includes(taskNum)
        ? s.completed
        : [...s.completed, taskNum];

      const answers = {
        ...(s.answers || defaultAnswers()),
      };

      if (taskNum === 1) answers.task1 = payload.photoUrl || "";
      if (taskNum === 2) answers.task2 = payload.photoUrl || "";
      if (taskNum === 3) answers.task3 = payload.text || "";
      if (taskNum === 4) answers.task4 = payload.audioUrl || "";
      if (taskNum === 5) answers.task5 = payload.text || "";

      return {
        ...s,
        completed,
        answers,
        step: taskNum < TOTAL_TASKS ? taskNum + 1 : 6,
      };
    });
  }, []);

  const onGiftOpened = useCallback(() => {
    setStep(7);
    setTimeout(() => heartBlast(), 200);
  }, []);

  const onFinalChoice = useCallback((choice) => {
    setState((s) => ({
      ...s,
      answers: {
        ...(s.answers || defaultAnswers()),
        finalChoice: choice,
      },
    }));
  }, []);

  const onRestart = useCallback(() => {
    resetState();

    const nextSessionId = createSessionId();
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, nextSessionId);
    }
    setSessionId(nextSessionId);
    firstSyncRef.current = true;

    setState({
      step: 0,
      completed: [],
      answers: defaultAnswers(),
    });
  }, []);

  const showProgress = state.step >= 1 && state.step <= 6;
  const completedCount = state.completed.length;

  return (
    <div
      data-testid={TID.app}
      className="App romantic-bg min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-[#FDFBF7]/40 pointer-events-none"
        aria-hidden="true"
      />

      <FloatingHearts />

      <main className="w-full flex flex-col items-center justify-center relative z-10">
        {showProgress && (
          <ProgressBar completed={completedCount} total={TOTAL_TASKS} />
        )}

        <AnimatePresence mode="wait">
          {state.step === 0 && (
            <Welcome
              key="welcome"
              name={NAME}
              onStart={() => {
                sounds.heart();
                setStep(1);
              }}
            />
          )}

          {state.step === 1 && (
            <PhotoTask
              key="task-1"
              taskNum={1}
              emoji="📸"
              title="apna thopde ka photo chipka idhar"
              hint="Mashallha app to wese bhi pyaari ho."
              onComplete={(p) => completeTask(1, p)}
            />
          )}

          {state.step === 2 && (
            <PhotoTask
              key="task-2"
              taskNum={2}
              emoji="🌸"
              title="Snap something that reminds you of me"
              hint="The sky, a coffee, your favorite song's cover, anything."
              onComplete={(p) => completeTask(2, p)}
            />
          )}

          {state.step === 3 && (
            <TextTask
              key="task-3"
              taskNum={3}
              emoji="💌"
              title="Three things you genuinely like about me"
              hint="At least three sentences. Be honest, be cheesy, be you."
              placeholder="1. I like... 2. I like... 3. I like..."
              mode="sentences"
              minSentences={3}
              initialValue={state.answers.task3}
              buttonLabel="So thoughtful, continue"
              onComplete={(p) => completeTask(3, p)}
            />
          )}

          {state.step === 4 && (
            <AudioTask
              key="task-4"
              taskNum={4}
              emoji="🎵"
              title="Record a 15-second voice note"
              hint="Say anything. A joke, a confession, a song, your day."
              onComplete={(p) => completeTask(4, p)}
            />
          )}

          {state.step === 5 && (
            <TextTask
              key="task-5"
              taskNum={5}
              emoji="❤️"
              title="One promise you'll keep"
              hint="For our friendship... or maybe something more 😉"
              placeholder="I promise that..."
              mode="chars"
              minChars={20}
              initialValue={state.answers.task5}
              buttonLabel="Seal it with a kiss"
              onComplete={(p) => completeTask(5, p)}
            />
          )}

          {state.step === 6 && <GiftReveal key="gift" onOpen={onGiftOpened} />}

          {state.step === 7 && (
            <FinalScreen
              key="final"
              initialChoice={state.answers.finalChoice}
              onChoose={onFinalChoice}
              onRestart={onRestart}
            />
          )}
        </AnimatePresence>

        {state.step > 0 && state.step < 7 && (
          <button
            type="button"
            data-testid={TID.resetBtn}
            onClick={onRestart}
            className="mt-8 text-xs font-body text-love-muted hover:text-love-burgundy transition-colors"
          >
            Start Over
          </button>
        )}
      </main>
    </div>
  );
}
