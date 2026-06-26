"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getConsent, getVisitorId, type Consent } from "@/lib/analytics";

type QEvent = Record<string, unknown> & { type: string };

export function Tracker() {
  const pathname = usePathname();
  const enabled = useRef(false);
  const queue = useRef<QEvent[]>([]);
  const maxScroll = useRef(0);

  // send one event immediately (pageview / session_start)
  function sendNow(ev: QEvent) {
    if (!enabled.current) return;
    const body = JSON.stringify({ events: [{ ...ev, visitor_id: getVisitorId() }] });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/track", { method: "POST", body, keepalive: true });
      }
    } catch {
      /* noop */
    }
  }

  function flush() {
    if (!enabled.current) return;
    if (maxScroll.current > 0) {
      queue.current.push({
        type: "scroll",
        path: window.location.pathname,
        scroll_pct: maxScroll.current,
      });
      maxScroll.current = 0;
    }
    if (!queue.current.length) return;
    const events = queue.current.map((e) => ({ ...e, visitor_id: getVisitorId() }));
    queue.current = [];
    const body = JSON.stringify({ events });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/track", { method: "POST", body, keepalive: true });
      }
    } catch {
      /* noop */
    }
  }

  // wire up listeners once
  useEffect(() => {
    function start(c: Consent | null) {
      if (!c?.analytics || enabled.current) return;
      enabled.current = true;
      sendNow({ type: "session_start", path: window.location.pathname, referrer: document.referrer });
      sendNow(pageviewEvent());
    }
    start(getConsent());

    const onConsent = (e: Event) => start((e as CustomEvent<Consent>).detail);
    window.addEventListener("sc:consent", onConsent);

    const onClick = (e: MouseEvent) => {
      if (!enabled.current) return;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      queue.current.push({
        type: "click",
        path: window.location.pathname,
        x: +(e.clientX / vw).toFixed(4),
        y: +(e.clientY / vh).toFixed(4),
        vw,
        vh,
      });
      if (queue.current.length >= 20) flush();
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      const pct = h > 0 ? Math.round((doc.scrollTop / h) * 100) : 0;
      if (pct > maxScroll.current) maxScroll.current = Math.min(pct, 100);
    };
    const onHide = () => flush();

    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    const interval = setInterval(flush, 6000);

    return () => {
      window.removeEventListener("sc:consent", onConsent);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
      clearInterval(interval);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pageview on route change
  useEffect(() => {
    if (!enabled.current) return;
    flush();
    sendNow(pageviewEvent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

function pageviewEvent(): QEvent {
  return {
    type: "pageview",
    path: window.location.pathname,
    referrer: document.referrer,
    vw: window.innerWidth,
    vh: window.innerHeight,
  };
}
