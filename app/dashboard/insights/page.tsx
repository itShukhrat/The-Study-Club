import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { FEARS } from "@/lib/brand";
import { StatTile, Panel, LineChart, BarList, Heatmap } from "@/components/insights/charts";

export const metadata: Metadata = { title: "Insights" };
export const dynamic = "force-dynamic";

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <Link href="/dashboard" className="mb-10 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash hover:text-bone">
        <ArrowLeft size={14} /> Today
      </Link>
      <div className="my-auto max-w-md">
        <h1 className="font-display text-5xl text-bone">{title}</h1>
        <p className="mt-4 text-bone-dim">{body}</p>
      </div>
    </div>
  );
}

export default async function InsightsPage() {
  if (!hasServiceRole()) {
    return <Gate title="Insights" body="Connect Supabase (add the keys to .env.local) to switch on analytics." />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = user?.email?.toLowerCase();

  if (!email) {
    return <Gate title="Insights" body="Sign in to view the analytics dashboard." />;
  }
  if (!admins.includes(email)) {
    return <Gate title="Not your room" body="Insights is for the team. Ask an admin to add your email to ADMIN_EMAILS." />;
  }

  const sb = createAdminClient();
  const head = { count: "exact" as const, head: true };

  const [members, pageviews, visitors, events, daily, paths, countries, clicks, profiles] =
    await Promise.all([
      sb.from("profiles").select("*", head),
      sb.from("analytics_events").select("*", head).eq("type", "pageview"),
      sb.from("analytics_consent").select("*", head),
      sb.from("analytics_events").select("*", head),
      sb.from("analytics_daily").select("*").order("day", { ascending: true }).limit(30),
      sb.from("analytics_top_paths").select("*").limit(8),
      sb.from("analytics_countries").select("*").limit(8),
      sb.from("analytics_events").select("x,y").eq("type", "click").eq("path", "/").not("x", "is", null).limit(1200),
      sb.from("profiles").select("fears,struggles").limit(2000),
    ]);

  const dailySeries =
    (daily.data ?? []).map((d: { day: string; pageviews: number }) => ({
      label: new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(d.pageviews) || 0,
    }));

  const pathItems = (paths.data ?? []).map((p: { path: string; pageviews: number }) => ({
    label: p.path || "/",
    value: Number(p.pageviews) || 0,
  }));
  const countryItems = (countries.data ?? []).map((c: { country: string; visitors: number }) => ({
    label: c.country || "Unknown",
    value: Number(c.visitors) || 0,
  }));
  const heatPoints = (clicks.data ?? []).map((c: { x: number; y: number }) => ({ x: c.x, y: c.y }));

  // survey distributions
  const fearCount = new Map<string, number>();
  const struggleCount = new Map<string, number>();
  for (const p of profiles.data ?? []) {
    for (const f of (p as { fears?: string[] }).fears ?? []) fearCount.set(f, (fearCount.get(f) ?? 0) + 1);
    for (const s of (p as { struggles?: string[] }).struggles ?? []) struggleCount.set(s, (struggleCount.get(s) ?? 0) + 1);
  }
  const fearItems = [...fearCount.entries()]
    .map(([id, value]) => ({ label: FEARS.find((f) => f.id === id)?.label ?? id, value }))
    .sort((a, b) => b.value - a.value);
  const struggleItems = [...struggleCount.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash hover:text-bone">
          <ArrowLeft size={14} /> Today
        </Link>
        <p className="kicker">Live from Supabase</p>
        <h1 className="mt-1 font-display text-5xl text-bone">Insights</h1>
        <p className="mt-2 text-sm text-ash">
          How the club is moving — visitors, behavior, and what the route needs to fix.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Members" value={members.count ?? 0} />
        <StatTile label="Tracked visitors" value={visitors.count ?? 0} hint="cookies accepted" />
        <StatTile label="Pageviews" value={pageviews.count ?? 0} />
        <StatTile label="Events" value={events.count ?? 0} />
      </div>

      <Panel title="Pageviews — last 30 days">
        <LineChart data={dailySeries} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top pages">
          <BarList items={pathItems} />
        </Panel>
        <Panel title="Where they're from">
          <BarList items={countryItems} />
        </Panel>
      </div>

      <Panel title="Click heatmap — landing page">
        <Heatmap points={heatPoints} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="What scares them (survey)">
          <BarList items={fearItems} />
        </Panel>
        <Panel title="What they struggle with (survey)">
          <BarList items={struggleItems} />
        </Panel>
      </div>
    </div>
  );
}
