"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Timer,
  BookOpen,
  Sigma,
  Flame,
  Repeat,
  Wind,
  Check,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ProgressRail, StepShell, ChoiceCard, Chip } from "./ui";
import { AuthStep } from "./AuthStep";
import {
  defaultOnboarding,
  loadOnboarding,
  saveOnboarding,
  type OnboardingData,
} from "@/lib/onboarding";
import { RULES, RULES_CLOSER, STRUGGLES, FEARS, STAY_OPTIONS } from "@/lib/brand";
import { daysUntil } from "@/lib/utils";

const fearIcons: Record<string, React.ReactNode> = {
  timer: <Timer size={20} strokeWidth={1.6} />,
  book: <BookOpen size={20} strokeWidth={1.6} />,
  sigma: <Sigma size={20} strokeWidth={1.6} />,
  flame: <Flame size={20} strokeWidth={1.6} />,
  repeat: <Repeat size={20} strokeWidth={1.6} />,
  wind: <Wind size={20} strokeWidth={1.6} />,
};

const meta = [
  { kicker: "The exam", q: <>What are you<br />training for?</> },
  { kicker: "The target", q: <>What score are<br />you chasing?</> },
  { kicker: "The fear", q: <>What scares<br />you most?</> },
  { kicker: "The gaps", q: <>Where does it<br />fall apart?</> },
  { kicker: "The deadline", q: <>When&apos;s the<br />real thing?</> },
  { kicker: "Your name", q: <>What do we<br />call you?</> },
  { kicker: "The rules", q: <>Six lines.<br />Live by them.</> },
  { kicker: "The door", q: <>Save your<br />route.</> },
];
const TOTAL = meta.length;

export function OnboardingFlow({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultOnboarding);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadOnboarding());
    setHydrated(true);
  }, []);

  function update(patch: Partial<OnboardingData>) {
    setData((d) => {
      const merged = { ...d, ...patch };
      saveOnboarding(merged);
      return merged;
    });
  }

  function go(to: number) {
    setDir(to > step ? 1 : -1);
    setStep(Math.max(0, Math.min(TOTAL - 1, to)));
  }

  const canContinue = (() => {
    switch (step) {
      case 0: return data.exam === "SAT";
      case 1: return data.targetScore >= 400 && data.targetScore <= 1600;
      case 2: return data.fears.length > 0;
      case 3: return data.struggles.length > 0;
      case 4: return Boolean(data.examDate);
      case 5: return data.name.trim().length >= 2;
      case 6: return data.agreedToRules;
      default: return false;
    }
  })();

  function finish() {
    update({ agreedToRules: true });
    router.push(next);
  }

  return (
    <div className="relative flex min-h-dvh flex-col px-6 py-6">
      {/* header */}
      <div className="mx-auto flex w-full max-w-xl items-center justify-between">
        <Link href="/" aria-label="Study Club home">
          <Logo size={26} animated={false} />
        </Link>
        <button
          onClick={() => (step === 0 ? router.push("/") : go(step - 1))}
          className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="mx-auto mt-6 w-full max-w-xl">
        <ProgressRail step={step} total={TOTAL} />
      </div>

      {/* steps */}
      <div className="relative flex flex-1 items-center py-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -40, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <StepShell
              index={step}
              total={TOTAL}
              kicker={meta[step].kicker}
              question={meta[step].q}
            >
              {hydrated && renderStep()}
            </StepShell>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer continue (hidden on auth step) */}
      {step < 7 && (
        <div className="mx-auto w-full max-w-xl">
          <button
            onClick={() => (step === 6 ? finish() : go(step + 1))}
            disabled={!canContinue}
            className="btn btn-signal w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === 6 ? "I'm in" : "Continue"} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-3">
            <ChoiceCard
              label="SAT"
              desc="Digital SAT — the full route is live."
              selected={data.exam === "SAT"}
              onClick={() => update({ exam: "SAT" })}
            />
            {[
              ["ACT", "Same discipline, different test."],
              ["AP", "More routes are being built."],
              ["University Guidance", "Where the score actually goes."],
            ].map(([label, desc]) => (
              <ChoiceCard key={label} label={label} desc={desc} locked />
            ))}
          </div>
        );

      case 1:
        return <ScoreStep value={data.targetScore} onChange={(v) => update({ targetScore: v })} />;

      case 2:
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEARS.map((f) => (
              <ChoiceCard
                key={f.id}
                label={f.label}
                icon={fearIcons[f.icon]}
                selected={data.fears.includes(f.id)}
                onClick={() =>
                  update({
                    fears: data.fears.includes(f.id)
                      ? data.fears.filter((x) => x !== f.id)
                      : [...data.fears, f.id],
                  })
                }
              />
            ))}
          </div>
        );

      case 3:
        return (
          <>
            <p className="mb-4 text-sm text-ash">Pick all that bite. We&apos;ll aim the route at them.</p>
            <div className="flex flex-wrap gap-2.5">
              {STRUGGLES.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={data.struggles.includes(s)}
                  onClick={() =>
                    update({
                      struggles: data.struggles.includes(s)
                        ? data.struggles.filter((x) => x !== s)
                        : [...data.struggles, s],
                    })
                  }
                />
              ))}
            </div>
          </>
        );

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <input
              type="date"
              value={data.examDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => update({ examDate: e.target.value })}
              className="w-full rounded-xl border border-line-2 bg-ink-1 px-4 py-4 font-mono text-lg text-bone focus:border-signal focus:outline-none [color-scheme:dark]"
            />
            {data.examDate && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl text-signal text-glow"
              >
                {daysUntil(data.examDate)} days on the route.
              </motion.p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={data.name}
              autoFocus
              maxLength={24}
              placeholder="Your Study Club name"
              onChange={(e) => update({ name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && canContinue && go(step + 1)}
              className="w-full rounded-xl border border-line-2 bg-ink-1 px-4 py-4 font-display text-2xl text-bone placeholder:text-ash-2 placeholder:font-sans placeholder:text-base focus:border-signal focus:outline-none"
            />
            <p className="text-sm text-ash">
              Not a username. The name the leaderboard will learn to respect.
            </p>
            {data.name.trim().length >= 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-2xl text-bone"
              >
                Welcome in, <span className="text-signal">{data.name.trim()}</span>.
              </motion.p>
            )}
          </div>
        );

      case 6:
        return <RulesStep agreed={data.agreedToRules} onAgree={(v) => update({ agreedToRules: v })} />;

      case 7:
        return (
          <div className="flex flex-col gap-6">
            <StayToggle
              value={data.stay}
              onChange={(v) => update({ stay: v })}
            />
            <AuthStep
              data={data}
              onEmail={(email) => update({ email })}
              onComplete={finish}
            />
          </div>
        );

      default:
        return null;
    }
  }
}

/* ---------- target score ---------- */
function ScoreStep({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const presets = [1200, 1350, 1450, 1550];
  return (
    <div className="flex flex-col gap-7">
      <div className="text-center">
        <span className="font-display text-7xl text-bone sm:text-8xl">{value}</span>
        <span className="ml-2 font-mono text-sm text-ash">/ 1600</span>
      </div>
      <input
        type="range"
        min={400}
        max={1600}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-signal"
      />
      <div className="flex flex-wrap justify-center gap-2.5">
        {presets.map((p) => (
          <Chip key={p} label={String(p)} selected={value === p} onClick={() => onChange(p)} />
        ))}
      </div>
    </div>
  );
}

/* ---------- the rules ---------- */
function RulesStep({ agreed, onAgree }: { agreed: boolean; onAgree: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-3">
        {RULES.map((r, i) => (
          <motion.li
            key={r.n}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3"
          >
            <span className="font-mono text-sm text-signal">{r.n}</span>
            <span className="text-bone">
              {r.rule} <span className="text-ash">{r.sub}</span>
            </span>
          </motion.li>
        ))}
      </ul>
      <p className="font-display text-xl text-bone">{RULES_CLOSER}</p>
      <button
        type="button"
        onClick={() => onAgree(!agreed)}
        className="flex items-center gap-3 rounded-xl border border-line-2 bg-ink-1 p-4 text-left transition-colors hover:border-bone/30"
      >
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all ${
            agreed ? "border-signal bg-signal text-bone" : "border-line-2 text-transparent"
          }`}
        >
          <Check size={14} />
        </span>
        <span className="text-sm text-bone">
          I&apos;m in. I&apos;ll live by these — and the{" "}
          <Link href="/terms" className="text-signal underline-offset-2 hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="text-signal underline-offset-2 hover:underline">
            Privacy
          </Link>
          .
        </span>
      </button>
    </div>
  );
}

/* ---------- stay signed in ---------- */
function StayToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between rounded-xl border border-line bg-ink-1/60 px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm text-bone">{STAY_OPTIONS[0]}</span>
        <span className="block text-xs text-ash">We&apos;ll keep you inside. No signing in again.</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-signal" : "bg-ink-3"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-bone transition-all ${
            value ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
