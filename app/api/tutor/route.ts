import { NextResponse } from "next/server";
import { deepseekChat, deepseekMessages } from "@/lib/ai";

export const runtime = "nodejs";

const strip = (s: unknown) =>
  String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&aacute;/g, "á")
    .replace(/&atilde;/g, "ã")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2400);

const DURDEN = `You are DURDEN — the AI tutor inside Study Club, an SAT app.
Persona: a genuinely excellent SAT teacher with the swagger and bite of Tyler Durden
(never quote or name the film). Sharp, fast, dry wit — a clever line here and there,
never a clown. You make students THINK; you do not do their thinking for them.
Hard rules:
- During a LIVE question, never reveal or strongly imply the correct choice. If they
  beg for "the answer" or "which letter," refuse with attitude and hand them the ONE
  move that cracks it instead.
- Stay on THIS question/passage and real SAT strategy. If they wander (jokes, life
  advice, unrelated stuff), snap them back in a single line, then keep teaching.
- No "As an AI," no disclaimers, no emoji, no corporate filler. Second person.
- Tight by default (under ~80 words). If they say "walk me through it," go step by
  step — but leave the final step for them.
- You can see the passage, question, and choices you're handed. Use them.`;

function ctxBlock(b: { section?: string; passage?: string; stem?: string; choices?: { id: string; text: string }[] }) {
  const choices = (b.choices || []).map((c) => `${c.id}. ${strip(c.text)}`).join("\n");
  return `SECTION: ${b.section || "Reading & Writing"}
${b.passage ? `PASSAGE / CONTEXT:\n${strip(b.passage)}\n` : ""}QUESTION: ${strip(b.stem)}
${choices ? `CHOICES:\n${choices}` : ""}`;
}

export async function POST(request: Request) {
  let body: {
    mode?: "hint" | "explain" | "chat";
    section?: string;
    passage?: string;
    stem?: string;
    choices?: { id: string; text: string }[];
    correct?: string;
    chosen?: string;
    messages?: { role: "user" | "assistant"; content: string }[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if ((body as { diag?: boolean }).diag) {
    const key = process.env.DEEPSEEK_API_KEY || "";
    let probe = "no-key";
    if (key) {
      try {
        const r = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: { authorization: `Bearer ${key.trim()}`, "content-type": "application/json" },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: "OK" }], max_tokens: 5 }),
        });
        probe = "status:" + r.status + (r.ok ? " OK" : " " + (await r.text()).slice(0, 160));
      } catch (e) { probe = "throw:" + (e as Error).message; }
    }
    return NextResponse.json({ keyLen: key.length, firstCharCode: key.charCodeAt(0), probe });
  }
  const mode = body.mode || "hint";

  if (mode === "chat") {
    const history = (body.messages || [])
      .slice(-10)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1200) }));
    if (!history.length) return NextResponse.json({ text: "Ask me something about this question." });
    const messages = [
      { role: "system" as const, content: `${DURDEN}\n\nThe student is on this question (the answer key is hidden from you on purpose — coach, don't leak):\n${ctxBlock(body)}` },
      ...history,
    ];
    const text = await deepseekMessages(messages, { maxTokens: 460, temperature: 0.65 });
    return NextResponse.json({
      text: text || "Durden's offline (no AI key / no balance). Strip the question to its job, kill two choices, commit.",
      source: text ? "ai" : "fallback",
    });
  }

  if (mode === "explain") {
    const system = `${DURDEN}
The test is OVER — full breakdown allowed. Correct answer: ${body.correct || "?"}.
${body.chosen ? `Student chose ${body.chosen}.` : ""}
Under 130 words: walk the real reasoning to the right answer, name the trap in the most
tempting wrong choice, and if they missed it, the one habit that fixes it. End on a line
they'd remember. No headings, no markdown.`;
    const text = await deepseekChat({ system, user: ctxBlock(body), maxTokens: 520, temperature: 0.4 });
    return NextResponse.json({
      text: text || `The answer is ${body.correct}. Re-read the question, eliminate two wrong choices first, then check exactly what made the right one right.`,
      source: text ? "ai" : "fallback",
    });
  }

  // hint
  const system = `${DURDEN}
The student is mid-test and wants a HINT. Do NOT reveal the letter. 2-3 short lines:
name what this question really tests, hand them one concrete move, dare them to
eliminate. Never the answer.`;
  const text = await deepseekChat({ system, user: ctxBlock(body), maxTokens: 360, temperature: 0.6 });
  return NextResponse.json({
    text: text || "What is the blank/underline actually DOING in that sentence? Predict it in your own words first, then cross out the two choices that can't do that job.",
    source: text ? "ai" : "fallback",
  });
}