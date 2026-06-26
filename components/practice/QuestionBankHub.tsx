"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Sigma, Timer } from "lucide-react";
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
          <Link href="/dashboard/practice/test/test-1" className="group block">
            <div
              className="relative overflow-hidden p-8 transition-transform duration-500 group-hover:-translate-y-1 sm:p-10"
              style={{ borderRadius: "2.2rem", background: "linear-gradient(150deg,#f7e9e6,#efd9d6 55%,#e7cfd0)", boxShadow: "0 28px 70px -30px rgba(0,0,0,0.85), inset 0 2px 8px rgba(255,255,255,0.7), inset 0 -10px 24px rgba(170,120,120,0.35)" }}
            >
              <div className="pointer-events-none absolute inset-x-6 top-2 h-10 rounded-full" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.7), transparent)", filter: "blur(6px)" }} />
              <span className="pointer-events-none absolute right-7 top-6 font-display text-5xl sm:text-6xl" style={{ color: "rgba(120,70,70,0.18)", textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}>SC</span>
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={{ color: "#5b2b2b" }}>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ background: "rgba(120,40,40,0.12)", color: "#7a2d2d" }}>
                    <Timer size={11} /> Full test &middot; soap-stamped
                  </span>
                  <h2 className="mt-3 font-display text-4xl sm:text-5xl" style={{ color: "#4a1f1f", textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}>SAT Practice Test #1</h2>
                  <p className="mt-2 max-w-md text-sm" style={{ color: "#7a4a48" }}>
                    The first bar off the line. Reading &amp; Writing is live; Math is loading.
                    Timed or untimed &mdash; you choose at the door.
                  </p>
                </div>
                <span className="btn px-5 py-3 text-[0.72rem]" style={{ background: "#7a2d2d", color: "#f7e9e6", borderRadius: "0.7rem" }}>
                  Take the test <ArrowRight size={15} />
                </span>
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
