# E2E_TEST_CASES

Status legend: [PASS] verified, [OK] supported by design, [TODO] planned.

## Mode gating
- [PASS] Mock hides every Durden trigger; POST /api/tutor with `allowed:false`
  returns `source:"locked"` (no model call, no answer leak).
- [PASS] Practice returns `source:"ai"`; Review returns deep explanation;
  University returns locked teaser. (Verified live previously.)
- [OK] Review re-enables Durden after submission.

## Timer / timeout
- [OK] Per-module countdown; at 0:00 the module auto-advances; last module 0:00
  -> finished -> ScoreReport.
- [OK] Pause freezes the clock; Hide masks digits without pausing.
- [PASS] After R&W Module 2 the engine enters a 10-minute BREAK (phase="break",
  600s countdown); "Start Math now" resumes early; at 0:00 it auto-advances to
  Math Module 1. Mock start is a timed-only exam briefing (no "Untimed").
- [TODO] Server-authoritative time (anti-tamper) for graded mocks.

## Flagged questions
- [OK] Mark for Review toggles per question; navigator shows the bookmark badge
  and lets you jump back; flags persist across module navigation in-session.

## Calculator open/close (math)
- [OK] Calculator toggles a draggable Desmos panel; Reference toggles the formula
  sheet; both close cleanly and do not block navigation.
- [PASS] In practice/review, the calculator streams expressions to Durden (it
  caught a wrong graph in testing); in a mock nothing is streamed.

## Navigation / answers
- [OK] Back disabled on the first question; Next becomes Finish on the last.
- [OK] Selecting a choice / typing a grid-in updates the answerMap; eliminated
  choices can't be selected; question-to-question transition animates.

## Resume from dropout  [SHIPPED]
- [PASS] lib/exam-session.ts autosaves the full snapshot (answers, marked, elim,
  mi, qi, secLeft, phase, breakLeft) to localStorage `sc.exam.<testId>` on every
  change. On return, ExamRunner shows a ResumeModal ("Module X - Question Y,
  mm:ss left, N answered") with Resume / Start over. justResumed guards the
  per-module clock so a resumed countdown is not reset to full.
- [PASS] Mid-break dropout resumes onto the break with the break countdown intact.
- [PASS] Sessions older than 3h are treated as expired and cleared on load.
- [TODO] Supabase mirror for cross-device resume; server token for tamper-proof
  time. Shapes in FULL_TEST_SESSION_SCHEMA.json / QUESTION_STATE_SCHEMA.json.

## Scoring correctness
- [PASS] 120 questions, every one keyed (106 MCQ + 14 grid-in incl. the `2;-12`
  double answer). Build verified; raw->scaled uses the official Test #1 tables.