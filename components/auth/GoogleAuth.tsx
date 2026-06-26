"use client";

import { useEffect, useState } from "react";
import {
  hasSupabaseEnv,
  createClient,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from "@/lib/supabase/client";
import { GoogleButton, Divider } from "./fields";

/**
 * Renders the Google button only when the provider is actually enabled in
 * Supabase — so it never bounces. Once you add Google OAuth credentials in
 * Supabase, it appears automatically.
 */
export function GoogleAuth({
  next,
  onPreview,
}: {
  next: string;
  onPreview?: () => void;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hasSupabaseEnv) return;
    fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: SUPABASE_ANON_KEY as string },
    })
      .then((r) => r.json())
      .then((s) => setEnabled(Boolean(s?.external?.google)))
      .catch(() => setEnabled(false));
  }, []);

  function go() {
    if (!hasSupabaseEnv) return onPreview?.();
    const supabase = createClient();
    void supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  if (!enabled) return null;
  return (
    <>
      <GoogleButton onClick={go} label="Continue with Google" />
      <Divider />
    </>
  );
}
