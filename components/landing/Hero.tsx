"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { HERO_LINES, HERO_FINAL } from "@/lib/brand";
import { MagneticButton } from "@/components/ui/MagneticButton";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.55, delayChildren: 0.45 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pt-28 pb-20">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="kicker mb-8 flex items-center gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse-ring rounded-full bg-signal" />
          Study Club // SAT
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display text-[13vw] leading-[0.9] text-bone sm:text-7xl md:text-[5.6rem] lg:text-[6.6rem]"
        >
          {HERO_LINES.map((l, i) => (
            <motion.span key={l} variants={line} className="block">
              {i === 2 ? (
                <>
                  The distance between them{" "}
                  <span className="text-ash">is your</span>{" "}
                  <span className="brush text-bone">route</span>.
                </>
              ) : (
                l
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center"
        >
          <p className="font-display text-2xl text-signal text-glow sm:text-3xl">
            {HERO_FINAL}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton href="/enter">
              Begin the route <ArrowRight size={16} />
            </MagneticButton>
            <Link
              href="#rules"
              className="btn btn-ghost"
            >
              Read the rules
            </Link>
          </div>
        </motion.div>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-ash">
          No fluff. One test, one plan, one next move — and proof you&apos;re
          getting closer. It&apos;s free to start.
        </p>
      </div>

      <motion.a
        href="#route"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-ash transition-colors hover:text-bone"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={16} className="animate-float" />
      </motion.a>
    </section>
  );
}

/** Ghosted scores connected by a drawing route — the metaphor, literalized. */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(68% 55% at 74% 12%, rgba(214,35,19,0.11), transparent 60%), radial-gradient(60% 50% at 10% 82%, rgba(43,92,240,0.12), transparent 60%)",
        }}
      />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 40%, black, transparent 78%)",
        }}
      />
      {/* ghost current score */}
      <span className="absolute bottom-[14%] left-[6%] font-display text-[18vw] leading-none text-bone/[0.03] sm:text-[10rem]">
        1120
      </span>
      {/* ghost target */}
      <span className="absolute right-[6%] top-[16%] font-display text-[18vw] leading-none text-azure/[0.10] sm:text-[10rem]">
        1500
      </span>
      {/* the route between them */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <motion.path
          d="M14 80 C 30 78, 34 60, 50 58 S 70 40, 86 22"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.35"
          strokeDasharray="1.4 1.4"
          opacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: "easeInOut", delay: 0.6 }}
        />
      </svg>
    </div>
  );
}
