"use client";

import { Target, Crosshair, Repeat2, TrendingUp } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    icon: Target,
    title: "Take a real test",
    body: "Start with a full digital SAT under real conditions. No sugar-coating — we need the truth to draw the route.",
  },
  {
    n: "02",
    icon: Crosshair,
    title: "See the gaps",
    body: "Every miss becomes a coordinate. Accuracy by topic, pacing, the patterns you keep falling for — mapped, not guessed.",
  },
  {
    n: "03",
    icon: Repeat2,
    title: "Drill what matters",
    body: "One prioritized next move, every day. The weak topic that pays the most, first. Then the next. Then the next.",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Watch it move",
    body: "Baseline versus today, in plain numbers. The streak builds. The score follows. Progress leaves evidence.",
  },
];

const card: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export function RouteSection() {
  return (
    <section id="route" className="relative scroll-mt-24 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker mb-5">How it works</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl leading-[0.95] text-bone sm:text-6xl">
                The route is a loop.
                <br />
                You just keep walking it.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-ash">
              Test, review, drill, repeat. The same loop that takes an 1100 to a
              1400 — turned into something you can open every morning and finish
              before breakfast.
            </p>
          </Reveal>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                variants={card}
                className="card card-hover group relative flex flex-col gap-5 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line-2 bg-ink-2 text-signal transition-colors group-hover:border-signal/50">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-xs tracking-[0.2em] text-ash-2">{s.n}</span>
                </div>
                <h3 className="font-display text-2xl text-bone">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ash">{s.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
