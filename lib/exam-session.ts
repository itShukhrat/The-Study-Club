import type { AnswerMap } from "@/lib/exam";

/**
 * Client-side exam-session persistence (resume-from-dropout).
 * Mirrors FULL_TEST_SESSION_SCHEMA. localStorage is the offline-safe cache;
 * a Supabase mirror + server-issued session token are the planned hardening
 * (see docs/FULL_TEST_SCREEN_SPEC + the brief's anti-tamper section).
 */
export interface ExamSnapshot {
  testId: string;
  mode: "timed" | "untimed";
  mi: number;                 // current module index
  qi: number;                 // current question index
  secLeft: number | null;     // seconds left in the section (null = untimed)
  paused: boolean;
  phase: "test" | "break";
  breakLeft: number;          // seconds left in the 10-min break
  answers: AnswerMap;
  marked: Record<string, boolean>;
  elim: Record<string, Record<string, boolean>>;
  calcOpen?: boolean;
  finished?: boolean;
  savedAt: number;
}

const STORE = (testId: string) => `sc.exam.${testId}`;
const MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3h -> stale sessions expire (EVAL_SET)

export function loadSession(testId: string): ExamSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORE(testId));
    if (!raw) return null;
    const s = JSON.parse(raw) as ExamSnapshot;
    if (!s.savedAt || Date.now() - s.savedAt > MAX_AGE_MS) {
      clearSession(testId);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function saveSession(testId: string, snap: Omit<ExamSnapshot, "testId">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE(testId), JSON.stringify({ testId, ...snap }));
  } catch {
    /* quota / private mode - non-fatal */
  }
}

export function clearSession(testId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORE(testId));
  } catch {
    /* noop */
  }
}