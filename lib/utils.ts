import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Days between now and a date string (YYYY-MM-DD). Clamped at 0. */
export function daysUntil(dateISO: string): number {
  const target = new Date(dateISO + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
  return Math.max(diff, 0);
}

/** Deterministic pick from an array based on a seed (so SSR + client agree). */
export function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}
