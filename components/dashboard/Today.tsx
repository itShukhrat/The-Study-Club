"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Flame,
  Target,
  Sparkles,
  Play,
  Lock,
} from "lucide-react";
import { loadOnboarding, saveOnboarding, type OnboardingData } from "@/lib/onboarding";
import { fetchProfile } from "@/lib/profile";
import { MOTTOS, FEARS } from "@/lib/brand";
import { daysUntil, seededPick } from "@/lib/utils";

const coachByFear: Record<string, string> = {
  time: "You told me time is the enemy. Good — pacing is the cheapest points on this test, and the first thing we'll drill.",
  reading: "Reading bites hardest cold. We'll open every day with one short passage so it never catches you off guard.",
  math: "Math fear is usually three topics, not the whole test. We'll find yours in the baseline and aim straight at them.",
  motivation: "Motivation fades by Wednesday. The streak doesn't. Your only job today is to show up small.",
  consistency: "Consistency is the whole game. Tiny reps, every day, beat one heroic weekend. Let's start the chain.",
  anxiety: "Test anxiety is a skill problem, not a character flaw. We practice the pressure, not just the questions.",
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Today() {
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const local = loadOnboarding();
    setData(local);
    // If signed in, let the saved Supabase profile win so we remember them.
    fetchProfile().then((p) => {
      if (p) {
        const merged = { ...local, ...p };
        setData(merged);
        saveOnboarding(merged);
      }
    });
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const motto = useMemo(() => {
    const seed = Math.floor(Date.now() / 86_400_000);
    return seededPick(MOTTOS, seed);
  }, []);

  if (!data) return <TodaySkeleton />;

  const name = data.name?.trim() || "stranger";
  const days = data.examDate ? daysUntil(data.examDate) : null;
  const coachNotes = data.fears.map((f) => coachByFear[f]).filter(Boolean).slice(0, 2);
  const gapNames =
    data.struggles.length > 0
      ? data.struggles
      : data.fears.map((id) => FEARS.find((f) => f.id === id)?.label ?? id);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="flex flex-col gap-6"
    >
      {/* greeting */}
      <motion.header variants={fadeUp} className="flex flex-col gap-1">
        <p className="kicker">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 className="font-display text-4xl text-bone sm:text-5xl">
          {greeting}, <span className="text-signal">{name}</span>.
        </h1>
        <p className="mt-1 text-sm text-ash">{motto}</p>
      </motion.header>

      {/* stat row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          icon={<CalendarClock size={18} />}
          label="SAT in"
          value={days !== null ? String(days) : "—"}
          unit={days !== null ? "days" : "set a date"}
          accent
        />
        <Stat
          icon={<Target size={18} />}
          label="Target"
          value={String(data.targetScore)}
          unit="/ 1600"
        />
        <Stat icon={<Flame size={18} />} label="Streak" value="0" unit="start today" />
      </motion.div>

      {/* primary move */}
      <motion.div variants={fadeUp}>
        <div className="card relative overflow-hidden p-7 sm:p-9">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(70% 90% at 100% 0%, rgba(232,57,43,0.12), transparent 60%)" }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <p className="kicker mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-signal" />
                Today&apos;s move
              </p>
              <h2 className="font-display text-3xl leading-[0.95] text-bone sm:text-4xl">
                Take your baseline test.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                We can&apos;t draw the route until we know where you&apos;re standing.
                One full digital SAT, real conditions. Then your map appears.
              </p>
            </div>
            <Link href="/dashboard/practice" className="btn btn-signal shrink-0">
              <Play size={16} /> Start the test
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* coach */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <div className="card h-full p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal">
                <Sparkles size={16} />
              </span>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">
                Your coach
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {coachNotes.length > 0 ? (
                coachNotes.map((note, i) => (
                  <p key={i} className="text-[0.95rem] leading-relaxed text-bone-dim">
                    {note}
                  </p>
                ))
              ) : (
                <p className="text-[0.95rem] leading-relaxed text-bone-dim">
                  Take the baseline and I&apos;ll stop guessing — I&apos;ll tell you
                  exactly which 100 points are closest, and what to do first.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* gaps */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="card h-full p-6">
            <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">
              Aiming at
            </p>
            <div className="flex flex-wrap gap-2">
              {gapNames.slice(0, 8).map((g) => (
                <span
                  key={g}
                  className="rounded-full border border-line-2 bg-ink-2 px-3 py-1.5 text-xs text-bone-dim"
                >
                  {g}
                </span>
              ))}
              {gapNames.length === 0 && (
                <span className="text-sm text-ash">We&apos;ll find these in your first test.</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* today's queue (locked until baseline) */}
      <motion.div variants={fadeUp}>
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">
          Unlocks after your baseline
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Daily warm-up", "10 questions, mixed difficulty"],
            ["Review the misses", "Turn yesterday's mistakes into reps"],
            ["Word of the day", "Keep the vocab streak breathing"],
          ].map(([title, sub]) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-2xl border border-line bg-ink-1/50 p-4 opacity-70"
            >
              <Lock size={15} className="text-ash-2" />
              <div>
                <p className="text-sm text-bone-dim">{title}</p>
                <p className="text-xs text-ash">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <Link
        href="/dashboard/progress"
        className="group flex items-center justify-center gap-2 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
      >
        See the full route
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

function Stat({
  icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`grid h-11 w-11 place-items-center rounded-xl border border-line-2 ${
          accent ? "bg-signal/15 text-signal" : "bg-ink-2 text-bone-dim"
        }`}
      >
        {icon}
      </span>
      <div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">{label}</p>
        <p className="font-display text-3xl leading-none text-bone">
          {value} <span className="font-sans text-xs font-normal text-ash">{unit}</span>
        </p>
      </div>
    </div>
  );
}

function TodaySkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-14 w-2/3 animate-pulse rounded-xl bg-ink-2" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-ink-2" />
        ))}
      </div>
      <div className="h-44 animate-pulse rounded-2xl bg-ink-2" />
    </div>
  );
}
