"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-44">
      {/* drawn route climbing across */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <motion.path
          d="M-2 86 C 24 84, 30 50, 52 48 S 82 18, 104 8"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="0.25"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M-2 92 C 26 90, 34 58, 56 54 S 84 26, 104 14"
          fill="none"
          stroke="var(--color-azure)"
          strokeWidth="0.2"
          opacity="0.32"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="kicker mb-8">No more guessing</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-5xl leading-[0.9] text-bone sm:text-7xl md:text-8xl">
            Let&apos;s make your
            <br />
            <span className="brush text-signal">score</span> move.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 max-w-md text-balance text-lg text-bone-dim">
            Take your first test. Get your route. It&apos;s free to start, and it
            takes about ninety seconds to walk in.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex justify-center">
            <MagneticButton href="/enter" className="px-8 py-4 text-sm">
              Enter the Club <ArrowRight size={16} />
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash-2">
            Free to start · No card · Cancel the route anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}
