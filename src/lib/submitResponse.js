import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, login } from "./firebase";

export const SESSION_KEY = "love_challenge_session_id";

export function createSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function saveSubmission(sessionId, data, { create = false } = {}) {
  try {
    if (!auth.currentUser) {
      await login();
    }
  } catch {
    // Anonymous auth can fail in blocked environments; keep the app usable.
  }

  const payload = {
    ...data,
    sessionId,
    uid: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  };

  if (create) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, "responses", sessionId), payload, { merge: true });
}
