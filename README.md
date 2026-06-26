# Study Club

**Momentum, not memorization.** The SAT route for serious students.

Study Club isn't where you study — it's where you build momentum. You know your
score, you know your goal, and the distance between them is your route. This is
the platform that draws it.

> Dark-first, cinematic, and deliberately not school-shaped. Built to feel like
> joining a movement, not opening an LMS.

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind v4** for styling (design tokens in `app/globals.css`)
- **Framer Motion** for motion and micro-interactions
- **Supabase** (Postgres + Auth) — email-code + Google, persistent sessions
- **Anthropic API** (`claude-opus-4-8`) for the AI coach (optional)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

The site runs immediately in **design-preview mode** — no backend required.
Onboarding accepts any 6-digit code and the dashboard reads your route from
`localStorage`, so you can experience the whole flow before wiring a backend.

## Connect Supabase (real accounts)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.local.example` → `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the schema: open `supabase/schema.sql` in the Supabase SQL Editor and run it
   (tables, RLS policies, the auto-profile trigger, and the weekly leaderboard view).
4. **Email codes:** in Supabase → Authentication → Email Templates, set the
   "Magic Link" template to send the token (`{{ .Token }}`) so users get a
   6-digit code instead of a link.
5. **Google:** enable the Google provider in Supabase → Authentication → Providers,
   and add `<your-url>/auth/callback` as a redirect.

Once the env vars are present, the door at `/enter` creates real accounts and
`/dashboard` becomes a protected route (guarded in `proxy.ts`).

## Optional: the AI coach

Add `ANTHROPIC_API_KEY` to `.env.local`. Without it, the coach (`/api/coach`)
returns hand-written fallback lines, so the UI works either way.

## Structure

```
app/
  page.tsx              landing (cinematic, all sections)
  enter/                the 8-step onboarding "movie"
  dashboard/            Today + dynamic section rooms
  auth/callback/        Google OAuth code exchange
  api/coach/            AI coach endpoint (SDK + fallback)
  privacy, terms/       legal templates
components/
  brand/                animated SC logo
  landing/              hero, rules, route, future chapters, footer
  onboarding/           the flow, steps, auth
  dashboard/            sidebar, Today, section stubs
  ui/                   Reveal, MagneticButton
lib/
  brand.ts              100 mottos, the Rules, all copy
  supabase/             client + server
  onboarding.ts         route persistence
proxy.ts                session refresh + route guard (Next 16 middleware)
supabase/schema.sql     full Postgres schema + RLS
```

## The Rules

01 — Show up. Small still counts.
02 — Study the miss.
03 — Protect the streak.
04 — Do the question you want to skip.
05 — Trust the route.
06 — Never start over.

_Progress remembers everything._
