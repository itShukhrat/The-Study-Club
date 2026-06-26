"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { hasSupabaseEnv, createClient } from "@/lib/supabase/client";
import { scorePassword } from "@/lib/password";
import { EmailField, PasswordField, CodeInput } from "@/components/auth/fields";
import { GoogleAuth } from "@/components/auth/GoogleAuth";

type Mode = "login" | "forgot-email" | "forgot-code" | "forgot-reset";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const preview = !hasSupabaseEnv;

  function fail(e: unknown, fallback: string) {
    setError(e instanceof Error ? e.message : fallback);
    setLoading(false);
  }

  async function signIn() {
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("That email doesn't look right.");
    if (!password) return setError("Enter your password.");
    setLoading(true);
    if (preview) return router.push(next);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (e) {
      fail(e, "Couldn't sign you in.");
    }
  }

  async function sendReset() {
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Enter the email on your account.");
    setLoading(true);
    if (preview) {
      setLoading(false);
      return setMode("forgot-code");
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMode("forgot-code");
      setNote(`Code sent to ${email}.`);
      setLoading(false);
    } catch (e) {
      fail(e, "Couldn't send the code.");
    }
  }

  async function verifyReset() {
    setError(null);
    if (code.replace(/\D/g, "").length !== 6) return setError("Enter the 6-digit code.");
    setLoading(true);
    if (preview) {
      setLoading(false);
      return setMode("forgot-reset");
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "recovery" });
      if (error) throw error;
      setMode("forgot-reset");
      setLoading(false);
    } catch (e) {
      fail(e, "That code didn't work.");
    }
  }

  async function setNewPassword() {
    setError(null);
    if (!scorePassword(newPw).ok) return setError("Pick a stronger password — at least 8 characters.");
    setLoading(true);
    if (preview) return router.push(next);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      router.push(next);
      router.refresh();
    } catch (e) {
      fail(e, "Couldn't update your password.");
    }
  }

  const titles: Record<Mode, { kicker: string; title: React.ReactNode; sub: string }> = {
    login: { kicker: "Sign in", title: <>Welcome<br />back.</>, sub: "Your route waits exactly where you left it." },
    "forgot-email": { kicker: "Reset", title: <>Lost the<br />password?</>, sub: "Happens. We'll send a code to your email." },
    "forgot-code": { kicker: "Reset", title: <>Check your<br />email.</>, sub: "Enter the 6-digit code we just sent." },
    "forgot-reset": { kicker: "Reset", title: <>New<br />password.</>, sub: "Make this one count." },
  };
  const t = titles[mode];

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between">
        <Link href="/" aria-label="Study Club home">
          <Logo size={26} animated={false} />
        </Link>
        {mode === "login" ? (
          <Link href="/" className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone">
            <ArrowLeft size={14} /> Home
          </Link>
        ) : (
          <button onClick={() => { setMode("login"); setError(null); setNote(null); }} className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone">
            <ArrowLeft size={14} /> Sign in
          </button>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <p className="kicker mb-4">{t.kicker}</p>
        <h1 className="font-display text-5xl leading-[0.9] text-bone">{t.title}</h1>
        <p className="mt-4 mb-8 text-sm text-ash">{t.sub}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {mode === "login" && (
              <>
                <GoogleAuth next={next} onPreview={() => router.push(next)} />
                <EmailField value={email} onChange={setEmail} autoFocus />
                <PasswordField value={password} onChange={setPassword} onEnter={signIn} />
                <button onClick={signIn} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign in <ArrowRight size={16} /></>}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button onClick={() => { setMode("forgot-email"); setError(null); }} className="text-ash transition-colors hover:text-bone">
                    Forgot password?
                  </button>
                  <Link href="/enter" className="text-signal underline-offset-2 hover:underline">
                    New here? Join
                  </Link>
                </div>
              </>
            )}

            {mode === "forgot-email" && (
              <>
                <EmailField value={email} onChange={setEmail} onEnter={sendReset} autoFocus />
                <button onClick={sendReset} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send code <ArrowRight size={16} /></>}
                </button>
              </>
            )}

            {mode === "forgot-code" && (
              <>
                <CodeInput value={code} onChange={setCode} onComplete={verifyReset} />
                <button onClick={verifyReset} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Verify <ArrowRight size={16} /></>}
                </button>
              </>
            )}

            {mode === "forgot-reset" && (
              <>
                <PasswordField value={newPw} onChange={setNewPw} onEnter={setNewPassword} meter placeholder="New password" autoComplete="new-password" />
                <button onClick={setNewPassword} disabled={loading} className="btn btn-signal w-full disabled:opacity-60">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Set password &amp; enter <ArrowRight size={16} /></>}
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {note && <p className="mt-4 text-sm text-bone-dim">{note}</p>}
        {error && <p className="mt-4 text-sm text-signal">{error}</p>}

        {preview && (
          <p className="mt-6 rounded-lg border border-line bg-ink-1 px-3 py-2 font-mono text-[0.66rem] leading-relaxed text-ash">
            PREVIEW MODE — Supabase not connected. Sign in walks straight to the dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
