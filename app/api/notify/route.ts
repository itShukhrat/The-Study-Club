import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Internal notifications to the team (e.g. a new member joined, or a contact
 * message). Sent via Resend. Fire-and-forget — never blocks or breaks the
 * user flow. FROM must be a Resend-verified sender (EMAIL_FROM); TO is the
 * internal inbox (EMAIL_INTERNAL_TO, default contact@StudyClub.uz).
 */

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 2000);

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.EMAIL_INTERNAL_TO || "contact@StudyClub.uz";
  const from = process.env.EMAIL_FROM || "Study Club <noreply@boostprofits.org>";
  if (!key) return NextResponse.json({ ok: false, reason: "no-resend" });

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    /* empty */
  }

  const type = (body.type as string) || "signup";
  let subject: string;
  let html: string;

  if (type === "contact") {
    subject = `Contact — ${esc(body.name) || "someone"}`;
    html = `<h2>New contact message</h2>
      <p><b>Name:</b> ${esc(body.name)}</p>
      <p><b>Email:</b> ${esc(body.email)}</p>
      <p style="white-space:pre-wrap">${esc(body.message)}</p>`;
  } else {
    subject = `New member — ${esc(body.name) || esc(body.email) || "Study Club"}`;
    html = `<h2>Someone joined Study Club</h2>
      <p><b>Name:</b> ${esc(body.name)}</p>
      <p><b>Email:</b> ${esc(body.email)}</p>
      <p><b>Target score:</b> ${esc(body.targetScore)}</p>
      <p><b>Exam date:</b> ${esc(body.examDate)}</p>
      <p><b>Fears:</b> ${esc(Array.isArray(body.fears) ? (body.fears as string[]).join(", ") : "")}</p>
      <p><b>Struggles:</b> ${esc(Array.isArray(body.struggles) ? (body.struggles as string[]).join(", ") : "")}</p>`;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    /* fire-and-forget */
  }
  return NextResponse.json({ ok: true });
}
