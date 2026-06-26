"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { hasSupabaseEnv, createClient } from "@/lib/supabase/client";
import { scorePassword } from "@/lib/password";
import type { OnboardingData } from "@/lib/onboarding";
import { EmailField, PasswordField, CodeInput } from "@/components/auth/fields";
import { GoogleAuth } from "@/components/auth/GoogleAuth";

type Phase = "form" | "code";

export function AuthStep({
  data,
  onEmail,
  onComplete,
}: {
  data: OnboardingData;
  onEmail: (email: string) => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview] = useState(!hasSupabaseEnv);

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const pwOk = scorePassword(password).ok;

  async function sendCode() {
    setError(null);
    if (!emailOk) return setError("That email doesn't look right.");
    if (!pwOk) return setError("Pick a stronger password — at least 8 characters.");
    onEmail(email);
    setLoading(true);

    if (preview) {
      setTimeout(() => {
        setLoading(false);
        setPhase("code");
      }, 600);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
      if (error) {
        if (/already|registered|exists/i.test(error.message)) {
          setError("You're already in the club. Head to sign in.");
          setLoading(false);
          return;
        }
        throw error;
      }
      setPhase("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the code.");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    if (code.replace(/\D/g, "").length !== 6) return setError("Enter the 6-digit code.");
    setLoading(true);
    if (preview) {
      setTimeout(() => {
        setLoading(false);
        onComplete();
      }, 600);
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "signup" });
      if (error) throw error;
      // tell the team a new member joined (fire-and-forget)
      void fetch("/api/notify", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "signup",
          name: data.name,
          email,
          targetScore: data.targetScore,
          examDate: data.examDate,
          fears: data.fears,
          struggles: data.struggles,
        }),
      }).catch(() => {});
      onComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That code didn't work.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {phase === "form" ? (
        <>
          <GoogleAuth next="/dashboard" onPreview={onComplete} />
          <EmailField value={email} onChange={setEmail} />
          <PasswordField
            value={password}
            onChange={setPassword}
            onEnter={sendCode}
            meter
            placeholder="Create a password"
            autoComplete="new-password"
          />
          <button onClick={sendCode} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send my code <ArrowRight size={16} /></>}
          </button>
          <p className="text-center text-sm text-ash">
            Already a member?{" "}
            <Link href="/login" className="text-signal underline-offset-2 hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <p className="text-sm text-ash">
            We sent a 6-digit code to <span className="text-bone">{email}</span>.{" "}
            <button onClick={() => setPhase("form")} className="text-signal underline-offset-2 hover:underline">
              Change
            </button>
          </p>
          <CodeInput value={code} onChange={setCode} onComplete={verify} />
          <button onClick={verify} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Walk in <ArrowRight size={16} /></>}
          </button>
        </motion.div>
      )}

      {error && <p className="text-sm text-signal">{error}</p>}

      {preview && (
        <p className="rounded-lg border border-line bg-ink-1 px-3 py-2 font-mono text-[0.66rem] leading-relaxed text-ash">
          PREVIEW MODE — Supabase not connected. Any 6-digit code works.
        </p>
      )}
    </div>
  );
}
