"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  Calculator as CalcIcon,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Clock,
  Highlighter,
  ArrowLeft,
  ArrowRight,
  X,
  Pause,
  Play,
  FileText,
  Flag,
  StickyNote,
  Infinity as InfinityIcon,
  Gem,
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
  return `${m.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

const REFERENCE: string[] = [
  "A = πr²    C = 2πr",
  "A = ℓw    A = ½bh",
  "c² = a² + b²  (right triangle)",
  "30-60-90 → x, x√3, 2x",
  "45-45-90 → s, s, s√2",
  "V = ℓwh    V = πr²h",
  "V = 4/3·πr³    V = ⅓·πr²h",
  "Circle = 360° = 2π rad",
  "Triangle angles sum to 180°",
];

export function ExamRunner({ test }: { test: ExamTest }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode | null>(null);
  const [mi, setMi] = useState(0);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [elim, setElim] = useState<Record<string, Record<string, boolean>>>({});
  const [calcOpen, setCalcOpen] = useState(false);
  const [refOpen, setRefOpen] = useState(false);
  const [dirOpen, setDirOpen] = useState(false);
  const [durden, setDurden] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [hideTimer, setHideTimer] = useState(false);
  const [paused, setPaused] = useState(false);
  const [palette, setPalette] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secLeft, setSecLeft] = useState<number | null>(null);

  const moduleObj = test.modules[mi];
  const q = moduleObj.questions[qi];
  const isMath = moduleObj.section === "math";
  const key = answerKey(moduleObj.id, q.n);
  const total = moduleObj.questions.length;
  const answeredCount = moduleObj.questions.filter((qq) => answers[answerKey(moduleObj.id, qq.n)]).length;

  useEffect(() => {
    if (mode === "timed") setSecLeft(moduleObj.minutes * 60);
    else setSecLeft(null);
    setCalcOpen(false);
    setRefOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mi, mode]);

  function advanceModule() {
    if (mi < test.modules.length - 1) { setMi(mi + 1); setQi(0); }
    else setFinished(true);
  }

  useEffect(() => {
    if (mode !== "timed" || paused || finished || secLeft == null) return;
    if (secLeft <= 0) { advanceModule(); return; }
    const t = setTimeout(() => setSecLeft((s) => (s == null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, paused, finished, secLeft]);

  function select(letter: string) { if (elim[key]?.[letter]) return; setAnswers((a) => ({ ...a, [key]: letter })); }
  function setSpr(v: string) { setAnswers((a) => ({ ...a, [key]: v })); }
  function toggleElim(letter: string) {
    setElim((e) => { const cur = { ...(e[key] || {}) }; cur[letter] = !cur[letter]; return { ...e, [key]: cur }; });
    if (answers[key] === letter) setAnswers((a) => ({ ...a, [key]: "" }));
  }
  function toggleMark() { setMarked((m) => ({ ...m, [key]: !m[key] })); }
  function next() { if (qi < total - 1) setQi(qi + 1); else advanceModule(); }
  function back() { if (qi > 0) setQi(qi - 1); }

  if (mode === null) return <StartModal test={test} onPick={setMode} onExit={() => router.push("/dashboard/practice")} />;
  if (finished) return <ScoreReport test={test} answers={answers} onRetake={() => { setAnswers({}); setMarked({}); setElim({}); setFinished(false); setMi(0); setQi(0); setMode(null); }} onExit={() => router.push("/dashboard/practice")} />;

  const lastOfTest = mi === test.modules.length - 1 && qi === total - 1;
  const card = (
    <motion.div
      key={`${mi}-${qi}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <QuestionCard q={q} selected={answers[key]} elim={elim[key]} marked={!!marked[key]} onSelect={select} onSpr={setSpr} onElim={toggleElim} onMark={toggleMark} />
    </motion.div>
  );

  return (
    <div className="exam fixed inset-0 z-[80] flex flex-col">
      <header className="relative flex items-center justify-between gap-3 border-b px-4 py-2.5" style={{ borderColor: "var(--paper-line)" }}>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard/practice")} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--carbon-2)" }}>
            <ArrowLeft size={16} /> Go back
          </button>
          <button onClick={() => setDirOpen((d) => !d)} className="flex items-center gap-1 text-sm font-medium" style={{ color: "var(--carbon-2)" }}>
            Directions <ChevronDown size={14} />
          </button>
        </div>

        <div className="absolute left-1/2 top-2 flex -translate-x-1/2 flex-col items-center">
          {secLeft != null ? (
            <>
              <span className={"font-display text-2xl tabular-nums " + (secLeft <= 300 ? "exam-timer-low" : "")}>{hideTimer ? "•••••" : fmt(secLeft)}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPaused((p) => !p)} className="grid h-5 w-5 place-items-center rounded-full border" style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon-2)" }}>
                  {paused ? <Play size={10} /> : <Pause size={10} />}
                </button>
                <button onClick={() => setHideTimer((h) => !h)} className="rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium" style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon-2)" }}>
                  {hideTimer ? "Show" : "Hide"}
                </button>
              </div>
            </>
          ) : (
            <span className="mt-1 flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]" style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon-2)" }}><Clock size={11} /> Untimed</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <ToolBtn onClick={() => setHighlight((h) => !h)} on={highlight} icon={<Highlighter size={16} />} label="Highlight" />
          {isMath && <ToolBtn onClick={() => setCalcOpen((c) => !c)} on={calcOpen} icon={<CalcIcon size={16} />} label="Calculator" />}
          {isMath && <ToolBtn onClick={() => setRefOpen((r) => !r)} on={refOpen} icon={<FileText size={16} />} label="Reference" />}
          <span className="ml-1 flex items-center gap-1.5 rounded-full border px-2.5 py-1" style={{ borderColor: "var(--paper-line-2)" }}>
            <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--ember)" }}><Flame size={14} /> {answeredCount}</span>
            <span className="h-3 w-px" style={{ background: "var(--paper-line-2)" }} />
            <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "var(--carbon)" }}><Gem size={13} /> {total}</span>
          </span>
          {!durden && (
            <button onClick={() => setDurden(true)} className="exam-toolbtn is-ember ml-1" title="Durden AI"><Flame size={16} /> <span className="hidden sm:inline">Durden AI</span></button>
          )}
        </div>

        <AnimatePresence>
          {dirOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDirOpen(false)} />
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="exam-card absolute left-24 top-14 z-20 w-[min(92vw,420px)] p-5 text-sm" style={{ color: "var(--carbon-2)" }}>
                <p className="serif mb-2 text-base font-bold" style={{ color: "var(--carbon)" }}>Directions</p>
                {isMath
                  ? "Solve each problem and choose the best answer, or type your student-produced response. A calculator is allowed on every question."
                  : "Read each passage and question, then choose the best answer based on the passage(s). Each question has one best answer."}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <div className={"flex min-h-0 flex-1 " + (highlight ? "exam-hl-on" : "")}>
        <div className="min-w-0 flex-1">
          {isMath ? (
            <div className="exam-watermark relative h-full overflow-y-auto">
              <div className="mx-auto max-w-2xl px-6 py-8">{card}</div>
            </div>
          ) : (
            <div className="grid h-full md:grid-cols-2">
              <div className="exam-prose serif overflow-y-auto border-r px-6 py-8 text-[1.04rem] leading-relaxed" style={{ borderColor: "var(--paper-line)" }} dangerouslySetInnerHTML={{ __html: q.passageHtml || "" }} />
              <div className="exam-watermark relative overflow-y-auto px-6 py-8">
                <div className="relative z-10 mx-auto max-w-xl">{card}</div>
              </div>
            </div>
          )}
        </div>
        {durden && (
          <div className="hidden w-[360px] shrink-0 md:block">
            <DurdenPanel q={q} section={isMath ? "Math" : "Reading & Writing"} onClose={() => setDurden(false)} />
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between border-t px-4 py-3" style={{ borderColor: "var(--paper-line)" }}>
        <button onClick={() => setPalette((p) => !p)} className="exam-btn exam-btn-primary px-4 py-2.5 text-[0.8rem]">
          Question {qi + 1} of {total} <ChevronDown size={14} className={palette ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
        <div className="hidden items-center sm:flex">
          <button onClick={() => setDurden(true)} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--ember)" }}><Flame size={15} /> Ask Durden</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={back} disabled={qi === 0} className="exam-btn exam-btn-ghost px-5 py-2.5 disabled:opacity-40"><ArrowLeft size={15} /> Back</button>
          <button onClick={next} className="exam-btn exam-btn-ember px-6 py-2.5">{lastOfTest ? "Finish" : "Next"} <ArrowRight size={15} /></button>
        </div>
      </footer>

      <AnimatePresence>
        {paused && secLeft != null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center" style={{ background: "rgba(20,19,15,0.55)", backdropFilter: "blur(4px)" }}>
            <div className="exam-card p-8 text-center">
              <p className="serif text-2xl font-bold">Paused.</p>
              <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>The clock&rsquo;s waiting. So is the score.</p>
              <button onClick={() => setPaused(false)} className="exam-btn exam-btn-ember mt-5"><Play size={15} /> Resume</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {calcOpen && isMath && (
          <motion.div drag dragMomentum={false} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="exam-card fixed left-6 top-20 z-[85] w-[min(92vw,460px)] overflow-hidden p-0">
            <div className="flex cursor-grab items-center justify-between border-b px-3 py-2" style={{ borderColor: "var(--paper-line)" }}>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>Desmos &middot; drag me</span>
              <button onClick={() => setCalcOpen(false)} style={{ color: "var(--carbon-3)" }}><X size={15} /></button>
            </div>
            <DesmosCalculator height={380} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {refOpen && isMath && (
          <motion.div drag dragMomentum={false} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="exam-card fixed right-6 top-20 z-[85] w-[min(92vw,320px)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>Reference</span>
              <button onClick={() => setRefOpen(false)} style={{ color: "var(--carbon-3)" }}><X size={15} /></button>
            </div>
            <ul className="serif flex flex-col gap-1.5 text-[0.92rem]">{REFERENCE.map((r) => <li key={r}>{r}</li>)}</ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {palette && (
          <>
            <div onClick={() => setPalette(false)} className="fixed inset-0 z-[40]" />
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="exam-card fixed bottom-[64px] left-4 z-[50] w-[min(92vw,560px)] p-5">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
function ToolBtn({ onClick, on, icon, label }: { onClick: () => void; on: boolean; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition-colors" style={{ color: on ? "var(--ember)" : "var(--carbon-2)" }} title={label}>
      {icon}
      <span className="text-[0.6rem] font-medium">{label}</span>
    </button>
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
      <div className="mb-5 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "#f1eee6" }}>
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded text-sm font-bold text-white" style={{ background: "var(--carbon)" }}>{q.n}</span>
          <button onClick={onMark} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: marked ? "var(--ember)" : "var(--carbon-2)" }}>
            {marked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} Mark for Review
          </button>
        </div>
        <div className="flex items-center gap-3" style={{ color: "var(--carbon-3)" }}>
          <button title="Notes" className="transition-colors hover:text-[var(--carbon)]"><StickyNote size={15} /></button>
          <button title="Report a problem" className="flex items-center gap-1 text-xs transition-colors hover:text-[var(--ember)]"><Flag size={13} /> Report</button>
        </div>
      </div>

      <div className="exam-prose serif mb-5 text-[1.06rem] leading-relaxed" dangerouslySetInnerHTML={{ __html: q.stemHtml }} />

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
    <div className="exam fixed inset-0 z-[80] grid place-items-center overflow-y-auto px-5 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="exam-card w-full max-w-lg p-8 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: "var(--carbon-3)" }}>Study Club &middot; The arena</p>
        <h1 className="serif mt-2 text-4xl font-bold">{test.title}</h1>
        <p className="mt-3 text-sm" style={{ color: "var(--carbon-2)" }}>
          Two ways in. One clock, or none. Choose how you train &mdash; then own it.
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
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>No clock. Go slow. Take every question apart with Durden.</p>
          </button>
        </div>
        <button onClick={onExit} className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>&larr; Back to Question Bank</button>
      </motion.div>
    </div>
  );
}