"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, SECONDARY_NAV, FUTURE_NAV } from "./nav-config";
import { hasSupabaseEnv, createClient } from "@/lib/supabase/client";
import { clearOnboarding } from "@/lib/onboarding";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    if (hasSupabaseEnv) {
      await createClient().auth.signOut();
    }
    clearOnboarding();
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="px-2 py-1" onClick={onNavigate}>
        <Logo size={28} animated={false} />
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {PRIMARY_NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "text-bone" : "text-ash hover:text-bone",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl border border-line-2 bg-ink-2"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={18} strokeWidth={1.7} className={cn("relative z-10", active && "text-signal")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}

        <div className="my-3 h-px bg-line" />

        {SECONDARY_NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "text-bone" : "text-ash hover:text-bone",
              )}
            >
              <Icon size={18} strokeWidth={1.7} className={cn(active && "text-signal")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* future, locked */}
      <div className="mt-4">
        <p className="px-3 pb-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash-2">
          Coming chapters
        </p>
        {FUTURE_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2 text-sm text-ash-2"
            >
              <Icon size={18} strokeWidth={1.7} />
              <span className="flex-1">{item.label}</span>
              <Lock size={13} />
            </div>
          );
        })}
      </div>

      <button
        onClick={signOut}
        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ash transition-colors hover:text-signal"
      >
        <LogOut size={18} strokeWidth={1.7} />
        Leave the route
      </button>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-ink-1/60 p-5 backdrop-blur-xl lg:flex">
        <NavLinks />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo size={26} animated={false} />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line-2 text-bone"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-line bg-ink-1 p-5 lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 text-ash hover:text-bone"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <NavLinks onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
