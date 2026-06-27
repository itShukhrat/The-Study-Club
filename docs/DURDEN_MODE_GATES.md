# DURDEN_MODE_GATES

Implemented in `lib/durden.ts` (`buildSystem`, `isAllowed`, `maxTokensFor`) and
enforced in `app/api/tutor/route.ts`. One brain, four doors. Every call carries a
`DurdenContext` (mode + section + question + student + allowed).

| Mode | Where | Can do | Cannot do |
|------|-------|--------|-----------|
| PLATFORM | dashboard launcher | explain how Study Club works, what to do next (from a fixed knowledge base) | discuss a specific live SAT question |
| PRACTICE | question-bank drills (`kind:"practice"`) | read the active question via structured context; explain logic; give the answer if asked; R&W type-logic; Math with Desmos + manual paths; sees live Desmos input + the student's weak domains | help during a full mock |
| REVIEW | post-test ScoreReport | deep per-question breakdown: why right, why each wrong, the trap, the next drill | leak answers before submission |
| FULL TEST (mock) | `kind:"mock"` exam | NOTHING | hints, explanations, answers, any chat |

## Enforcement (defense in depth)
1. UI: in a mock the ExamRunner renders no Durden button/panel.
2. API: `isAllowed(ctx)` returns false when `allowed !== true`; the route returns
   a hard refusal (`source:"locked"`) before any model call. Same for `university`
   (teaser only).
3. The model never receives the answer key in PRACTICE; only REVIEW passes `correct`.

## Known limit
`allowed` is currently client-supplied. True un-bypassability needs a
server-issued mock-session token; deferred until a server-tracked timed mock
exists (the gate + seam are in place).