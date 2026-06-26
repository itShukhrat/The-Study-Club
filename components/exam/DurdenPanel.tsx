"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Flame, Sparkles } from "lucide-react";

type Q = {
  passageHtml?: string;
  stemHtml: string;
  choices?: { id: string; text: string }[];
};

export function DurdenPanel({
  q,
  section,
  onClose,
}: {
  q: Q;
  section: string;
  onClose: () => void;
}) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function hint() {
    setLoading(true);
    setText(null);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "hint",
          section,
          passage: q.passageHtml,
          stem: q.stemHtml,
          choices: q.choices,
        }),
      });
      const data = await res.json();
      setText(data.text ?? "Durden went quiet.");
    } catch {
      setText("Couldn't reach Durden right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.aside
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="fixed right-0 top-0 z-50 flex h-dvh w-[340px] flex-col border-l shadow-2xl"
      style={{ background: "#16140f", borderColor: "rgba(255,255,255,0.08)", color: "#f4f1e9" }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3.5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "rgba(209,36,20,.18)", color: "#ff5345" }}>
            <Flame size={16} />
          </span>
          <div>
            <p className="font-display text-lg leading-none">DURDEN</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: "#8a8780" }}>your tutor</p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ color: "#8a8780" }} className="transition-colors hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {!text && !loading && (
          <p className="text-sm leading-relaxed" style={{ color: "#b8b5ac" }}>
            Stuck? I won&rsquo;t hand you the answer. I&rsquo;ll show you how to take it.
            Tap below and I&rsquo;ll point at what this question is really testing.
          </p>
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm" style={{ color: "#b8b5ac" }}>
            <Loader2 size={15} className="animate-spin" /> Durden&rsquo;s reading it&hellip;
          </div>
        )}
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="whitespace-pre-line text-[0.95rem] leading-relaxed"
          >
            {text}
          </motion.p>
        )}
      </div>

      <div className="border-t px-4 py-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button
          onClick={hint}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          style={{ background: "#d12414" }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {text ? "Push me harder" : "Give me a hint"}
        </button>
        <p className="mt-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.18em]" style={{ color: "#6b6860" }}>
          Hints only during the test — full breakdown after
        </p>
      </div>
    </motion.aside>
  );
}