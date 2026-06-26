"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getConsent, setConsent } from "@/lib/analytics";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setShow(true);
  }, []);

  function choose(analytics: boolean) {
    setConsent({ analytics, marketing: analytics });
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-2xl"
        >
          <div className="glass flex flex-col gap-4 rounded-2xl p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)] sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-relaxed text-bone-dim">
              We use cookies to understand how you study — only to assess your
              level and serve the right material. Never sold.{" "}
              <Link href="/privacy" className="text-signal underline-offset-2 hover:underline">
                How we use it
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => choose(false)}
                className="btn btn-ghost px-4 py-2.5 text-[0.72rem]"
              >
                Essentials only
              </button>
              <button
                onClick={() => choose(true)}
                className="btn btn-signal px-4 py-2.5 text-[0.72rem]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
