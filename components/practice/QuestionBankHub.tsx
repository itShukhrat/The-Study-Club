"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Sigma, Timer, Swords } from "lucide-react";
import { RW, MATH } from "@/lib/sat-topics";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function QuestionBankHub() {
  return (
    <div className="flex flex-col">
      <Link
        href="/dashboard"
        className="mb-8 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
      >
        <ArrowLeft size={14} /> Today
      </Link>

      <div className="mb-10">
        <p className="kicker">The arena</p>
        <h1 className="mt-1 font-display text-6xl leading-[0.85] text-bone sm:text-7xl">
          Question
          <br />
          <span className="text-signal text-glow">Bank.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm text-ash">
          Pick a fight. Drill a section, or sit the whole thing under real timing.
          Every rep is logged — the route learns from it.
        </p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            track="rw"
            icon={<BookOpen size={22} strokeWidth={1.6} />}
            count={RW.total}
            title="Reading & Writing"
            blurb={RW.blurb}
            minutes={RW.minutes}
          />
          <SectionCard
            track="math"
            icon={<Sigma size={22} strokeWidth={1.6} />}
            count={MATH.total}
            title="Math"
            blurb={MATH.blurb}
            minutes={MATH.minutes}
          />
        </div>

        {/* Full exam — the main event */}
        <motion.div variants={item}>
          <Link href="/dashboard/practice/exam" className="group block">
            <div className="card card-hover relative overflow-hidden p-7 sm:p-9">
              <div
                className="pointer-events-none absolute inset-0 opacity-90"
                style={{ background: "radial-gradient(90% 120% at 100% 0%, rgba(232,57,43,0.16), transparent 60%)" }}
              />
              {/* drawn route */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.path
                  d="M-2 80 C 24 78, 32 40, 52 40 S 80 12, 104 8"
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="0.3"
                  opacity="0.35"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
                />
              </svg>
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-signal/40 bg-signal/10 text-signal">
                    <Swords size={26} strokeWidth={1.6} />
                  </span>
                  <div>
                    <span className="stamp inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-signal">
                      <Timer size={11} /> Timed · both sections
                    </span>
                    <h2 className="mt-3 font-display text-4xl text-bone sm:text-5xl">The Full Exam</h2>
                    <p className="mt-2 max-w-md text-sm text-ash">
                      Reading &amp; Writing, then Math — real modules, real clock.
                      This is the one that tells the truth.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-1">
                  <span className="font-display text-4xl text-bone">
                    ~{RW.minutes + MATH.minutes}
                    <span className="ml-1 font-sans text-sm font-normal text-ash">min</span>
                  </span>
                  <span className="btn btn-signal mt-0 px-5 py-3 text-[0.72rem] sm:mt-3">
                    Sit the exam <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SectionCard({
  track,
  icon,
  count,
  title,
  blurb,
  minutes,
}: {
  track: string;
  icon: React.ReactNode;
  count: number;
  title: string;
  blurb: string;
  minutes: number;
}) {
  return (
    <motion.div variants={item} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>
      <Link href={`/dashboard/practice/${track}`} className="group block h-full">
        <div className="card relative h-full overflow-hidden p-7">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(80% 90% at 50% 0%, rgba(232,57,43,0.10), transparent 70%)" }}
          />
          {/* faint background number */}
          <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] leading-none text-bone/[0.03]">
            {track === "rw" ? "RW" : "M"}
          </span>

          <div className="relative flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-line-2 bg-ink-2 text-signal transition-colors group-hover:border-signal/50">
              {icon}
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash-2">
              {minutes} min · {count} Qs
            </span>
          </div>

          <h2 className="relative mt-12 font-display text-4xl text-bone">{title}</h2>
          <p className="relative mt-2 text-sm text-ash">{blurb}</p>

          <div className="relative mt-6 flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-bone-dim transition-colors group-hover:text-signal">
            Open
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
