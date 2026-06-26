import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasServiceRole()) return NextResponse.json({ ok: false, reason: "no-backend" });

  let body: { visitor_id?: string; analytics?: boolean; marketing?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const visitor_id = String(body.visitor_id || "").slice(0, 64);
  if (!visitor_id) return NextResponse.json({ ok: false }, { status: 400 });

  const h = request.headers;
  const ip =
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "";
  // store only a salted hash, never the raw IP
  const ip_hash = ip
    ? crypto.createHash("sha256").update("studyclub::" + ip).digest("hex")
    : null;

  let country = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || null;
  let region = h.get("x-vercel-ip-country-region") || null;
  let city = h.get("x-vercel-ip-city") || null;

  // Only geo-resolve when the user consented to analytics, and only to country/region/city.
  if (body.analytics && ip && !country) {
    try {
      const r = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(2500),
      });
      if (r.ok) {
        const g = await r.json();
        country = g.country_name || g.country || null;
        region = g.region || null;
        city = g.city || null;
      }
    } catch {
      /* geo is best-effort */
    }
  }

  const sb = createAdminClient();
  await sb.from("analytics_consent").upsert({
    visitor_id,
    analytics: !!body.analytics,
    marketing: !!body.marketing,
    user_agent: (h.get("user-agent") || "").slice(0, 300),
    ip_hash,
    country,
    region,
    city,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
