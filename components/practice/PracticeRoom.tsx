"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, Check, Sparkles, X, Loader2, LayoutGrid, Bookmark, BookmarkCheck } from "lucide-react";
import { DesmosCalculator } from "./DesmosCalculator";
import { getBankQuestions, type BankQuestion, type DiffFilter } from "@/lib/bank";
import { cn } from "@/lib/utils";

const BLANK = '<span style="display:inline-block;min-width:4.25rem;border-bottom:2px solid currentColor;margin:0 4px;transform:translateY(-3px)"></span>';
const DIFFS: { id: DiffFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "difficult", label: "Difficult" },
];
type Ans = { chosen: string | null; checked: boolean };

export function PracticeRoom({
  backHref = "/dashboard",
  backLabel = "Today",
  contextLabel = "Warm-up drill",
  section,
  skill,
}: {
  backHref?: string;
  backLabel?: string;
  contextLabel?: string;
  section?: "rw" | "math";
  skill?: string;
} = {}) {
  const [diff, setDiff] = useState<DiffFilter>("all");
  const [seed] = useState(() => Date.now());

  const questions = useMemo(
    () => getBankQuestions({ skill, section, diff, shuffle: true, seed }),
    [skill, section, diff, seed],
  );
  const totalAll = useMemo(
    () => getBankQuestions({ skill, section, diff: "all" }).length,
    [skill, section],
  );

  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Ans>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [explain, setExplain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);

  // changing the filtered set restarts the run cleanly
  useEffect(() => {
    setI(0); setAnswers({}); setMarked({}); setExplain(null); setNavOpen(false);
  }, [diff, skill, section]);

  const q = questions[i];
  const cur: Ans = answers[i] ?? { chosen: null, checked: false };
  const isCorrect = cur.checked && q && cur.chosen === q.correct;

  function select(cid: string) {
    if (cur.checked) return;
    setAnswers((a) => ({ ...a, [i]: { chosen: cid, checked: false } }));
  }
  function check() {
    if (!cur.chosen) return;
    setAnswers((a) => ({ ...a, [i]: { chosen: cur.chosen, checked: true } }));
    setExplain(null);
  }
  function go(idx: number) { setI(idx); setExplain(null); setNavOpen(false); }
  function next() { if (i < questions.length - 1) go(i + 1); }
  function back() { if (i > 0) go(i - 1); }
  function toggleMark() { setMarked((m) => ({ ...m, [i]: !m[i] })); }

  async function askWhy() {
    if (!q) return;
    setLoading(true); setExplain(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q.stem, choices: q.choices, chosen: cur.chosen, correct: q.correct, topic: contextLabel }),
      });
      const data = await res.json();
      setExplain(data.explanation ?? "Couldn't reach the coach right now.");
    } catch {
      setExplain("Couldn't reach the coach right now.");
    } finally {
      setLoading(false);
    }
  }

  const answeredCount = Object.values(answers).filter((a) => a.checked).length;

  return (
    <div className="flex flex-col">
      <div className="mb-7 flex items-center justify-between">
        <Link href={backHref} className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone">
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        {section === "math" && (
          <button onClick={() => setCalcOpen((v) => !v)} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors", calcOpen ? "border-signal/60 bg-signal/10 text-bone" : "border-line-2 text-bone-dim hover:text-bone")}>
            <Calculator size={16} /> {calcOpen ? "Close" : "Calculator"}
          </button>
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-3">
        <span className="kicker">{contextLabel}</span>
        {q && <span className="font-mono text-[0.7rem] tracking-[0.2em] text-ash-2">{i + 1} / {questions.length}</span>}
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-line p-1">
          {DIFFS.map((d) => (
            <button key={d.id} onClick={() => setDiff(d.id)} className={cn("rounded-lg px-3 py-1 text-xs font-medium transition-colors", diff === d.id ? "bg-signal/15 text-signal" : "text-ash hover:text-bone")}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <h1 className="font-display text-4xl text-bone sm:text-5xl">Practice</h1>
      <p className="mt-2 text-sm text-ash">Pick one skill. Train it properly. Review is where the score changes.</p>

      {!q ? (
        <div className="card mt-8 p-8 text-center">
          {totalAll === 0 ? (
            <>
              <p className="font-display text-2xl text-bone">This bank is loading.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ash">We&apos;re importing this skill&apos;s questions. <strong className="text-bone">Words in Context</strong> is live now &mdash; train that while the rest comes online.</p>
              <Link href="/dashboard/practice/drill?track=rw&topic=words-in-context" className="btn btn-signal mt-5 inline-flex">Practice Words in Context <ArrowRight size={15} /></Link>
            </>
          ) : (
            <>
              <p className="font-display text-2xl text-bone">No {diff} questions in this set yet.</p>
              <p className="mt-2 text-sm text-ash">There are {totalAll} in total. Widen the filter to keep training.</p>
              <button onClick={() => setDiff("all")} className="btn btn-signal mt-5 inline-flex">Show all difficulties</button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className={cn("flex flex-col gap-5", calcOpen ? "lg:col-span-3" : "lg:col-span-5")}>
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-line-2 bg-ink-2 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash">{q.type === "meaning" ? "Word in context" : "Completion"}</span>
                  <span className={cn("rounded-full px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em]", q.difficulty === "easy" ? "bg-emerald-500/12 text-emerald-400" : q.difficulty === "medium" ? "bg-amber-500/12 text-amber-400" : "bg-signal/12 text-signal")}>{q.difficulty}</span>
                </div>
                <button onClick={toggleMark} className={cn("flex items-center gap-1.5 text-sm transition-colors", marked[i] ? "text-signal" : "text-ash hover:text-bone")}>
                  {marked[i] ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} Mark
                </button>
              </div>

              {q.passageHtml && (
                <div className="mt-5 rounded-xl border border-line bg-ink-1/60 p-4 text-[0.98rem] leading-relaxed text-bone-dim [&_em]:italic [&_u]:underline [&_u]:decoration-signal/70" dangerouslySetInnerHTML={{ __html: q.passageHtml }} />
              )}
              <p className="mt-5 text-lg leading-relaxed text-bone" dangerouslySetInnerHTML={{ __html: q.stem.replace(/_{3,}/g, BLANK) }} />

              <div className="mt-6 flex flex-col gap-2.5">
                {q.choices.map((c) => {
                  const isChosen = cur.chosen === c.id;
                  const right = c.id === q.correct;
                  const state = cur.checked ? (right ? "correct" : isChosen ? "wrong" : "idle") : isChosen ? "active" : "idle";
                  return (
                    <button key={c.id} disabled={cur.checked} onClick={() => select(c.id)} className={cn("flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                      state === "idle" && "border-line bg-ink-1 hover:border-line-2",
                      state === "active" && "border-signal/70 bg-signal/[0.06]",
                      state === "correct" && "border-emerald-500/60 bg-emerald-500/10",
                      state === "wrong" && "border-signal/70 bg-signal/10")}>
                      <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-mono text-xs",
                        state === "correct" && "border-emerald-500 text-emerald-400",
                        state === "wrong" && "border-signal text-signal",
                        (state === "idle" || state === "active") && "border-line-2 text-bone-dim")}>
                        {cur.checked && right ? <Check size={14} /> : cur.checked && isChosen ? <X size={14} /> : c.id}
                      </span>
                      <span className="text-bone">{c.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!cur.checked ? (
                  <button onClick={check} disabled={!cur.chosen} className="btn btn-signal disabled:opacity-40">Check answer</button>
                ) : (
                  <>
                    <span className={cn("font-display text-xl", isCorrect ? "text-emerald-400" : "text-signal")}>{isCorrect ? "Correct." : "Not quite."}</span>
                    <button onClick={askWhy} disabled={loading} className="btn btn-ghost">
                      {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Ask Durden
                    </button>
                  </>
                )}
              </div>

              {cur.checked && (
                <div className="mt-5 rounded-xl border border-line bg-ink-1/60 p-4">
                  <p className="mb-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash">Why {q.correct} is right</p>
                  <p className="text-[0.95rem] leading-relaxed text-bone-dim">{q.explanation}</p>
                </div>
              )}
            </div>

            <AnimatePresence>
              {explain && (
                <motion.div initial={{ opacity: 0, y: 12, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0 }} className="card overflow-hidden p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal/15 text-signal"><Sparkles size={14} /></span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">Durden</span>
                  </div>
                  <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-bone-dim">{explain}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* navigator bar */}
            <div className="relative flex items-center justify-between gap-3">
              <button onClick={back} disabled={i === 0} className="btn btn-ghost disabled:opacity-40"><ArrowLeft size={15} /> Back</button>
              <button onClick={() => setNavOpen((v) => !v)} className="flex items-center gap-2 rounded-xl border border-line-2 px-4 py-2 text-sm text-bone-dim hover:text-bone">
                <LayoutGrid size={15} /> Question {i + 1} of {questions.length}
              </button>
              <button onClick={next} disabled={i >= questions.length - 1} className="btn btn-signal disabled:opacity-40">Next <ArrowRight size={15} /></button>

              <AnimatePresence>
                {navOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNavOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="card absolute bottom-14 left-1/2 z-50 w-[min(92vw,460px)] -translate-x-1/2 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash">Jump to question</p>
                        <span className="font-mono text-[0.62rem] text-ash-2">{answeredCount} answered</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {questions.map((qq, idx) => {
                          const a = answers[idx];
                          const st = a?.checked ? (a.chosen === qq.correct ? "ok" : "bad") : a?.chosen ? "seen" : "idle";
                          return (
                            <button key={qq.id} onClick={() => go(idx)} className={cn("relative grid h-9 w-9 place-items-center rounded-lg border text-sm font-medium transition-colors",
                              idx === i ? "ring-2 ring-bone" : "",
                              st === "ok" && "border-emerald-500/60 bg-emerald-500/15 text-emerald-300",
                              st === "bad" && "border-signal/60 bg-signal/15 text-signal",
                              st === "seen" && "border-signal/50 text-bone",
                              st === "idle" && "border-line-2 text-ash hover:text-bone")}>
                              {idx + 1}
                              {marked[idx] && <Bookmark size={9} className="absolute -right-1 -top-1 fill-signal text-signal" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {calcOpen && section === "math" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <DesmosCalculator height={460} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}