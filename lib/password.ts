export type PwStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  hint: string;
  color: string;
  ok: boolean;
};

/**
 * Password strength with a Study Club / Fight Club attitude.
 * "ok" gates registration (>= 8 chars and at least a fair score).
 */
export function scorePassword(pw: string): PwStrength {
  if (!pw) {
    return { score: 0, label: "Empty. Like your locker.", hint: "8+ characters to begin.", color: "var(--color-ash-2)", ok: false };
  }

  let raw = 0;
  if (pw.length >= 8) raw++;
  if (pw.length >= 12) raw++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) raw++;
  if (/\d/.test(pw)) raw++;
  if (/[^A-Za-z0-9]/.test(pw)) raw++;

  const score = (pw.length < 8 ? 1 : Math.min(4, Math.max(1, raw))) as 1 | 2 | 3 | 4;

  const table: Record<number, Omit<PwStrength, "score" | "ok">> = {
    1: { label: "A copy of a copy.", hint: "Too soft. Make it longer.", color: "#e8392b" },
    2: { label: "Tourist.", hint: "Add a capital and a number.", color: "#f59e0b" },
    3: { label: "Getting dangerous.", hint: "One symbol from solid.", color: "#eab308" },
    4: { label: "First-rule strong.", hint: "Nobody's guessing this.", color: "#10b981" },
  };

  return { score, ok: pw.length >= 8 && score >= 2, ...table[score] };
}
