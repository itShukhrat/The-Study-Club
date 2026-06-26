import { NextResponse } from "next/server";
import { deepseekChat, COACH_VOICE } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * Question explanations, in the coach's voice. Powered by DeepSeek.
 * Given a question, the student's answer, and the correct answer, it explains
 * the reasoning and how to avoid the miss next time.
 */

type ExplainRequest = {
  question: string;
  choices?: { id: string; text: string }[];
  chosen?: string;
  correct: string;
  topic?: string;
};

export async function POST(request: Request) {
  let body: ExplainRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!body?.question || !body?.correct) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const choiceText = body.choices?.length
    ? "\nChoices:\n" + body.choices.map((c) => `${c.id}. ${c.text}`).join("\n")
    : "";
  const wasWrong = body.chosen && body.chosen !== body.correct;

  const text = await deepseekChat({
    system: `${COACH_VOICE}
Explain this SAT question. Keep it under 130 words. Walk the actual reasoning to the answer in plain steps. If the student picked wrong, name the trap they likely fell for and the one habit that prevents it next time. End with a single short line they'd remember. No markdown headers.`,
    user: `Topic: ${body.topic ?? "SAT"}
Question: ${body.question}${choiceText}
Correct answer: ${body.correct}
${body.chosen ? `Student chose: ${body.chosen}${wasWrong ? " (incorrect)" : " (correct)"}` : ""}`,
    maxTokens: 500,
    temperature: 0.4,
  });

  if (!text) {
    return NextResponse.json({
      explanation:
        "The coach is offline for a moment. The correct answer is " +
        body.correct +
        ". Re-read the question, eliminate two wrong choices first, then commit — and check what made the right one right.",
      source: "fallback",
    });
  }

  return NextResponse.json({ explanation: text, source: "ai" });
}
