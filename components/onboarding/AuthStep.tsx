"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { hasSupabaseEnv, createClient } from "@/lib/supabase/client";
import type { OnboardingData } from "@/lib/onboarding";

type Phase = "email" | "code";

export function AuthStep({
  data,
  onEmail,
  onComplete,
}: {
  data: OnboardingData;
  onEmail: (email: string) => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("email");
  const [email, setEmail] = useState(data.email);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview] = useState(!hasSupabaseEnv);

  async function sendCode() {
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }
    onEmail(email);
    setLoading(true);
    if (preview) {
      // Design-preview mode: no backend yet — accept any 6 digits.
      setTimeout(() => {
        setLoading(false);
        setPhase("code");
      }, 650);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: data.name,
            target_score: data.targetScore,
            exam_date: data.examDate,
            fears: data.fears,
            struggles: data.struggles,
            stay: data.stay,
          },
        },
      });
      if (error) throw error;
      setPhase("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the code.");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    if (code.replace(/\D/g, "").length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    if (preview) {
      setTimeout(() => {
        setLoading(false);
        onComplete();
      }, 650);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error) throw error;
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That code didn't work.");
      setLoading(false);
    }
  }

  async function google() {
    if (preview) {
      onComplete();
      return;
    }
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=/dashboard` },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "email" ? (
        <>
          <button
            type="button"
            onClick={google}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-line-2 bg-bone py-3.5 font-medium text-paper-ink transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <GoogleGlyph /> Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash-2">
              or
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-line-2 bg-ink-1 px-4 focus-within:border-signal/60">
            <Mail size={16} className="text-ash" />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendCode()}
              placeholder="you@email.com"
              className="w-full bg-transparent py-3.5 text-bone placeholder:text-ash-2 focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={sendCode}
            disabled={loading}
            className="btn btn-signal w-full disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send my code <ArrowRight size={16} /></>}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5"
        >
          <p className="text-sm text-ash">
            We sent a 6-digit code to{" "}
            <span className="text-bone">{email}</span>.{" "}
            <button
              onClick={() => setPhase("email")}
              className="text-signal underline-offset-2 hover:underline"
            >
              Change
            </button>
          </p>
          <CodeInput value={code} onChange={setCode} onComplete={verify} />
          <button
            type="button"
            onClick={verify}
            disabled={loading}
            className="btn btn-signal w-full disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Walk in <ArrowRight size={16} /></>}
          </button>
        </motion.div>
      )}

      {error && <p className="text-sm text-signal">{error}</p>}

      {preview && (
        <p className="rounded-lg border border-line bg-ink-1 px-3 py-2 font-mono text-[0.66rem] leading-relaxed text-ash">
          PREVIEW MODE — Supabase not connected yet. Any 6-digit code works.
          Add keys to <span className="text-bone-dim">.env.local</span> for real
          accounts.
        </p>
      )}
    </div>
  );
}

function CodeInput({
  value,
  onChange,
  onComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete: () => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function setAt(i: number, d: string) {
    const clean = d.replace(/\D/g, "");
    const arr = value.padEnd(6, " ").split("");
    arr[i] = clean.slice(-1) || " ";
    const next = arr.join("").replace(/ /g, "");
    onChange(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
    if (next.length === 6) onComplete();
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d.trim() && i > 0) refs.current[i - 1]?.focus();
          }}
          className="h-14 w-full rounded-xl border border-line-2 bg-ink-1 text-center font-display text-2xl text-bone focus:border-signal focus:outline-none"
        />
      ))}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.2-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.2-9.5 6.2-16.9z" />
      <path fill="#FBBC05" d="M10.5 28.3c-.5-1.4-.7-2.9-.7-4.3s.3-3 .7-4.3l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.6 10.4l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.8 2.1-6.3 0-11.6-3.8-13.5-9.1l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}
