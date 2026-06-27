"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { DurdenPanel } from "@/components/exam/DurdenPanel";
import { loadOnboarding } from "@/lib/onboarding";
import { loadProgress } from "@/lib/progress";

/**
 * Platform-mode Durden, available across the dashboard. Hidden on the exam
 * route (the runner mounts its own practice-mode Durden there).
 */
export function DurdenLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<{ targetScore?: number; struggles?: string[]; weakDomains?: string[] }>({});

  useEffect(() => {
    const d = loadOnboarding();
    const p = loadProgress();
    setStudent({ targetScore: d?.targetScore, struggles: d?.struggles, weakDomains: p.weakDomains });
  }, []);

  // never collide with the in-exam Durden
  if (pathname?.includes("/practice/test/")) return null;

  return (
    <>
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--color-signal)", boxShadow: "0 1px 2px rgba(168,22,11,.3), 0 12px 30px -10px rgba(214,35,19,.6)" }}
        >
          <Flame size={16} /> Ask Durden
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(20,19,15,.4)", backdropFilter: "blur(3px)" }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="exam fixed right-0 top-0 z-50 h-dvh w-[min(92vw,384px)]"
              style={{ boxShadow: "-24px 0 60px -30px rgba(24,22,17,.5)" }}
            >
              <DurdenPanel ctx={{ mode: "platform", student }} onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}