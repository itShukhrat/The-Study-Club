"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Flame, ArrowUp, Lock } from "lucide-react";

type Q = {
  passageHtml?: string;
  stemHtml: string;
  choices?: { id: string; text: string }[];
  skill?: string;
  domain?: string;
};
type Msg = { role: "user" | "assistant"; content: string };

const QUICK = ["Point me at the key line.", "Walk me through it.", "What&rsquo;s the play here?"];
const QUICK_RAW = ["Point me at the key line.", "Walk me through it.", "What's the play here?"];

export function DurdenPanel({
  q,
  section,
  onClose,
}: {
  q: Q;
  section: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"ask" | "explain" | "info">("ask");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // reset the conversation when the question changes
  useEffect(() => {
    setMsgs([]);
    setTab("ask");
  }, [q.stemHtml]);

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
        body: JSON.stringify({ mode: "chat", section, passage: q.passageHtml, stem: q.stemHtml, choices: q.choices, messages: next }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.text ?? "..." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Couldn't reach Durden right now." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col" style={{ background: "#fbfaf6", borderLeft: "1px solid var(--paper-line)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "rgba(209,36,20,.12)", color: "var(--ember)" }}>
            <Flame size={15} />
          </span>
          <span className="font-display text-lg leading-none" style={{ color: "var(--carbon)" }}>DURDEN</span>
          <span className="font-mono text-[0.54rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>your tutor</span>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ color: "var(--carbon-3)" }} className="transition-colors hover:text-[var(--carbon)]">
          <X size={18} />
        </button>
      </div>

      {/* tabs */}
      <div className="mt-3 flex gap-1 px-4">
        {([["ask","Ask Durden"],["explain","Explanation"],["info","Info"]] as const).map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="rounded-t-lg px-3 py-1.5 text-[0.78rem] font-medium transition-colors"
            style={{ color: tab===id ? "var(--carbon)" : "var(--carbon-3)", borderBottom: tab===id ? "2px solid var(--ember)" : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>
      <div className="exam-divider h-px" />

      {/* body */}
      <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "ask" && (
          <>
            {msgs.length === 0 && (
              <div className="grid h-full place-content-center text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "rgba(209,36,20,.1)", color: "var(--ember)" }}><Flame size={22} /></span>
                <p className="serif mt-3 text-xl font-bold" style={{ color: "var(--carbon)" }}>What are you stuck on?</p>
                <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>I won&rsquo;t hand you the letter. I&rsquo;ll show you how to take it.</p>
                <div className="mt-5 flex flex-col gap-2">
                  {QUICK.map((qp, i) => (
                    <button key={i} onClick={() => send(QUICK_RAW[i])}
                      className="rounded-full border px-3.5 py-2 text-sm transition-colors hover:border-[var(--ember)]"
                      style={{ borderColor: "var(--paper-line-2)", color: "var(--carbon)" }}
                      dangerouslySetInnerHTML={{ __html: qp }} />
                  ))}
                </div>
              </div>
            )}
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

        {tab === "explain" && (
          <div className="grid h-full place-content-center text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "#efece4", color: "var(--carbon-3)" }}><Lock size={20} /></span>
            <p className="serif mt-3 text-lg font-bold" style={{ color: "var(--carbon)" }}>Locked till the bell.</p>
            <p className="mt-1 text-sm" style={{ color: "var(--carbon-2)" }}>Finish the test and I&rsquo;ll tear every question apart — answer, trap, and the habit that fixes it.</p>
          </div>
        )}

        {tab === "info" && (
          <div className="text-sm" style={{ color: "var(--carbon-2)" }}>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: "var(--carbon-3)" }}>This question tests</p>
            <p className="serif mt-1 text-lg font-bold" style={{ color: "var(--carbon)" }}>{q.skill || q.domain || "SAT skill"}</p>
            <p className="mt-3">Domain: {q.domain}</p>
            <p className="mt-3" style={{ color: "var(--carbon-3)" }}>Tip: name the job of the blank or the question before you look at a single choice. Prediction beats recognition.</p>
          </div>
        )}
      </div>

      {/* input */}
      {tab === "ask" && (
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
          <p className="mt-1.5 text-center font-mono text-[0.56rem] uppercase tracking-[0.14em]" style={{ color: "var(--carbon-3)" }}>
            Durden coaches — he won&rsquo;t hand you the answer
          </p>
        </div>
      )}
    </div>
  );
}