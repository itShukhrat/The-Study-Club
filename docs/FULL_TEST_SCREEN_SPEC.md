# FULL_TEST_SCREEN_SPEC

The exam shell is implemented in `components/exam/ExamRunner.tsx`, mounted by the
route `app/dashboard/practice/test/[testId]/page.tsx`. It is a full-screen,
fixed-overlay container (`fixed inset-0 z-[80]`) that escapes the dashboard
chrome entirely. Data comes from `lib/exam-test1.ts` (`TEST_1`, four modules).

## Test kinds
`ExamTest.kind`:
- `"mock"` (TEST_1) -> STRICT EXAM MODE. Durden is hidden + the API refuses
  (`allowed:false`). The only path to help is the post-test review.
- `"practice"` (default / question-bank) -> Durden available in PRACTICE mode.

## Layout
**Top bar** (sticky): section label + module label - center countdown timer with
Pause + Hide - right tool cluster. In a mock the Durden trigger is absent.
- R&W: Highlight.
- Math: Highlight, Calculator (Desmos, draggable), Reference (formula sheet).
- A compact progress pill (answered / total).

**Body**
- R&W: two-pane split - passage (left, serif `exam-prose`) / question + choices
  (right) with a faint SC watermark.
- Math: single centered column; figures (SVG) and tables render inline in the stem.

**Question card**: number badge, Mark for Review (bookmark), Notes + Report
icons, stem, A-D `exam-choice` rows each with a cross-out eliminator, or a
grid-in input for student-produced responses.

**Footer**: "Question X of Y" -> opens the navigator popover; Back; Next/Finish.

**Navigator popover**: grid of every question in the module - answered = filled,
current = ringed, flagged = bookmark badge; tap to jump.

## Timer
Per-module countdown (`secLeft`), R&W 32 min, Math 35 min. Pause freezes; Hide
masks digits; turns ember + ticks under 5:00; at 0:00 it auto-advances the module.

## State machine (current)
`mode` null -> StartModal (Timed | Untimed). On pick -> run module 0..n
(`mi`/`qi`), auto-advancing modules on Next-past-end or timeout, until `finished`
-> ScoreReport. The named states `PRE_TEST -> IN_TEST_RW -> IN_TEST_MATH ->
POST_TEST_REVIEW` map onto (`mode===null`) -> (rw module active) -> (math module
active) -> (`finished`). `BREAK` between sections and a persisted resume token are
planned (see E2E_TEST_CASES).

## Design
Light "exam" surface (`.exam` scope): warm paper, carbon ink, ember accent.
Minimal, high-contrast, serious. No gamification, streaks, leaderboard, or AI
inside a mock.