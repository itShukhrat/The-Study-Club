import { NextResponse } from "next/server";
import { deepseekChat, COACH_VOICE } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * The Study Club coach. Not a chatbot — a focused strategist that reads the
 * student's route and tells them what to do next. Powered by DeepSeek;
 * falls back to curated lines when no key is set.
 */

type CoachRequest = {
  name?: string;
  targetScore?: number;
  examDate?: string;
  fears?: string[];
  struggles?: string[];
};

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

  const profile = [
    body.name && `Name: ${body.name}`,
    body.targetScore && `Target score: ${body.targetScore}/1600`,
    body.examDate && `Exam date: ${body.examDate}`,
    body.fears?.length && `Biggest fears: ${body.fears.join(", ")}`,
    body.struggles?.length && `Struggles with: ${body.struggles.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const text = await deepseekChat({
    system: `${COACH_VOICE}\nReturn 2-3 short lines (each one or two sentences), separated by newlines. No preamble, no headings, no bullets.`,
    user: `Here's the student's route so far:\n${profile || "(no details yet)"}\n\nThey haven't taken a baseline test yet. Give them today's coaching.`,
    maxTokens: 350,
    temperature: 0.6,
  });

  if (!text) return NextResponse.json({ lines: FALLBACK, source: "fallback" });

  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return NextResponse.json({
    lines: lines.length ? lines : FALLBACK,
    source: "ai",
  });
}
