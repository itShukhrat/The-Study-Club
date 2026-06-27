"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Desmos?: any;
  }
}

// NEXT_PUBLIC_* is inlined at build time. .trim() strips a stray BOM/whitespace
// (Vercel env values have shipped with a leading U+FEFF before, which made the
// key truthy-but-invalid and 403'd the script); an empty value then falls back
// to the project's own Desmos key (public by design - domain-restricted on Desmos's side).
const RAW_KEY = process.env.NEXT_PUBLIC_DESMOS_API_KEY || "";
const API_KEY = RAW_KEY.trim() || "e49685ca70864caeb874348ec0bf1c88";
const SRC = `https://www.desmos.com/api/v1.12/calculator.js?apiKey=${API_KEY}`;

let loader: Promise<void> | null = null;

function loadDesmos(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Desmos) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const fail = (msg: string) => {
      // Drop the cached promise so a remount / retry can attempt a fresh load
      // instead of inheriting a permanently-rejected singleton.
      loader = null;
      reject(new Error(msg));
    };

    const existing = document.querySelector<HTMLScriptElement>("script[data-desmos]");
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => {
      if (window.Desmos) resolve();
      // if onload fired but the global isn't ready yet, the poll below catches it
    });
    script.addEventListener("error", () => fail("Desmos script failed (network or invalid API key -> 403)"));

    if (!existing) {
      script.src = SRC;
      script.async = true;
      script.dataset.desmos = "true";
      document.head.appendChild(script);
    }

    // Safety net: handles an already-loaded existing script (whose load event
    // won't fire again) and any onload/global timing gap. Times out so a real
    // failure surfaces the retry UI instead of hanging forever.
    let waited = 0;
    const poll = window.setInterval(() => {
      if (window.Desmos) {
        window.clearInterval(poll);
        resolve();
      } else if ((waited += 200) >= 15000) {
        window.clearInterval(poll);
        fail("Desmos did not initialize within 15s");
      }
    }, 200);
  });

  return loader;
}

export function DesmosCalculator({
  height = 420,
  kind = "graphing",
  onExpressions,
}: {
  height?: number;
  kind?: "graphing" | "scientific";
  onExpressions?: (latex: string[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const calcRef = useRef<any>(null);
  const cbRef = useRef(onExpressions);
  cbRef.current = onExpressions;
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    setError(false);
    loadDesmos()
      .then(() => {
        if (!mounted || !ref.current || !window.Desmos) return;
        calcRef.current =
          kind === "scientific"
            ? window.Desmos.ScientificCalculator(ref.current)
            : window.Desmos.GraphingCalculator(ref.current, {
                expressions: true,
                settingsMenu: false,
                border: false,
                keypad: true,
              });
        if (kind !== "scientific" && calcRef.current?.observeEvent) {
          calcRef.current.observeEvent("change", () => {
            try {
              const ex = (calcRef.current.getExpressions?.() || [])
                .map((e: any) => e.latex)
                .filter((x: string) => x && x.trim());
              cbRef.current?.(ex);
            } catch {
              /* noop */
            }
          });
        }
      })
      .catch((err) => {
        // Surface the real reason in the console for diagnosis.
        console.error("[Desmos]", err);
        if (mounted) setError(true);
      });

    return () => {
      mounted = false;
      try {
        calcRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      calcRef.current = null;
    };
  }, [kind, attempt]);

  if (error) {
    return (
      <div
        className="grid place-items-center gap-3 rounded-2xl border bg-white p-6 text-center text-sm"
        style={{ height, borderColor: "var(--paper-line-2, #e2ddd0)", color: "var(--carbon-2, #555)" }}
      >
        <p>Couldn&apos;t load the calculator.</p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="rounded-full border px-4 py-1.5 text-xs font-semibold"
          style={{ borderColor: "var(--paper-line-2, #ddd)", color: "var(--carbon, #222)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border bg-white"
      style={{ height, borderColor: "var(--paper-line-2, #e2ddd0)" }}
      aria-label="Desmos graphing calculator"
    />
  );
}