"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Soft page-transition. A template re-mounts on every navigation, so each route
 * fades in. Opacity-only on purpose: a transform/filter here would re-anchor any
 * position:fixed overlay (the exam runner) and break it.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}