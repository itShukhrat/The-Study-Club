"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, Check, Sparkles, X, Loader2 } from "lucide-react";
import { DesmosCalculator } from "./DesmosCalculator";
import { cn } from "@/lib/utils";

type Q = {
  id: string;
  topic: string;
  prompt: string;
  choices: { id: string; text: string }[];
  correct: string;
};

const QUESTIONS: Q[] = [
  {
    id: "q1",
    topic: "Algebra",
    prompt: "If 3x + 7 = 22, what is the value of x?",
    choices: [
      { id: "A", text: "3" },
      { id: "B", text: "5" },
      { id: "C", text: "7" },
      { id: "D", text: "15" },
    ],
    correct: "B",
  },
  {
    id: "q2",
    topic: "Advanced math",
    prompt: "The graph of y = x² − 2x − 3 crosses the x-axis at which x-values? (Open the calculator and graph it.)",
    choices: [
      { id: "A", text: "x = −1 and x = 3" },
      { id: "B", text: "x = 1 and x = −3" },
      { id: "C", text: "x = −3 and x = 3" },
      { id: "D", text: "x = 0 and x = 2" },
    ],
    correct: "A",
  },
  {
    id: "q3",
    topic: "Vocabulary in context",
    prompt: "Her argument was so ______ that even longtime skeptics found themselves nodding along.",
    choices: [
      { id: "A", text: "tedious" },
      { id: "B", text: "cogent" },
      { id: "C", text: "verbose" },
      { id: "D", text: "ambiguous" },
    ],
    correct: "B",
  },
];

export function PracticeRoom({
  backHref = "/dashboard",
  backLabel = "Today",
  contextLabel = "Warm-up drill",
}: {
  backHref?: string;
  backLabel?: string;
  contextLabel?: string;
} = {}) {
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [explain, setExplain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  const q = QUESTIONS[i];
  const correct = checked && chosen === q.correct;

  function reset() {
    setChosen(null);
    setChecked(false);
    setExplain(null);
    setLoading(false);
  }
  function next() {
    setI((v) => (v + 1) % QUESTIONS.length);
    reset();
  }

  async function askWhy() {
    setLoading(true);
    setExplain(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: q.prompt,
          choices: q.choices,
          chosen,
          correct: q.correct,
          topic: q.topic,
        }),
      });
      const data = await res.json();
      setExplain(data.explanation ?? "Couldn't reach the coach right now.");
    } catch {
      setExplain("Couldn't reach the coach right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <button
          onClick={() => setCalcOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
            calcOpen ? "border-signal/60 bg-signal/10 text-bone" : "border-line-2 text-bone-dim hover:text-bone",
          )}
        >
          <Calculator size={16} /> {calcOpen ? "Close" : "Calculator"}
        </button>
      </div>

      <div className="mb-2 flex items-center gap-3">
        <span className="kicker">{contextLabel}</span>
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-ash-2">
          {i + 1} / {QUESTIONS.length}
        </span>
      </div>
      <h1 className="font-display text-4xl text-bone sm:text-5xl">Practice</h1>
      <p className="mt-2 text-sm text-ash">
        Real questions, real explanations. Full timed Bluebook tests land next —
        this is the loop they&apos;ll run on.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* question */}
        <div className={cn("flex flex-col gap-5", calcOpen ? "lg:col-span-3" : "lg:col-span-5")}>
          <div className="card p-6 sm:p-8">
            <span className="rounded-full border border-line-2 bg-ink-2 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash">
              {q.topic}
            </span>
            <p className="mt-5 text-lg leading-relaxed text-bone">{q.prompt}</p>

            <div className="mt-6 flex flex-col gap-2.5">
              {q.choices.map((c) => {
                const isChosen = chosen === c.id;
                const isCorrect = c.id === q.correct;
                const state = checked
                  ? isCorrect
                    ? "correct"
                    : isChosen
                      ? "wrong"
                      : "idle"
                  : isChosen
                    ? "active"
                    : "idle";
                return (
                  <button
                    key={c.id}
                    disabled={checked}
                    onClick={() => setChosen(c.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                      state === "idle" && "border-line bg-ink-1 hover:border-line-2",
                      state === "active" && "border-signal/70 bg-signal/[0.06]",
                      state === "correct" && "border-emerald-500/60 bg-emerald-500/10",
                      state === "wrong" && "border-signal/70 bg-signal/10",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-mono text-xs",
                        state === "correct" && "border-emerald-500 text-emerald-400",
                        state === "wrong" && "border-signal text-signal",
                        (state === "idle" || state === "active") && "border-line-2 text-bone-dim",
                      )}
                    >
                      {checked && isCorrect ? <Check size={14} /> : checked && isChosen ? <X size={14} /> : c.id}
                    </span>
                    <span className="text-bone">{c.text}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!checked ? (
                <button
                  onClick={() => setChecked(true)}
                  disabled={!chosen}
                  className="btn btn-signal disabled:opacity-40"
                >
                  Check
                </button>
              ) : (
                <>
                  <span
                    className={cn(
                      "font-display text-xl",
                      correct ? "text-emerald-400" : "text-signal",
                    )}
                  >
                    {correct ? "Correct." : "Not quite."}
                  </span>
                  <button onClick={askWhy} disabled={loading} className="btn btn-ghost">
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    Ask the coach why
                  </button>
                  <button onClick={next} className="btn btn-signal ml-auto">
                    Next <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>
          </div>

          <AnimatePresence>
            {explain && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                className="card overflow-hidden p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal/15 text-signal">
                    <Sparkles size={14} />
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">
                    Coach
                  </span>
                </div>
                <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-bone-dim">
                  {explain}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* calculator */}
        {calcOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <DesmosCalculator height={460} />
            <p className="mt-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash-2">
              Desmos · same engine as the real test
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
