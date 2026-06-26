import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

/**
 * The Study Club coach. Not a chatbot — a focused study strategist that reads
 * the student's route and tells them what to do next, in the brand voice.
 * Falls back to curated lines when ANTHROPIC_API_KEY isn't set.
 */

type CoachRequest = {
  name?: string;
  targetScore?: number;
  examDate?: string;
  fears?: string[];
  struggles?: string[];
};

const SYSTEM = `You are the coach inside Study Club, an SAT prep platform.
You are a coach, not a cheerleader. You sound like a sharp, calm strategist who
has seen a thousand students move their score. Voice rules:
- Short. Direct. Second person. No corporate filler, no hype, no emoji.
- Never say: "unlock your potential", "achieve your dreams", "you've got this!", "believe in yourself".
- Talk in terms of the route, the next move, mistakes, reps, the streak, evidence.
- Be specific to what the student told you. Name the fear or topic.
Return 2-3 short lines (each one or two sentences). No preamble, no headings, no bullets — just the lines separated by newlines.`;

const FALLBACK = [
  "Take the baseline first. I can't draw the route until I know where you're standing.",
  "Then we aim at the weak topic that pays the most — not the one that feels safest.",
  "Show up tomorrow. The streak does more than motivation ever will.",
];

export async function POST(request: Request) {
  let body: CoachRequest = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine */
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ lines: FALLBACK, source: "fallback" });
  }

  const profile = [
    body.name && `Name: ${body.name}`,
    body.targetScore && `Target score: ${body.targetScore}/1600`,
    body.examDate && `Exam date: ${body.examDate}`,
    body.fears?.length && `Biggest fears: ${body.fears.join(", ")}`,
    body.struggles?.length && `Struggles with: ${body.struggles.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 400,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Here's the student's route so far:\n${profile || "(no details yet)"}\n\nThey haven't taken a baseline test yet. Give them today's coaching.`,
        },
      ],
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({
      lines: lines.length ? lines : FALLBACK,
      source: "ai",
    });
  } catch {
    return NextResponse.json({ lines: FALLBACK, source: "fallback" });
  }
}
