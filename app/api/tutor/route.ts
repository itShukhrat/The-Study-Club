import { NextResponse } from "next/server";
import { deepseekMessages } from "@/lib/ai";
import {
  buildSystem,
  maxTokensFor,
  isAllowed,
  type DurdenContext,
  type DurdenMessage,
  type DurdenMode,
} from "@/lib/durden";

export const runtime = "nodejs";

const MODES: DurdenMode[] = ["platform", "practice", "review", "university"];
// legacy callers: hint/explain/chat -> practice/review/practice
const LEGACY: Record<string, DurdenMode> = { hint: "practice", explain: "review", chat: "practice" };

function fallback(mode: DurdenMode): string {
  if (mode === "review")
    return "Re-read the question, find what the right answer does that the others don't, and name the trap you fell for. That's the rep.";
  if (mode === "platform")
    return "Start with the baseline test from your dashboard - it draws your route. Then one rep a day keeps the streak alive.";
  return "Strip the question to its job. Predict the answer before you look, then kill the two choices that can't do that job and commit.";
}

export async function POST(request: Request) {
  let body:
    | (Partial<DurdenContext> & { messages?: DurdenMessage[]; chosen?: string; deep?: boolean })
    | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const raw = String(body.mode || "practice");
  const mode: DurdenMode = (MODES.includes(raw as DurdenMode) ? (raw as DurdenMode) : LEGACY[raw] || "practice");

  const ctx: DurdenContext = { ...body, mode };
  if (body.chosen && !ctx.selected) ctx.selected = body.chosen; // legacy field

  // UNIVERSITY door is locked - teaser only.
  if (mode === "university") {
    return NextResponse.json({
      text: "University & scholarship guidance isn't open yet - it's being built. When it lands I'll match you to schools and scholarships by your GPA, SAT score, target year, country, and budget. For now: move the score. That's the ticket that opens every door.",
      source: "locked",
      locked: true,
    });
  }

  // TEST LOCKOUT - server-enforced, not just a hidden button.
  if (!isAllowed(ctx)) {
    return NextResponse.json({
      text: "Locked. You're in a full mock and I don't talk during the real thing. Finish the section - the moment the bell rings, I'll tear every question apart in review.",
      source: "locked",
      locked: true,
    });
  }

  let history: DurdenMessage[] = (body.messages || [])
    .slice(-10)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1400) }));

  // one-shot callers (e.g. review "explain this") send no chat history -> synthesize the ask
  if (!history.length) {
    if (mode === "review")
      history = [{ role: "user", content: "Explain this question - why the right answer is right and why mine was wrong." }];
    else if (ctx.stemHtml)
      history = [{ role: "user", content: "Help me with this question." }];
    else return NextResponse.json({ text: "Ask me what you're stuck on.", source: "empty" });
  }

  const messages = [{ role: "system" as const, content: buildSystem(ctx) }, ...history];
  const text = await deepseekMessages(messages, {
    maxTokens: maxTokensFor(ctx, !!body.deep),
    temperature: mode === "review" ? 0.4 : 0.6,
  });

  return NextResponse.json({ text: text || fallback(mode), source: text ? "ai" : "fallback" });
}