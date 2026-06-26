"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "#route", label: "The Route" },
  { href: "#rules", label: "The Rules" },
  { href: "#next", label: "What's Next" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500",
          scrolled ? "glass shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]" : "border border-transparent",
        )}
      >
        <Link href="/" aria-label="Study Club home">
          <Logo size={30} animated={false} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/enter"
            className="hidden font-mono text-[0.72rem] uppercase tracking-[0.18em] text-bone-dim transition-colors hover:text-bone sm:block"
          >
            Sign in
          </Link>
          <Link href="/enter" className="btn btn-signal px-4 py-2 text-[0.72rem]">
            Enter the Club
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
