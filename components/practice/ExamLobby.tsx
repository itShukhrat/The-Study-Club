"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Play, Timer, BookOpen, Sigma } from "lucide-react";
import { RW, MATH } from "@/lib/sat-topics";

const reveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const rules = [
  "The clock runs whether you do or not.",
  "No skipping back once a module ends.",
  "Desmos is built into Math. Use it.",
  "Finish even when it's ugly. That's the point.",
];

export function ExamLobby() {
  return (
    <div className="relative flex min-h-[70vh] flex-col">
      <Link
        href="/dashboard/practice"
        className="mb-8 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
      >
        <ArrowLeft size={14} /> Question Bank
      </Link>

      <motion.div initial="hidden" animate="show" variants={reveal}>
        <span className="stamp inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-signal">
          <Timer size={11} /> Timed · the real thing
        </span>
        <h1 className="mt-4 font-display text-6xl leading-[0.85] text-bone sm:text-7xl">
          The Full
          <br />
          <span className="text-signal text-glow">Exam.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm text-ash">
          Both sections, real modules, real timing. Walk in, don&apos;t walk out
          until it&apos;s done. This is the score that tells the truth.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        className="mt-9 grid gap-4 sm:grid-cols-2"
      >
        <ModuleCard icon={<BookOpen size={20} />} name="Reading & Writing" modules={2} minutes={RW.minutes} questions={54} />
        <ModuleCard icon={<Sigma size={20} />} name="Math" modules={2} minutes={MATH.minutes} questions={44} />
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={reveal} className="mt-8">
        <p className="kicker mb-4">Rules of the room</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {rules.map((r, i) => (
            <li key={r} className="flex items-start gap-3 rounded-xl border border-line bg-ink-1/50 p-3.5 text-sm text-bone-dim">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              {r}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div initial="hidden" animate="show" variants={reveal} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <span className="font-display text-5xl text-bone">~{RW.minutes + MATH.minutes}<span className="ml-1 font-sans text-base font-normal text-ash">min</span></span>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ash-2">98 questions · 4 modules</p>
        </div>
        <Link href="/dashboard/practice/drill?mode=exam&track=rw&timed=1" className="btn btn-signal px-8 py-4 text-sm">
          <Play size={16} /> Begin the exam
        </Link>
      </motion.div>

      <p className="mt-6 text-center font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ash-2">
        Adaptive Bluebook-style engine — loading the full 98-question bank next.
      </p>
    </div>
  );
}

function ModuleCard({
  icon,
  name,
  modules,
  minutes,
  questions,
}: {
  icon: React.ReactNode;
  name: string;
  modules: number;
  minutes: number;
  questions: number;
}) {
  return (
    <motion.div variants={reveal} className="card p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-line-2 bg-ink-2 text-signal">{icon}</span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ash-2">{modules} modules</span>
      </div>
      <h3 className="mt-5 font-display text-2xl text-bone">{name}</h3>
      <div className="mt-3 flex items-center gap-4 font-mono text-[0.7rem] text-ash">
        <span>{minutes} min</span>
        <span className="h-1 w-1 rounded-full bg-ash-2" />
        <span>{questions} questions</span>
      </div>
    </motion.div>
  );
}
