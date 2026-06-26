import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Study Club home">
          <Logo size={26} animated={false} />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft size={14} /> Home
        </Link>
      </div>

      <h1 className="mt-14 font-display text-5xl text-bone sm:text-6xl">{title}</h1>
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash-2">
        Last updated {updated}
      </p>

      <div className="legal-prose mt-10 flex flex-col gap-6 text-[0.95rem] leading-relaxed text-bone-dim">
        {children}
      </div>

      <p className="mt-14 rounded-xl border border-line bg-ink-1 p-4 font-mono text-[0.72rem] leading-relaxed text-ash">
        This is a starting template, not legal advice. Before launch, have
        counsel tailor it to COPPA (for users under 13), GDPR, and Uzbekistan&apos;s
        personal-data law (No. ZRU-547).
      </p>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-2xl text-bone">{children}</h2>;
}
