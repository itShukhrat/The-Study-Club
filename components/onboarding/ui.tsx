"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProgressRail({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-ink-3">
          <motion.div
            className="absolute inset-0 bg-signal"
            initial={false}
            animate={{ scaleX: i < step ? 1 : i === step ? 0.5 : 0 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

export function StepShell({
  index,
  total,
  kicker,
  question,
  hint,
  children,
}: {
  index: number;
  total: number;
  kicker: string;
  question: ReactNode;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      <div className="mb-2 flex items-center gap-3">
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-signal">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">
          {kicker}
        </span>
        <span className="ml-auto font-mono text-[0.7rem] tracking-[0.2em] text-ash-2">
          {index + 1} / {total}
        </span>
      </div>
      <h2 className="font-display text-4xl leading-[0.95] text-bone sm:text-5xl">
        {question}
      </h2>
      {hint && <p className="mt-3 text-sm leading-relaxed text-ash">{hint}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function ChoiceCard({
  label,
  desc,
  icon,
  selected,
  locked,
  badge,
  onClick,
}: {
  label: string;
  desc?: string;
  icon?: ReactNode;
  selected?: boolean;
  locked?: boolean;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
        locked
          ? "cursor-not-allowed border-line bg-ink-1/40 opacity-55"
          : "border-line bg-ink-1 hover:border-line-2 hover:bg-ink-2",
        selected && !locked && "border-signal/70 bg-signal/[0.06] glow-signal",
      )}
    >
      {icon && (
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-2 bg-ink-2 transition-colors",
            selected && !locked ? "border-signal/50 text-signal" : "text-bone-dim",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block font-medium text-bone">{label}</span>
        {desc && <span className="block text-sm text-ash">{desc}</span>}
      </span>
      {locked ? (
        <span className="rounded-full border border-line-2 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
          {badge ?? "Soon"}
        </span>
      ) : (
        <span
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full border transition-all",
            selected ? "border-signal bg-signal text-bone" : "border-line-2 text-transparent",
          )}
        >
          <Check size={14} />
        </span>
      )}
    </button>
  );
}

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-all duration-200",
        selected
          ? "border-signal bg-signal/10 text-bone"
          : "border-line-2 text-bone-dim hover:border-bone/40 hover:text-bone",
      )}
    >
      {label}
    </button>
  );
}
