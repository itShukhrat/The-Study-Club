import { NextResponse } from "next/server";
import { deepseekChat } from "@/lib/ai";

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
    .replace(/&nbsp;|&#36;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2200);

const VOICE = `You are DURDEN — the AI tutor inside Study Club, an SAT prep platform.
Channel a sharp, no-excuses mentor: blunt, a little dangerous, zero hand-holding,
but genuinely useful (the unflinching coach energy of a certain Fight Club character,
without quoting the movie). Talk like a real person, second person, short sentences.
You teach the student to think, not to memorize. No emoji, no corporate fluff.`;

const FALLBACK_HINT =
  "Durden's offline (no AI key). Strip the sentence to its bones: what is the blank/underline actually DOING? Cross out two choices that can't survive that job, then commit.";
const FALLBACK_EXPLAIN =
  "Durden's offline (no AI key). Re-read the question, eliminate two wrong choices first, then check exactly what made the right one right.";

export async function POST(request: Request) {
  let body: {
    mode?: "hint" | "explain";
    passage?: string;
    stem?: string;
    choices?: { id: string; text: string }[];
    correct?: string;
    chosen?: string;
    section?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const mode = body.mode === "explain" ? "explain" : "hint";
  const passage = strip(body.passage);
  const stem = strip(body.stem);
  const choices = (body.choices || [])
    .map((c) => `${c.id}. ${strip(c.text)}`)
    .join("\n");

  const userCtx = `SECTION: ${body.section || "Reading & Writing"}
${passage ? `PASSAGE / CONTEXT:\n${passage}\n` : ""}
QUESTION: ${stem}
${choices ? `CHOICES:\n${choices}` : ""}`;

  let system: string;
  if (mode === "hint") {
    system = `${VOICE}
The student is mid-test and wants a HINT. DO NOT reveal or even strongly imply the
correct letter. In 2-3 short lines: name what the question is really testing, hand
them ONE concrete move (e.g. predict before peeking, find the contrast word, test the
pronoun's antecedent), and dare them to eliminate. Never give the answer.`;
  } else {
    system = `${VOICE}
The test is over; give the full EXPLAIN. The correct answer is ${body.correct || "?"}.
${body.chosen ? `The student chose ${body.chosen}.` : ""}
In under 130 words: walk the actual reasoning to the right answer, then name the trap
in the most tempting wrong choice. If they missed it, say what habit fixes it. End on
one short line they'd remember. No headings, no markdown.`;
  }

  const text = await deepseekChat({ system, user: userCtx, maxTokens: 420, temperature: mode === "hint" ? 0.6 : 0.4 });
  if (!text) {
    return NextResponse.json({ text: mode === "hint" ? FALLBACK_HINT : FALLBACK_EXPLAIN, source: "fallback" });
  }
  return NextResponse.json({ text, source: "ai" });
}