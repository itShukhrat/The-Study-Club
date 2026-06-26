import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none text-bone">{value}</p>
      {hint && <p className="mt-1 text-xs text-ash">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card p-6", className)}>
      <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash">{title}</p>
      {children}
    </div>
  );
}

/** Area + line chart from a series of values. */
export function LineChart({
  data,
  height = 160,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  if (data.length < 2) {
    return <Empty>Not enough data yet — it fills in as people visit.</Empty>;
  }
  const w = 600;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = w / (data.length - 1);
  const pts = data.map((d, i) => [i * stepX, height - (d.value / max) * (height - 8) - 4]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${height} L0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="lc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(232,57,43,0.35)" />
          <stop offset="100%" stopColor="rgba(232,57,43,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lc)" />
      <path d={line} fill="none" stroke="var(--color-signal)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="var(--color-signal)" />
      ))}
    </svg>
  );
}

/** Horizontal ranked bars. */
export function BarList({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  if (!items.length) return <Empty>No data yet.</Empty>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-bone-dim">{it.label}</span>
            <span className="ml-3 font-mono text-xs text-ash">{it.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-3">
            <div
              className="h-full rounded-full bg-signal"
              style={{ width: `${Math.max((it.value / max) * 100, 3)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Click heatmap over a normalized viewport box. */
export function Heatmap({ points }: { points: { x: number; y: number }[] }) {
  if (!points.length) {
    return <Empty>No clicks captured yet. Browse the site (with cookies accepted) and they&apos;ll appear.</Empty>;
  }
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-line-2 bg-ink-2"
      style={{ aspectRatio: "16 / 10" }}
    >
      {points.slice(0, 1200).map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x * 100}%`,
            top: `${p.y * 100}%`,
            width: 26,
            height: 26,
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(232,57,43,0.5), rgba(232,57,43,0) 70%)",
            mixBlendMode: "screen",
          }}
        />
      ))}
      <span className="absolute bottom-2 right-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash-2">
        {points.length} clicks · viewport-relative
      </span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-24 place-items-center rounded-xl border border-dashed border-line-2 p-6 text-center text-sm text-ash">
      {children}
    </div>
  );
}
