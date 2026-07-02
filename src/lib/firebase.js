import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBa4xlkLE5jV-LcDX_SnQL-Y6un-xwKFe4",
  authDomain: "madam-ji-aap.firebaseapp.com",
  projectId: "madam-ji-aap",
  storageBucket: "madam-ji-aap.firebasestorage.app",
  messagingSenderId: "349891990077",
  appId: "1:349891990077:web:369efdaf775c9812871054",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export async function login() {
  await signInAnonymously(auth);
}