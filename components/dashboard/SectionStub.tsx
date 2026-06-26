"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Hammer } from "lucide-react";

export function SectionStub({
  title,
  line,
  status,
}: {
  title: string;
  line: string;
  status: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <Link
        href="/dashboard"
        className="mb-10 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
      >
        <ArrowLeft size={14} /> Today
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="my-auto max-w-xl"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-ink-1 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-signal">
          <Hammer size={12} /> {status}
        </span>
        <h1 className="mt-7 font-display text-6xl leading-[0.9] text-bone sm:text-7xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-bone-dim">{line}</p>
        <p className="mt-8 font-display text-2xl text-ash">
          The next chapter is being built. <span className="text-signal">Stay close.</span>
        </p>
      </motion.div>
    </div>
  );
}
