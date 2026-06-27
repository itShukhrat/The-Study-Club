"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Desmos?: any;
  }
}

const API_KEY =
  process.env.NEXT_PUBLIC_DESMOS_API_KEY || "dcb31709b452b1cf9dc26972add0fda6";
const SRC = `https://www.desmos.com/api/v1.12/calculator.js?apiKey=${API_KEY}`;

let loader: Promise<void> | null = null;
function loadDesmos(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Desmos) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-desmos]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("desmos failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.dataset.desmos = "true";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("desmos failed"));
    document.head.appendChild(s);
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

  useEffect(() => {
    let mounted = true;
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
      .catch(() => mounted && setError(true));

    return () => {
      mounted = false;
      try {
        calcRef.current?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [kind]);

  if (error) {
    return (
      <div
        className="grid place-items-center rounded-2xl border border-line bg-ink-1 text-sm text-ash"
        style={{ height }}
      >
        Couldn&apos;t load the calculator. Check the network and the Desmos API key.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-line-2 bg-white"
      style={{ height }}
      aria-label="Desmos graphing calculator"
    />
  );
}
