import { NextResponse } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const TYPES = new Set(["pageview", "click", "scroll", "session_start"]);

type Ev = {
  visitor_id?: string;
  type?: string;
  path?: string;
  x?: number;
  y?: number;
  vw?: number;
  vh?: number;
  scroll_pct?: number;
  referrer?: string;
};

export async function POST(request: Request) {
  if (!hasServiceRole()) return NextResponse.json({ ok: false, reason: "no-backend" });

  let body: { events?: Ev[] } | Ev;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const events: Ev[] = Array.isArray((body as { events?: Ev[] }).events)
    ? (body as { events: Ev[] }).events
    : [body as Ev];

  // coarse geo from the platform edge if present (no raw IP stored)
  const h = request.headers;
  const country =
    h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || null;

  // best-effort: attach the signed-in user, if any
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    /* anonymous is fine */
  }

  const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : null);
  const rows = events
    .filter((e) => e && e.type && TYPES.has(e.type) && e.visitor_id)
    .slice(0, 50)
    .map((e) => ({
      visitor_id: String(e.visitor_id).slice(0, 64),
      user_id: userId,
      type: e.type!,
      path: e.path ? String(e.path).slice(0, 300) : null,
      x: num(e.x),
      y: num(e.y),
      vw: num(e.vw),
      vh: num(e.vh),
      scroll_pct: num(e.scroll_pct),
      referrer: e.referrer ? String(e.referrer).slice(0, 300) : null,
      country,
    }));

  if (rows.length) {
    const sb = createAdminClient();
    await sb.from("analytics_events").insert(rows);
  }
  return NextResponse.json({ ok: true, stored: rows.length });
}
