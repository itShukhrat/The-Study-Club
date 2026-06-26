"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Target, Layers, Clock } from "lucide-react";
import type { Track } from "@/lib/sat-topics";

const reveal: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/** 5-segment mastery meter — the "level" of each topic. */
function Mastery({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Mastery ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-4 w-1.5 rounded-full transition-colors"
          style={{
            background: i <= level ? "var(--color-signal)" : "var(--color-ink-3)",
          }}
        />
      ))}
    </div>
  );
}

export function TopicCatalogue({ track }: { track: Track }) {
  const topicCount = track.domains.reduce((n, d) => n + d.topics.length, 0);

  return (
    <div className="flex flex-col">
      <Link
        href="/dashboard/practice"
        className="mb-7 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
      >
        <ArrowLeft size={14} /> Question Bank
      </Link>

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">{track.id === "rw" ? "Section 1" : "Section 2"}</p>
          <h1 className="mt-1 font-display text-5xl text-bone sm:text-6xl">{track.name}</h1>
        </div>
        <div className="flex gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash">
          <span className="rounded-full border border-line-2 px-3 py-1.5">{topicCount} topics</span>
          <span className="rounded-full border border-line-2 px-3 py-1.5">{track.total} Qs</span>
        </div>
      </div>

      {/* recommended + practice-all */}
      <motion.div initial="hidden" animate="show" variants={reveal} className="mb-8 grid gap-3 lg:grid-cols-2">
        <Link
          href={`/dashboard/practice/drill?track=${track.id}&mode=weak`}
          className="group relative overflow-hidden rounded-2xl border border-signal/40 bg-signal/[0.07] p-5"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(80% 120% at 100% 0%, rgba(232,57,43,0.18), transparent 60%)" }} />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="kicker mb-2 flex items-center gap-2 text-signal">
                <Target size={12} /> Recommended
              </p>
              <p className="font-display text-2xl leading-tight text-bone">
                Drill a mix of 20.
              </p>
              <p className="mt-1 text-xs text-ash">Take the baseline and this aims at your weakest topics.</p>
            </div>
            <span className="btn btn-signal shrink-0 px-4 py-3 text-[0.72rem]">
              <Play size={14} /> ~14 min
            </span>
          </div>
        </Link>

        <Link
          href={`/dashboard/practice/drill?track=${track.id}&mode=all`}
          className="group flex items-center justify-between rounded-2xl border border-line bg-ink-1/60 p-5 transition-colors hover:border-line-2"
        >
          <div>
            <p className="font-medium text-bone">Practice all topics</p>
            <p className="mt-1 text-xs text-ash">Mixed difficulty across all {topicCount} skills.</p>
          </div>
          <ArrowRight size={16} className="text-ash transition-transform group-hover:translate-x-1 group-hover:text-bone" />
        </Link>
      </motion.div>

      {/* domains */}
      <div className="flex flex-col gap-9">
        {track.domains.map((domain, di) => (
          <motion.section
            key={domain.name}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={reveal}
          >
            <div className="mb-3 flex items-center gap-3">
              <Layers size={14} className="text-signal" />
              <h2 className="font-mono text-[0.78rem] uppercase tracking-[0.22em] text-bone-dim">{domain.name}</h2>
              <span className="ml-auto font-mono text-[0.62rem] tracking-[0.16em] text-ash-2">
                {di + 1} / {track.domains.length}
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line">
              {domain.topics.map((topic, ti) => (
                <Link
                  key={topic.id}
                  href={`/dashboard/practice/drill?track=${track.id}&topic=${topic.id}`}
                  className={`group flex items-center gap-4 bg-ink-1/40 px-4 py-4 transition-colors hover:bg-ink-2 sm:px-5 ${
                    ti > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <Mastery level={0} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.95rem] text-bone">{topic.name}</p>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash-2">
                      0 / {topic.count} · untouched
                    </p>
                  </div>
                  {/* accuracy */}
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="h-2 w-2 rounded-full bg-ink-3" />
                    <span className="w-9 text-right font-mono text-xs text-ash">—</span>
                  </div>
                  <span className="flex items-center gap-1 rounded-lg border border-line-2 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-bone-dim transition-colors group-hover:border-signal/50 group-hover:text-signal">
                    <Play size={11} /> Drill
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash-2">
        <Clock size={12} /> {track.minutes} minutes on the real thing
      </div>
    </div>
  );
}
