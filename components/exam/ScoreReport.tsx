"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Check, X, ArrowRight, RotateCcw } from "lucide-react";
import { gradeTest, isCorrect, type ExamTest, type AnswerMap, type ExamQuestion } from "@/lib/exam";
import { LogoMark } from "@/components/brand/Logo";

function band(domains: { domain: string; correct: number; total: number }[]) {
  return [...domains].sort((a, b) => a.correct / a.total - b.correct / b.total);
}

export function ScoreReport({
  test,
  answers,
  onRetake,
  onExit,
}: {
  test: ExamTest;
  answers: AnswerMap;
  onRetake: () => void;
  onExit: () => void;
}) {
  const grade = gradeTest(test, answers);
  const estimate = grade.sections.some((s) => !s.complete);

  return (
    <div className="exam fixed inset-0 z-[80] overflow-y-auto px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* certificate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="exam-card relative overflow-hidden p-8 sm:p-10"
          style={{ borderColor: "var(--carbon)", borderWidth: 2 }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--carbon) 0 1px, transparent 1px 14px)" }} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark size={30} animated={false} />
              <div>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em]" style={{ color: "var(--carbon-3)" }}>Study Club &middot; Score Report</p>
                <p className="serif text-lg font-bold">{test.title}</p>
              </div>
            </div>
            <span className="rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white" style={{ background: "var(--ember)" }}>
              {estimate ? "Estimated" : "Official scale"}
            </span>
          </div>

          <div className="relative mt-8 text-center">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: "var(--carbon-3)" }}>Total score</p>
            <p className="font-display text-7xl leading-none sm:text-8xl">{grade.total}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>
              range {grade.totalLow}&ndash;{grade.totalHigh} &middot; scale 400&ndash;1600
            </p>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-4">
            {grade.sections.map((s) => (
              <div key={s.section} className="rounded-xl border p-4" style={{ borderColor: "var(--paper-line-2)" }}>
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>{s.label}</p>
                <p className="font-display text-4xl leading-none">{s.score}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--carbon-2)" }}>
                  raw {s.raw}/{s.total}{s.complete ? "" : " (partial)"} &middot; {s.low}&ndash;{s.high}
                </p>
              </div>
            ))}
          </div>

          {estimate && (
            <p className="relative mt-5 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon-2)" }}>
              You took part of a section, so this is an <strong>estimate</strong> extrapolated to the full scale.
              Sit the complete test for your official 200&ndash;800 section score.
            </p>
          )}
        </motion.div>

        {/* suggestions */}
        <div className="mt-6 exam-card p-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: "var(--carbon-3)" }}>Durden&rsquo;s orders</p>
          <h2 className="serif mt-1 text-2xl font-bold">Where the points are.</h2>
          <div className="mt-4 flex flex-col gap-3">
            {grade.sections.map((s) => {
              const weak = band(s.domains).filter((d) => d.correct / d.total < 0.75).slice(0, 2);
              return (
                <div key={s.section}>
                  <p className="mb-2 text-sm font-semibold">{s.label}</p>
                  {s.domains.map((d) => {
                    const pct = Math.round((d.correct / d.total) * 100);
                    return (
                      <div key={d.domain} className="mb-2">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span style={{ color: "var(--carbon-2)" }}>{d.domain}</span>
                          <span className="font-mono" style={{ color: "var(--carbon-3)" }}>{d.correct}/{d.total} &middot; {pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full" style={{ background: "#e7e3d9" }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 3)}%`, background: pct >= 75 ? "var(--good)" : "var(--ember)" }} />
                        </div>
                      </div>
                    );
                  })}
                  {weak.length > 0 && (
                    <p className="mt-1 text-sm" style={{ color: "var(--carbon)" }}>
                      Work on <strong style={{ color: "var(--ember)" }}>{weak.map((w) => w.domain).join(" and ")}</strong>. That&rsquo;s your fastest gain.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* review */}
        <div className="mt-6 exam-card p-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: "var(--carbon-3)" }}>Review every question</p>
          <h2 className="serif mt-1 text-2xl font-bold">The misses are the map.</h2>
          <div className="mt-4 flex flex-col gap-3">
            {test.modules.map((m) =>
              m.questions.map((q) => (
                <ReviewRow key={`${m.id}:${q.n}`} q={q} answer={answers[`${m.id}:${q.n}`]} section={m.section === "rw" ? "Reading & Writing" : "Math"} />
              )),
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 pb-10">
          <button onClick={onRetake} className="exam-btn exam-btn-ghost"><RotateCcw size={15} /> Retake</button>
          <button onClick={onExit} className="exam-btn exam-btn-primary">Back to Question Bank <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ q, answer, section }: { q: ExamQuestion; answer?: string; section: string }) {
  const ok = isCorrect(q, answer);
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function explain() {
    setOpen(true);
    if (exp || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "explain", section, passage: q.passageHtml, stem: q.stemHtml, choices: q.choices, correct: q.correct, chosen: answer }),
      });
      const data = await res.json();
      setExp(data.text ?? "");
    } catch {
      setExp("Couldn't reach Durden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--paper-line-2)" }}>
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" style={{ background: ok ? "var(--good)" : "var(--ember)" }}>
          {ok ? <Check size={14} /> : <X size={14} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: "var(--carbon-3)" }}>
            Q{q.n} &middot; {q.skill || q.domain}
          </p>
          <div className="exam-prose mt-1 text-sm" dangerouslySetInnerHTML={{ __html: q.stemHtml }} />
          <p className="mt-1.5 text-xs" style={{ color: "var(--carbon-2)" }}>
            Correct: <strong>{q.type === "mcq" ? q.correct : (q.sprAnswers || []).join(" / ")}</strong>
            {q.type === "mcq" && <> &middot; You: <strong style={{ color: ok ? "var(--good)" : "var(--ember)" }}>{answer || "—"}</strong></>}
          </p>
          <button onClick={explain} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium" style={{ borderColor: "var(--paper-line-2)", color: "var(--ember)" }}>
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Durden, explain
          </button>
          {open && exp && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 whitespace-pre-line rounded-lg p-3 text-[0.88rem] leading-relaxed" style={{ background: "#16140f", color: "#e9e5db" }}>
              {exp}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}