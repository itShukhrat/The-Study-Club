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

## Resume from dropout  [TODO - highest-priority gap]
- Current: answers live in React state; a hard refresh loses progress.
- Planned: persist answerMap + mi/qi/secLeft to localStorage on every change
  (and to Supabase for cross-device), with a "Resume test" prompt on return.
  Schema is defined in QUESTION_STATE_SCHEMA.json.

## Scoring correctness
- [PASS] 120 questions, every one keyed (106 MCQ + 14 grid-in incl. the `2;-12`
  double answer). Build verified; raw->scaled uses the official Test #1 tables.