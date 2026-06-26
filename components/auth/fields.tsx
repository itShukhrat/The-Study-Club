"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { scorePassword } from "@/lib/password";

export function EmailField({
  value,
  onChange,
  onEnter,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-line-2 bg-ink-1 px-4 focus-within:border-signal/60">
      <Mail size={16} className="text-ash" />
      <input
        type="email"
        inputMode="email"
        autoComplete="email"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder="you@email.com"
        className="w-full bg-transparent py-3.5 text-bone placeholder:text-ash-2 focus:outline-none"
      />
    </label>
  );
}

export function PasswordField({
  value,
  onChange,
  onEnter,
  meter = false,
  placeholder = "Password",
  autoComplete = "current-password",
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  meter?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const s = scorePassword(value);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 rounded-xl border border-line-2 bg-ink-1 px-4 focus-within:border-signal/60">
        <Lock size={16} className="text-ash" />
        <input
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          placeholder={placeholder}
          className="w-full bg-transparent py-3.5 text-bone placeholder:text-ash-2 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-ash transition-colors hover:text-bone"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </label>

      {meter && (
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i <= s.score ? s.color : "var(--color-ink-3)" }}
              />
            ))}
          </div>
          <span className="min-w-[140px] text-right font-mono text-[0.7rem]" style={{ color: s.color }}>
            {s.label}
          </span>
        </div>
      )}
      {meter && value.length > 0 && !s.ok && (
        <p className="text-xs text-ash">{s.hint}</p>
      )}
    </div>
  );
}

export function CodeInput({
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

  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text) {
      e.preventDefault();
      onChange(text);
      if (text.length === 6) onComplete();
    }
  }

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
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

export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-line-2 bg-bone py-3.5 font-medium text-paper-ink transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.2-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.2-9.5 6.2-16.9z" />
        <path fill="#FBBC05" d="M10.5 28.3c-.5-1.4-.7-2.9-.7-4.3s.3-3 .7-4.3l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.6 10.4l7.9-6.1z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.6 2.1-8.8 2.1-6.3 0-11.6-3.8-13.5-9.1l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash-2">or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
