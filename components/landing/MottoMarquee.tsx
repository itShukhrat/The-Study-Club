"use client";

import { MOTTOS } from "@/lib/brand";

const picks = [
  "Progress leaves evidence.",
  "Stay on the route.",
  "Study the miss.",
  "Quiet reps. Loud results.",
  "The streak is the strategy.",
  "Move the score.",
  "Small work still counts.",
  "The route remembers.",
];

export function MottoMarquee() {
  const row = picks.length ? picks : MOTTOS.slice(0, 8);
  const doubled = [...row, ...row];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-1 py-5">
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {doubled.map((m, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-xl uppercase tracking-wide text-bone/70 sm:text-2xl">
              {m}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-signal" />
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-1 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-1 to-transparent" />
    </div>
  );
}
