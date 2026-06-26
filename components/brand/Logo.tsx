"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  stacked?: boolean;
  animated?: boolean;
  className?: string;
};

/**
 * The Study Club mark: a stamped "SC" monogram with a route line that
 * climbs from a starting node to a target node — momentum, made into a logo.
 */
export function LogoMark({
  size = 40,
  animated = true,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-[26%] stamp",
        className,
      )}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(120% 120% at 20% 0%, #16161c, #08080a)",
      }}
      aria-hidden
    >
      <span
        className="font-display leading-none tracking-tight text-bone"
        style={{ fontSize: size * 0.52, marginTop: size * 0.02 }}
      >
        SC
      </span>

      {/* route line drawing across the mark */}
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 100 100"
        fill="none"
      >
        <motion.path
          d="M10 78 L34 62 L52 70 L90 22"
          stroke="var(--color-signal)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0.2 } : false}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        <circle cx="10" cy="78" r="4.5" fill="var(--color-signal)" />
        <motion.circle
          cx="90"
          cy="22"
          r="5"
          fill="var(--color-signal)"
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: 1.15, type: "spring", stiffness: 320, damping: 14 }}
          style={{ transformOrigin: "90px 22px" }}
        />
      </svg>
    </div>
  );
}

export function Logo({
  size = 40,
  withWordmark = true,
  stacked = false,
  animated = true,
  className,
}: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 select-none",
        stacked && "flex-col gap-2",
        className,
      )}
    >
      <LogoMark size={size} animated={animated} />
      {withWordmark && (
        <div className={cn("flex flex-col", stacked && "items-center")}>
          <span
            className="font-display leading-[0.82] text-bone"
            style={{ fontSize: size * 0.52 }}
          >
            STUDY <span className="text-signal">CLUB</span>
          </span>
        </div>
      )}
    </div>
  );
}
