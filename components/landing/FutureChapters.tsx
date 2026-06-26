"use client";

import { motion, type Variants } from "framer-motion";
import { Lock } from "lucide-react";
import { FUTURE_CHAPTERS } from "@/lib/brand";
import { Reveal } from "@/components/ui/Reveal";

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function FutureChapters() {
  return (
    <section id="next" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="kicker mb-5">What&apos;s next</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl leading-[0.95] text-bone sm:text-6xl">
              Your route doesn&apos;t
              <br />
              end with the SAT.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-ash">
              The next chapters are being built. Same discipline, new
              territory. They&apos;re locked for now — but they&apos;re already
              on the map.
            </p>
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FUTURE_CHAPTERS.map((c) => (
            <motion.div
              key={c.title}
              variants={card}
              className="group relative overflow-hidden rounded-2xl border border-line bg-ink-1/60 p-7 transition-colors hover:border-line-2"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(80% 80% at 50% 0%, rgba(232,57,43,0.07), transparent 70%)" }}
              />
              <div className="relative flex items-start justify-between">
                <span className="rounded-full border border-line-2 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash">
                  {c.eta}
                </span>
                <Lock size={16} className="text-ash-2 transition-colors group-hover:text-signal" />
              </div>
              <h3 className="relative mt-10 font-display text-3xl text-bone/85">{c.title}</h3>
              <p className="relative mt-2 text-sm text-ash">{c.line}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
