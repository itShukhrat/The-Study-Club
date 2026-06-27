# REVIEW_FLOW_SPEC

Post-test review is `components/exam/ScoreReport.tsx`, shown when `finished`.
This is where Durden returns and becomes the point of the product.

## On entry
- `gradeTest(test, answers)` computes section raw -> scaled (official tables),
  total (400-1600), per-domain accuracy, and whether a section is incomplete
  (labelled "Estimated" vs "Official scale").
- Results persist via `saveTestResult` (`lib/progress.ts`): last score, testsTaken,
  and `weakDomains` (<75%) for future weakness-aware Durden + dashboard signals.

## Sections of the report
1. Certificate header: total score (large), range, official/estimated badge.
2. Two section cards: R&W and Math - raw, scaled, range.
3. Domain breakdown: per-domain bars; weak domains called out with a
   "Drill {section} now" deep-link -> `/dashboard/practice/drill?track=..&mode=weak`.
4. Question-by-question review: every question, correct vs the student's answer,
   and a "Durden, explain" button per question.

## Durden in review (REVIEW mode)
Each explain calls `/api/tutor` with `mode:"review"`, full context (passage/stem/
choices + `correct` + the student's `selected` + `questionType` + `weakDomains`).
Durden: why the right answer is right, why each wrong choice fails (names the trap),
and the one drill to fix it. Follow-up questions are supported (chat history).

## Retake / Exit
Retake resets answers/flags/eliminations and returns to the StartModal. Exit
returns to the Question Bank.