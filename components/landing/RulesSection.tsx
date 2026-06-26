"use client";

import { motion } from "framer-motion";
import { RULES, RULES_CLOSER } from "@/lib/brand";
import { Reveal } from "@/components/ui/Reveal";

export function RulesSection() {
  return (
    <section id="rules" className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 50% at 80% 30%, rgba(232,57,43,0.08), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        {/* left: statement */}
        <div>
          <Reveal>
            <p className="kicker mb-6">Before you walk in</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-5xl leading-[0.9] text-bone sm:text-7xl">
              The
              <br />
              <span className="text-signal text-glow">Rules.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-bone-dim">
              Six lines. No movie quotes. Just the things that actually decide
              whether your score moves. Read them once. Live them daily.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 font-display text-2xl leading-tight text-bone sm:text-3xl">
              {RULES_CLOSER}
            </p>
          </Reveal>
        </div>

        {/* right: torn-paper note */}
        <Reveal delay={0.1}>
          <motion.div
            initial={{ rotate: 1.4 }}
            whileHover={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="paper relative mx-auto w-full max-w-md rounded-sm p-8 sm:p-10"
          >
            {/* tape */}
            <span className="absolute -top-4 left-1/2 h-7 w-28 -translate-x-1/2 -rotate-2 bg-bone/20 backdrop-blur-sm" />
            <p className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-paper-ink/60">
              Study Club // House Rules
            </p>
            <ul className="flex flex-col divide-y divide-paper-ink/10">
              {RULES.map((r) => (
                <li key={r.n} className="flex gap-4 py-3.5">
                  <span className="font-mono text-sm font-bold text-signal-deep">{r.n}</span>
                  <div>
                    <p className="font-mono text-[0.95rem] font-semibold leading-snug text-paper-ink">
                      {r.rule}
                    </p>
                    <p className="font-mono text-[0.78rem] leading-snug text-paper-ink/60">
                      {r.sub}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t-2 border-dashed border-paper-ink/20 pt-4">
              <p className="font-mono text-[0.78rem] uppercase tracking-[0.2em] text-paper-ink/70">
                Signed on the way in — <span className="text-signal-deep">you</span>.
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
