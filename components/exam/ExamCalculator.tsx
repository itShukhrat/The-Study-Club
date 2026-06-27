"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Calculator as CalcIcon, Maximize2, Minimize2, X, Eraser } from "lucide-react";
import { DesmosCalculator } from "@/components/practice/DesmosCalculator";

/* eslint-disable @typescript-eslint/no-explicit-any */

type CalcMode = "dock" | "max";
interface Prefs {
  w: number;
  h: number;
  x: number;
  y: number;
  mode: CalcMode;
}

const PREF_KEY = "sc.calc";
const MIN_W = 360;
const MIN_H = 420;
const SSR_DEFAULT: Prefs = { w: 480, h: 580, x: 24, y: 88, mode: "dock" };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function loadPrefs(): Prefs {
  const base = { ...SSR_DEFAULT };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (raw) Object.assign(base, JSON.parse(raw));
  } catch {
    /* noop */
  }
  base.w = clamp(base.w, MIN_W, window.innerWidth - 16);
  base.h = clamp(base.h, MIN_H, window.innerHeight - 16);
  // default / off-screen -> dock to the right, below the toolbar
  const maxX = window.innerWidth - base.w - 12;
  const maxY = window.innerHeight - 56;
  if (base.x < 4 || base.x > maxX) base.x = Math.max(12, window.innerWidth - base.w - 24);
  base.y = clamp(base.y, 64, Math.max(64, maxY));
  return base;
}

function savePrefs(p: Prefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

export function ExamCalculator({
  open,
  onClose,
  onExpressions,
}: {
  open: boolean;
  onClose: () => void;
  onExpressions?: (latex: string[]) => void;
}) {
  const isMobile = useIsMobile();
  const [prefs, setPrefs] = useState<Prefs>(SSR_DEFAULT);
  const [everOpened, setEverOpened] = useState(open);
  const calcApi = useRef<any>(null);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);
  useEffect(() => {
    if (open && !everOpened) setEverOpened(true);
  }, [open, everOpened]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const clearCalc = () => {
    try {
      calcApi.current?.setBlank?.();
    } catch {
      /* noop */
    }
  };
  const toggleMode = () =>
    setPrefs((p) => {
      const next = { ...p, mode: (p.mode === "max" ? "dock" : "max") as CalcMode };
      savePrefs(next);
      return next;
    });

  function startDrag(e: React.PointerEvent) {
    if (isMobile || prefs.mode === "max") return;
    e.preventDefault();
    const s = { px: e.clientX, py: e.clientY, bx: prefs.x, by: prefs.y };
    const move = (ev: PointerEvent) => {
      setPrefs((p) => ({
        ...p,
        x: clamp(s.bx + (ev.clientX - s.px), 4, window.innerWidth - p.w - 4),
        y: clamp(s.by + (ev.clientY - s.py), 4, window.innerHeight - 44),
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setPrefs((p) => {
        savePrefs(p);
        return p;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startResize(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const s = { px: e.clientX, py: e.clientY, bw: prefs.w, bh: prefs.h };
    const move = (ev: PointerEvent) => {
      setPrefs((p) => ({
        ...p,
        w: clamp(s.bw + (ev.clientX - s.px), MIN_W, window.innerWidth - p.x - 8),
        h: clamp(s.bh + (ev.clientY - s.py), MIN_H, window.innerHeight - p.y - 8),
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setPrefs((p) => {
        savePrefs(p);
        return p;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  if (!everOpened) return null;

  const azure = "var(--color-azure, #2b5cf0)";
  const azureSoft = "var(--color-azure-soft, #e9eeff)";
  const isMax = prefs.mode === "max" && !isMobile;

  const header = (
    <div
      onPointerDown={!isMobile && !isMax ? startDrag : undefined}
      className={
        "flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2 " +
        (!isMobile && !isMax ? "cursor-grab active:cursor-grabbing" : "")
      }
      style={{ borderColor: "var(--paper-line)", background: azureSoft }}
    >
      <div className="flex items-center gap-2">
        <CalcIcon size={15} style={{ color: azure }} />
        <span className="text-sm font-semibold" style={{ color: "var(--carbon)" }}>
          Calculator
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <button onClick={clearCalc} title="Clear" className="exam-calc-btn">
          <Eraser size={15} />
        </button>
        {!isMobile && (
          <button onClick={toggleMode} title={isMax ? "Restore" : "Big mode"} className="exam-calc-btn">
            {isMax ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        )}
        <button onClick={onClose} title="Close (Esc)" className="exam-calc-btn">
          <X size={16} />
        </button>
      </div>
    </div>
  );

  const body = (
    <div className="min-h-0 flex-1">
      <DesmosCalculator fill onExpressions={onExpressions} onReady={(c) => (calcApi.current = c)} />
    </div>
  );

  // ---- Mobile: full-height bottom sheet ----
  if (isMobile) {
    return (
      <>
        <motion.div
          className="fixed inset-0 z-[84]"
          style={{ background: "rgba(20,19,15,0.35)" }}
          initial={false}
          animate={{ opacity: open ? 1 : 0, transitionEnd: { display: open ? "block" : "none" } }}
          onClick={onClose}
        />
        <motion.div
          className="exam-card fixed inset-x-0 bottom-0 z-[85] flex flex-col overflow-hidden p-0"
          style={{ top: "6%", borderRadius: "20px 20px 0 0" }}
          initial={false}
          animate={{ y: open ? 0 : "105%" }}
          transition={{ type: "spring", stiffness: 360, damping: 36 }}
        >
          {header}
          {body}
        </motion.div>
      </>
    );
  }

  // ---- Desktop: resizable dock / big mode ----
  const dockStyle: CSSProperties = { left: prefs.x, top: prefs.y, width: prefs.w, height: prefs.h };
  const maxStyle: CSSProperties = { top: 64, right: 20, bottom: 20, width: "min(820px, 62vw)" };

  return (
    <motion.div
      className="exam-card fixed z-[85] flex flex-col overflow-hidden p-0"
      style={isMax ? maxStyle : dockStyle}
      initial={false}
      animate={{
        opacity: open ? 1 : 0,
        scale: open ? 1 : 0.96,
        transitionEnd: { display: open ? "flex" : "none" },
      }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {header}
      {body}
      {!isMax && (
        <div
          onPointerDown={startResize}
          title="Drag to resize"
          className="absolute bottom-0 right-0 z-10 grid h-5 w-5 cursor-nwse-resize place-items-end p-1"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" style={{ color: "var(--carbon-3, #999)" }}>
            <path d="M9 0 L9 9 L0 9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <path d="M9 4 L5 9 M9 7 L7 9" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}