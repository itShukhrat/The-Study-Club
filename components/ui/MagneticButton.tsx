"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "signal" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
};

/** A button/link that leans toward the cursor. Subtle, premium, not gimmicky. */
export function MagneticButton({
  href,
  children,
  variant = "signal",
  className,
  onClick,
  type = "button",
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const classes = cn("btn", variant === "signal" ? "btn-signal" : "btn-ghost", className);
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-flex"
    >
      {href ? (
        <Link href={href} className={classes} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type={type} className={classes} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
