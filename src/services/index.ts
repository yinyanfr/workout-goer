import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { PlanData } from "@/types/plan";

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

// -- User Profile --

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

// -- User Plan --

export async function getUserPlan(uid: string): Promise<PlanData | null> {
  const snap = await getDoc(doc(db, "plans", uid));
  if (!snap.exists()) return null;
  return snap.data() as PlanData;
}

export async function saveUserPlan(uid: string, plan: PlanData): Promise<void> {
  await setDoc(doc(db, "plans", uid), plan);
}

export async function deleteUserPlan(uid: string): Promise<void> {
  await deleteDoc(doc(db, "plans", uid));
}

// -- JSON Import: validate + normalize (accepts both camelCase & snake_case) --

const CAMEL_TO_SNAKE: Record<string, string> = {
  frequencyPerWeek: "frequency_per_week",
  restDays: "rest_days",
  durationMinutes: "duration_minutes",
  speedKmh: "speed_kmh",
  inclinePercent: "incline_percent",
  intervalExample: "interval_example",
  weeklyPlans: "plan",
  timesPerWeek: "times_per_week",
  setsReps: "sets_reps",
  startingWeight: "starting_weight",
  weightLossKg: "weight_loss_kg",
  cumulativeWeightLossKg: "cumulative_weight_loss_kg",
  expectedWeightKg: "expected_weight_kg",
  weeklyRestDays: "weekly_rest_days",
  activeRecovery: "active_recovery",
  foamRolling: "foam_rolling",
  weeklyRecoveryRules: "weekly_recovery_rules",
  redFlags: "red_flags",
  expectedResult: "expected_result",
  addedExercises: "added_exercises",
  weightRule: "weight_rule",
  intervalDays: "interval_days",
};

function normalizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(normalizeKeys);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = CAMEL_TO_SNAKE[k] || k;
      out[key] = normalizeKeys(v);
    }
    // Unwrap { content: string }[] to string[]
    if (Array.isArray(out) && out.length > 0 && typeof out[0] === "object" && out[0] !== null && "content" in (out[0] as object)) {
      return (out as Array<{ content: string }>).map((x) => x.content);
    }
    return out;
  }
  return obj;
}

export interface ValidationResult {
  valid: boolean;
  plan?: PlanData;
  errors?: string[];
}

export function validateAndNormalizePlan(
  raw: unknown,
): ValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, errors: ["Root value must be a JSON object"] };
  }

  const errors: string[] = [];
  const obj = raw as Record<string, unknown>;

  // Required top-level fields
  if (typeof obj.goal !== "string") errors.push("goal must be a string");
  if (!Array.isArray(obj.principles)) errors.push("principles must be an array");
  if (!Array.isArray(obj.phases)) errors.push("phases must be an array");

  // Validate each phase
  if (Array.isArray(obj.phases)) {
    (obj.phases as unknown[]).forEach((p, i) => {
      if (!p || typeof p !== "object") {
        errors.push(`phases[${i}] must be an object`);
        return;
      }
      const ph = p as Record<string, unknown>;
      if (typeof ph.phase !== "string") errors.push(`phases[${i}].phase must be a string`);
      if (typeof ph.objective !== "string") errors.push(`phases[${i}].objective must be a string`);
    });
  }

  if (!Array.isArray(obj.weekly_recovery_rules) && !Array.isArray((obj as any).weeklyRecoveryRules)) {
    errors.push("weekly_recovery_rules must be an array");
  }
  if (!Array.isArray(obj.red_flags) && !Array.isArray((obj as any).redFlags)) {
    errors.push("red_flags must be an array");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Normalize camelCase → snake_case
  const normalized = normalizeKeys(obj) as PlanData;

  return { valid: true, plan: normalized };
}
