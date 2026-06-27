/**
 * Lightweight client-side progress store (localStorage). Feeds Durden real
 * weakness data and powers the dashboard's "you're improving" signals.
 * SSR-safe: every accessor guards `typeof window`.
 */

export type DomainStat = { domain: string; correct: number; total: number };

export interface ProgressSnapshot {
  lastScore?: number;
  lastTakenAt?: string;
  testsTaken: number;
  weakDomains: string[]; // domains scored under 75%
  domainStats: DomainStat[];
}

const KEY = "sc.progress";
const EMPTY: ProgressSnapshot = { testsTaken: 0, weakDomains: [], domainStats: [] };

export function weakDomainsFrom(domains: DomainStat[]): string[] {
  return domains
    .filter((d) => d.total > 0 && d.correct / d.total < 0.75)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .map((d) => d.domain);
}

export function loadProgress(): ProgressSnapshot {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as ProgressSnapshot) };
  } catch {
    return EMPTY;
  }
}

export function saveTestResult(input: { total: number; domains: DomainStat[] }): ProgressSnapshot {
  if (typeof window === "undefined") return EMPTY;
  const prev = loadProgress();
  const next: ProgressSnapshot = {
    lastScore: input.total,
    lastTakenAt: new Date().toISOString(),
    testsTaken: (prev.testsTaken || 0) + 1,
    weakDomains: weakDomainsFrom(input.domains),
    domainStats: input.domains,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode - non-fatal */
  }
  return next;
}