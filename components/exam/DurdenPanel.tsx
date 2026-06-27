"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, Flame, ArrowUp, Lock } from "lucide-react";
import type { DurdenContext, DurdenMode } from "@/lib/durden";

type Msg = { role: "user" | "assistant"; content: string };
type Ctx = Partial<DurdenContext> & { mode: DurdenMode };

const SUBTITLE: Record<DurdenMode, string> = {
  practice: "practice coach",
  review: "review engine",
  platform: "your guide",
  university: "coming soon",
};

function quickPrompts(ctx: Ctx): string[] {
  if (ctx.mode === "review")
    return ["Why is the right answer right?", "Why did my answer fail?", "What should I drill next?"];
  if (ctx.mode === "platform")
    return ["What do I do first?", "How do streaks work?", "How does practice work?"];
  // practice
  const base = ["What's the trap here?", "Walk me through it"];
  if (ctx.section === "Math") base.push("Show me the Desmos way");
  base.push("Just give me the answer");
  return base;
}

export function DurdenPanel({ ctx, onClose }: { ctx: Ctx; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // new question / new context -> fresh conversation
  useEffect(() => {
    setMsgs([]);
  }, [ctx.stemHtml, ctx.mode]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || loading) return;
    const next = [...msgs, { role: "user" as const, content: t }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...ctx, messages: next }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.text ?? "..." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Couldn't reach Durden right now." }]);
    } finally {
      setLoading(false);
    }
  }

  const locked = ctx.allowed === false;

  return (
    <div className="flex h-full flex-col" style={{ background: "#fbfaf6", borderLeft: "1px solid var(--paper-line)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "rgba(209,36,20,.12)", color: "var(--ember)" }}>
            <Flame size={15} />
          </span>
          <span className="font-display text-lg leading-none" style={{ color: "var(--carbon)" }}>DURDEN</span>
          <span className="font-mono text-[0.54rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>{SUBTITLE[ctx.mode]}</span>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ color: "var(--carbon-3)" }} className="transition-colors hover:text-[var(--carbon)]">
          <X size={18} />
        </button>
      </div>
      <div className="exam-divider mt-3 h-px" style={{ background: "var(--paper-line)" }} />

      {/* body */}
      <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4">
        {locked ? (
          <div className="grid h-full place-content-center text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "#efece4", color: "var(--carbon-3)" }}><Lock size={20} /></span>
            <p className="serif mt-3 text-lg font-bold" style={{ color: "var(--carbon)" }}>Silent during the mock.</p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>This is the real thing. Finish it, then I&rsquo;ll tear every question apart in review.</p>
          </div>
        ) : msgs.length === 0 ? (
          <div className="grid h-full place-content-center text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "rgba(209,36,20,.1)", color: "var(--ember)" }}><Flame size={22} /></span>
            <p className="serif mt-3 text-xl font-bold" style={{ color: "var(--carbon)" }}>
              {ctx.mode === "platform" ? "What do you want to know?" : ctx.mode === "review" ? "Let's break it down." : "What are you stuck on?"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>
              {ctx.mode === "platform" ? "Ask how anything here works." : "Short and sharp. Ask, or tap one:"}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {quickPrompts(ctx).map((qp) => (
                <button key={qp} onClick={() => send(qp)}
                  className="rounded-full border px-3.5 py-2 text-sm transition-colors hover:border-[var(--ember)]"
                  style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon)" }}>
                  {qp}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {msgs.map((m, i) => (
              <div key={i} className={"mb-3 flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
                <div className="max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.9rem] leading-relaxed"
                  style={m.role === "user"
                    ? { background: "var(--carbon)", color: "var(--paper)" }
                    : { background: "#fff", border: "1px solid var(--paper-line)", color: "var(--carbon)" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--carbon-2)" }}>
                <Loader2 size={14} className="animate-spin" /> Durden&rsquo;s reading it&hellip;
              </div>
            )}
          </>
        )}
      </div>

      {/* input */}
      {!locked && (
        <div className="px-3 pb-3">
          <div className="flex items-end gap-2 rounded-2xl border px-3 py-2" style={{ borderColor: "var(--paper-line-2)", background: "#fff" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              placeholder="Ask Durden…"
              className="max-h-28 flex-1 resize-none bg-transparent py-1 text-sm outline-none"
              style={{ color: "var(--carbon)" }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white disabled:opacity-40" style={{ background: "var(--ember)" }}>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}