"use client";

export type Consent = { analytics: boolean; marketing: boolean };

const VID_KEY = "sc.vid";
const CONSENT_KEY = "sc.consent";

/** Stable anonymous visitor id (not tied to identity). */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VID_KEY, id);
  }
  return id;
}

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function setConsent(c: Consent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  document.cookie = `sc_consent=${c.analytics ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
  // record server-side (geo + hashed ip) and wake the tracker
  void fetch("/api/consent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ visitor_id: getVisitorId(), ...c }),
  }).catch(() => {});
  window.dispatchEvent(new CustomEvent("sc:consent", { detail: c }));
}
