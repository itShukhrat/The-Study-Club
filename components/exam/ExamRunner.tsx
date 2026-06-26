"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  Calculator as CalcIcon,
  Bookmark,
  BookmarkCheck,
  ChevronUp,
  Clock,
  EyeOff,
  Eye,
  Highlighter,
  ArrowLeft,
  ArrowRight,
  X,
  Infinity as InfinityIcon,
} from "lucide-react";
import type { ExamTest, AnswerMap, ExamQuestion } from "@/lib/exam";
import { answerKey } from "@/lib/exam";
import { DurdenPanel } from "./DurdenPanel";
import { ScoreReport } from "./ScoreReport";
import { DesmosCalculator } from "@/components/practice/DesmosCalculator";

type Mode = "timed" | "untimed";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export function ExamRunner({ test }: { test: ExamTest }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [mi, setMi] = useState(0);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [elim, setElim] = useState<Record<string, Record<string, boolean>>>({});
  const [calcOpen, setCalcOpen] = useState(false);
  const [durden, setDurden] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [hideTimer, setHideTimer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [finished, setFinished] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  const moduleObj = test.modules[mi];
  const q = moduleObj.questions[qi];
  const isMath = moduleObj.section === "math";
  const key = answerKey(moduleObj.id, q.n);
  const total = moduleObj.questions.length;

  useEffect(() => {
    if (mode === "timed") setDeadline(Date.now() + moduleObj.minutes * 60000);
    else setDeadline(null);
    setCalcOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mi, mode]);

  useEffect(() => {
    if (deadline == null || finished) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [deadline, finished]);

  const remaining = deadline ? Math.max(0, Math.round((deadline - now) / 1000)) : null;

  function advanceModule() {
    if (mi < test.modules.length - 1) {
      setMi(mi + 1);
      setQi(0);
    } else {
      setFinished(true);
    }
  }

  useEffect(() => {
    if (deadline != null && remaining === 0 && !finished) advanceModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  function select(letter: string) {
    if (elim[key]?.[letter]) return;
    setAnswers((a) => ({ ...a, [key]: letter }));
  }
  function setSpr(v: string) {
    setAnswers((a) => ({ ...a, [key]: v }));
  }
  function toggleElim(letter: string) {
    setElim((e) => {
      const cur = { ...(e[key] || {}) };
      cur[letter] = !cur[letter];
      return { ...e, [key]: cur };
    });
    if (answers[key] === letter) setAnswers((a) => ({ ...a, [key]: "" }));
  }
  function toggleMark() {
    setMarked((m) => ({ ...m, [key]: !m[key] }));
  }
  function next() {
    if (qi < total - 1) setQi(qi + 1);
    else advanceModule();
  }
  function back() {
    if (qi > 0) setQi(qi - 1);
  }

  if (mode === null)
    return <StartModal test={test} onPick={setMode} onExit={() => router.push("/dashboard/practice")} />;

  if (finished)
    return (
      <ScoreReport
        test={test}
        answers={answers}
        onRetake={() => {
          setAnswers({});
          setMarked({});
          setElim({});
          setFinished(false);
          setMi(0);
          setQi(0);
          setMode(null);
        }}
        onExit={() => router.push("/dashboard/practice")}
      />
    );

  const lastOfTest = mi === test.modules.length - 1 && qi === total - 1;
  const card = (
    <QuestionCard
      q={q}
      selected={answers[key]}
      elim={elim[key]}
      marked={!!marked[key]}
      onSelect={select}
      onSpr={setSpr}
      onElim={toggleElim}
      onMark={toggleMark}
    />
  );

  return (
    <div className="exam flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{ borderColor: "var(--paper-line)", background: "rgba(246,244,239,0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{isMath ? "Section 2: Math" : "Section 1: Reading and Writing"}</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>{moduleObj.label}</p>
        </div>

        <div className="flex flex-col items-center">
          {remaining != null ? (
            <>
              <span className={"font-display text-xl tabular-nums " + (remaining <= 300 ? "exam-timer-low" : "")}>{hideTimer ? "•••" : fmt(remaining)}</span>
              <button onClick={() => setHideTimer((h) => !h)} className="flex items-center gap-1 font-mono text-[0.56rem] uppercase tracking-[0.16em]" style={{ color: "var(--carbon-3)" }}>
                {hideTimer ? <Eye size={11} /> : <EyeOff size={11} />} {hideTimer ? "Show" : "Hide"}
              </button>
            </>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon-2)" }}>
              <Clock size={11} /> Untimed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isMath && (
            <button onClick={() => setCalcOpen((c) => !c)} className={"exam-toolbtn " + (calcOpen ? "is-on" : "")} title="Calculator">
              <CalcIcon size={16} /> <span className="hidden sm:inline">Calculator</span>
            </button>
          )}
          <button onClick={() => setHighlight((h) => !h)} className={"exam-toolbtn " + (highlight ? "is-on" : "")} title="Highlights & Notes">
            <Highlighter size={16} /> <span className="hidden md:inline">Highlights</span>
          </button>
          <button onClick={() => setDurden(true)} className="exam-toolbtn is-ember" title="Durden AI">
            <Flame size={16} /> <span className="hidden sm:inline">Durden AI</span>
          </button>
        </div>
      </header>

      <main className={"relative flex-1 " + (highlight ? "exam-hl-on" : "")}>
        {isMath ? (
          <div className={"mx-auto grid h-full max-w-6xl " + (calcOpen ? "lg:grid-cols-2" : "")}>
            <div className="flex items-start justify-center px-5 py-8 sm:px-10">
              <div className={"w-full " + (calcOpen ? "max-w-xl" : "max-w-2xl")}>{card}</div>
            </div>
            {calcOpen && (
              <div className="border-l px-4 py-6" style={{ borderColor: "var(--paper-line)" }}>
                <DesmosCalculator height={520} />
                <p className="mt-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>Desmos &middot; same engine as test day</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto grid h-full max-w-6xl md:grid-cols-2">
            <div
              className="exam-prose serif overflow-y-auto border-r px-5 py-8 text-[1.02rem] leading-relaxed sm:px-8"
              style={{ borderColor: "var(--paper-line)" }}
              dangerouslySetInnerHTML={{ __html: q.passageHtml || "" }}
            />
            <div className="exam-watermark relative overflow-y-auto px-5 py-8 sm:px-8">
              <div className="relative z-10 mx-auto max-w-xl">{card}</div>
            </div>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-30 flex items-center justify-between border-t px-4 py-3" style={{ borderColor: "var(--paper-line)", background: "var(--paper)" }}>
        <button onClick={() => setPalette((p) => !p)} className="exam-btn exam-btn-primary px-4 py-2.5 text-[0.8rem]">
          Question {qi + 1} of {total} <ChevronUp size={14} className={palette ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={back} disabled={qi === 0} className="exam-btn exam-btn-ghost px-5 py-2.5 disabled:opacity-40"><ArrowLeft size={15} /> Back</button>
          <button onClick={next} className="exam-btn exam-btn-ember px-6 py-2.5">{lastOfTest ? "Finish" : "Next"} <ArrowRight size={15} /></button>
        </div>
      </footer>

      <AnimatePresence>
        {palette && (
          <>
            <div onClick={() => setPalette(false)} className="fixed inset-0 z-30" />
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="exam-card fixed bottom-[68px] left-1/2 z-40 w-[min(92vw,560px)] -translate-x-1/2 p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">{moduleObj.label}</p>
                <button onClick={() => setPalette(false)} style={{ color: "var(--carbon-3)" }}><X size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {moduleObj.questions.map((qq, idx) => {
                  const k = answerKey(moduleObj.id, qq.n);
                  const answered = !!answers[k];
                  const isCur = idx === qi;
                  return (
                    <button key={qq.n} onClick={() => { setQi(idx); setPalette(false); }} className="relative grid h-9 w-9 place-items-center rounded-lg border text-sm font-medium" style={{ borderColor: isCur ? "var(--carbon)" : "var(--paper-line-2)", background: answered ? "var(--carbon)" : "transparent", color: answered ? "var(--paper)" : "var(--carbon-2)" }}>
                      {qq.n}
                      {marked[k] && <Bookmark size={10} className="absolute -right-1 -top-1" style={{ color: "var(--ember)", fill: "var(--ember)" }} />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 font-mono text-[0.58rem] uppercase tracking-[0.14em]" style={{ color: "var(--carbon-3)" }}>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{ background: "var(--carbon)" }} /> Answered</span>
                <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded border" style={{ borderColor: "var(--paper-line-2)" }} /> Unanswered</span>
                <span className="flex items-center gap-1"><Bookmark size={11} style={{ color: "var(--ember)" }} /> Marked</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {durden && <DurdenPanel q={q} section={isMath ? "Math" : "Reading & Writing"} onClose={() => setDurden(false)} />}
      </AnimatePresence>
    </div>
  );
}
function QuestionCard({
  q,
  selected,
  elim,
  marked,
  onSelect,
  onSpr,
  onElim,
  onMark,
}: {
  q: ExamQuestion;
  selected?: string;
  elim?: Record<string, boolean>;
  marked: boolean;
  onSelect: (l: string) => void;
  onSpr: (v: string) => void;
  onElim: (l: string) => void;
  onMark: () => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--paper-line)" }}>
        <span className="grid h-8 w-8 place-items-center rounded-md text-sm font-bold text-white" style={{ background: "var(--carbon)" }}>{q.n}</span>
        <button onClick={onMark} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: marked ? "var(--ember)" : "var(--carbon-2)" }}>
          {marked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} Mark for Review
        </button>
      </div>

      <div className="exam-prose serif mb-5 text-[1.05rem] leading-relaxed" dangerouslySetInnerHTML={{ __html: q.stemHtml }} />

      {q.type === "spr" ? (
        <div>
          <input
            value={selected || ""}
            onChange={(e) => onSpr(e.target.value)}
            placeholder="Enter your answer"
            className="w-full rounded-xl border-2 px-4 py-3 text-lg outline-none"
            style={{ borderColor: "var(--paper-line-2)", background: "var(--paper-2)", color: "var(--carbon)" }}
          />
          <p className="mt-2 text-xs" style={{ color: "var(--carbon-3)" }}>Student-produced response. Fractions like 7/2 or decimals are accepted.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {(q.choices || []).map((c) => {
            const isElim = !!elim?.[c.id];
            const isSel = selected === c.id;
            const state = isElim ? "eliminated" : isSel ? "active" : "idle";
            return (
              <div key={c.id} className="flex items-center gap-2">
                <button type="button" className="exam-choice" data-state={state} onClick={() => onSelect(c.id)}>
                  <span className="exam-choice-letter">{c.id}</span>
                  <span className="exam-prose" dangerouslySetInnerHTML={{ __html: c.text }} />
                </button>
                <button type="button" onClick={() => onElim(c.id)} title="Cross out" className="exam-strike">{c.id}</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StartModal({
  test,
  onPick,
  onExit,
}: {
  test: ExamTest;
  onPick: (m: Mode) => void;
  onExit: () => void;
}) {
  const mins = test.modules.reduce((s, m) => s + m.minutes, 0);
  return (
    <div className="exam grid min-h-dvh place-items-center px-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="exam-card w-full max-w-lg p-8 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: "var(--carbon-3)" }}>Study Club &middot; The arena</p>
        <h1 className="serif mt-2 text-4xl font-bold">{test.title}</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--carbon-2)" }}>
          How do you want to take it? You can&rsquo;t serve two masters &mdash; pick one.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button onClick={() => onPick("timed")} className="rounded-2xl border-2 p-5 text-left transition-colors hover:border-[var(--ember)]" style={{ borderColor: "var(--paper-line-2)" }}>
            <Clock size={22} style={{ color: "var(--ember)" }} />
            <p className="serif mt-3 text-xl font-bold">Timed</p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>Real module clock. ~{mins} min. Train under pressure.</p>
          </button>
          <button onClick={() => onPick("untimed")} className="rounded-2xl border-2 p-5 text-left transition-colors hover:border-[var(--carbon)]" style={{ borderColor: "var(--paper-line-2)" }}>
            <InfinityIcon size={22} style={{ color: "var(--carbon)" }} />
            <p className="serif mt-3 text-xl font-bold">Untimed</p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>No clock. Go slow. Analyze every move with Durden.</p>
          </button>
        </div>
        <button onClick={onExit} className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>&larr; Back to Question Bank</button>
      </motion.div>
    </div>
  );
}