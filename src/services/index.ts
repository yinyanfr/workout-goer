import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFC16nEFpOj2AA9B5C9bqbfBQI_uT-Sng",
  authDomain: "workout-goer.firebaseapp.com",
  projectId: "workout-goer",
  storageBucket: "workout-goer.firebasestorage.app",
  messagingSenderId: "201486488510",
  appId: "1:201486488510:web:6bf3903dcc8b59ebdf9fef",
  measurementId: "G-1K7S5M0VN2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export interface UserProfile {
  displayName: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  bio?: string;
  updatedAt?: unknown;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "user", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function saveUserProfile(
  uid: string,
  data: Partial<UserProfile>,
): Promise<void> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined && value !== "") {
      cleaned[key] = value;
    }
  }
  await setDoc(
    doc(db, "user", uid),
    { ...cleaned, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
