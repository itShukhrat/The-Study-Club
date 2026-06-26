export type OnboardingData = {
  exam: "SAT";
  targetScore: number;
  fears: string[];
  struggles: string[];
  examDate: string; // YYYY-MM-DD
  name: string;
  email: string;
  stay: boolean;
  agreedToRules: boolean;
};

export const defaultOnboarding: OnboardingData = {
  exam: "SAT",
  targetScore: 1400,
  fears: [],
  struggles: [],
  examDate: "",
  name: "",
  email: "",
  stay: true,
  agreedToRules: false,
};

const KEY = "studyclub.route";

export function loadOnboarding(): OnboardingData {
  if (typeof window === "undefined") return defaultOnboarding;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultOnboarding;
    return { ...defaultOnboarding, ...JSON.parse(raw) };
  } catch {
    return defaultOnboarding;
  }
}

export function saveOnboarding(data: Partial<OnboardingData>) {
  if (typeof window === "undefined") return;
  const merged = { ...loadOnboarding(), ...data };
  window.localStorage.setItem(KEY, JSON.stringify(merged));
}

export function clearOnboarding() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
