# Practice Bank — Content Audit & Import Plan (Words in Context)

Source of truth for the first live practice category. **No code yet** — this is the
curriculum-architect / data-engineering plan that the import pipeline and UI will follow.

## 1. Files inventory

| File | Pages | Distinct Question IDs | Notes |
|------|-------|-----------------------|-------|
| A — `...words-in-context-topicals...pdf` | 134 | ~125 unique | Topical compilation. Each item = OCR text **plus** a facing screenshot of the same item. |
| B — `ilide.info-sat-suite-question-bank-words-in-context...pdf` | 34 | 34 | Official "SAT Suite Question Bank" export. |
| Scribd 762399800 "Words in Context (Easy) Answers" | 44 | n/a | **Paywalled — not machine-readable.** Re-attach as PDF to ingest. |
| Scribd 772779279 "Words in Context" | 102 | n/a | **Paywalled — not machine-readable.** Re-attach as PDF to ingest. |

**Critical finding: File B is a strict subset of File A.** Every ID in B (359902ae, 22a41819,
5e57efec, d4a8f7cb, 0f040c50, 9cdcd902, e459076b, ca47273b, 5a278f24, c14daa3c, 8b46bb51,
849bf8d7, b92c13fa, e8c26398, 9aa44886, 54804e10, 637d0878, d2eb1df1, a2835734, d3ca5d59,
9d73c9eb, fce80a36, 0d402146, e4f312c5, a4f50d30, aa7ae735, 62a18353, 3d658a5a, d8d1ecaa,
bce627d9, 3f753a8e, 82b7c3b2, aad56f2b, e8fb0744) also appears in A. **Dedup by `questionId`;
A is the superset (~125 questions).** Expect more dupes when the Scribd files land.

## 2. Question-type identification

Every item is one skill: **Reading & Writing -> Craft and Structure -> Words in Context.**
But there are **two distinct sub-archetypes** that need different handling:

| Sub-archetype | Stem signature | Example | Choices look like |
|---------------|----------------|---------|-------------------|
| `completion` (fill-the-blank) | "Which choice completes the text with the most logical and precise word or phrase?" with a `_____` blank | e35d481c (surmised), 5e57efec (independent of) | single words / short phrases |
| `meaning` (word-in-context, literary) | "As used in the text, what does the word/phrase 'X' most nearly mean?" with an underlined target word | 0f040c50 (spread=extended), 9aa44886 (quality=characteristic) | synonyms; `meaning` items almost always cite a literary source (Hawthorne, Eliot, Fitzgerald, Martel, Hamid, Hurston, Larsen, McKay, Burnett, Carroll, Wilde, Capek, Tarkington, Woolf...) |

Rough split in the data: ~70% `completion`, ~30% `meaning`. This is the single most useful
derived tag — it drives Durden coaching and an optional sub-filter.

## 3. Difficulty

Each item carries difficulty **twice**: a visual 3-square meter (1 filled = Easy, 2 = Medium,
3 = Hard) **and** a text line `Question Difficulty: Easy|Medium|Hard`. They agree. The text
label is the reliable extraction source (squares are images).

Distribution (File A, approx): Easy ~55%, Medium ~25%, Hard ~20% — Easy-skewed, so the
"Difficult" filter pool is smaller and needs a graceful fallback (see section 8).

## 4. Missing metadata (must be derived or added)

- **No sub-archetype tag** (`completion` vs `meaning`) — derive from the stem regex.
- **No micro-skill tag** — optional future enrichment (connotation/tone, logical-precision,
  transition, literary-diction, phrase/idiom).
- **No structured per-choice explanation** — the rationale is one prose blob; the correct
  choice and the three distractor reasons are inline ("Choice A is incorrect because...").
- **No passage/source split** — `meaning` items embed a source line (e.g. "adapted from George
  Eliot's 1871-72 novel Middlemarch" / "(c)2001 by Yann Martel"); `completion` items have none.
- **No time estimate, no examStyle flag** — all items are official CB style (examStyle = true);
  default time ~45s (the data even cites 45s as a typical time-on-task).
- **Target word** for `meaning` items is only marked by an underline (lost in OCR) — must be
  recovered from the quoted word in the stem ("the word 'spread'").

## 5. Formatting inconsistencies / OCR artifacts

- **Double-ingest risk (File A):** every item appears as OCR text *and* as a page-image of the
  same item. Parser must read the text layer only.
- **Multi-page items:** a few items split question/rationale across a page break (e.g. b411eb09,
  54804e10, f83f0aab, e8fb0744). Parser must stitch by `Question ID` until the next `Question ID`.
- **Blank rendering:** the cloze blank is underscores of variable length (`____` / `______`).
  Normalize to a single token `{{blank}}`.
- **Typography:** curly vs straight quotes, em-dash `—` vs hyphen, lost italics on work titles,
  occasional mid-word line breaks. Normalize quotes/dashes; wrap known titles in `<em>` later.
- **Rationale verbosity varies:** File B carries the full official rationale; File A is
  sometimes terser/paraphrased. When the same ID exists in both, **prefer the longer/official
  (File B) rationale.**
- **Choice labels:** consistently `A. B. C. D.` — reliable. `Correct Answer: <letter>` reliable.

## 6. Repeated structure (this makes parsing easy)

Each record is a clean state machine:
`Question ID <hex>` -> metadata table (Assessment/Test/Domain/Skill/Difficulty) -> `ID: <hex>`
(stem + choices) -> `ID: <hex> Answer` -> `Correct Answer:` -> `Rationale` -> `Question
Difficulty:`. A regex/state-machine importer keyed on `Question ID` + `Correct Answer:` +
`Question Difficulty:` will extract every field deterministically.

## 7. Grouping opportunities

1. **Skill** = Words in Context (the one live category now).
2. **Sub-archetype** = completion / meaning (derived; powers Durden + optional sub-toggle).
3. **Difficulty** = easy / medium / hard (native), surfaced as Easy / Difficult / All.
4. **Source-era** (derived, for variety mixing) = literary vs contemporary-informational.
5. **Micro-skill tags** (future) for adaptive paths.
## 8. Recommended import schema (normalized question record)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PracticeQuestion",
  "type": "object",
  "required": ["questionId", "section", "skill", "type", "difficulty", "stemHtml", "choices", "correct", "explanation", "source"],
  "properties": {
    "questionId":   { "type": "string", "description": "College Board hex id, e.g. 0f040c50 — canonical dedup key" },
    "section":      { "type": "string", "enum": ["rw", "math"] },
    "domain":       { "type": "string", "description": "e.g. Craft and Structure" },
    "skill":        { "type": "string", "description": "e.g. words-in-context" },
    "type":         { "type": "string", "enum": ["completion", "meaning"], "description": "derived sub-archetype" },
    "difficulty":   { "type": "string", "enum": ["easy", "medium", "hard"] },
    "passageHtml":  { "type": ["string","null"], "description": "literary excerpt for meaning items; null for completion" },
    "sourceCitation": { "type": ["string","null"], "description": "e.g. 'George Eliot, Middlemarch (1871-72)'" },
    "stemHtml":     { "type": "string", "description": "sentence with {{blank}} (completion) or the question prompt (meaning)" },
    "targetWord":   { "type": ["string","null"], "description": "underlined word for meaning items" },
    "choices":      { "type": "array", "items": { "type": "object", "properties": { "id": {"enum":["A","B","C","D"]}, "text": {"type":"string"} } } },
    "correct":      { "type": "string", "enum": ["A","B","C","D"] },
    "explanation":  {
      "type": "object",
      "properties": {
        "correct": { "type": "string", "description": "why the right answer is right" },
        "distractors": { "type": "object", "description": "A/B/C/D -> why-wrong (correct key omitted)" },
        "raw": { "type": "string", "description": "full original rationale, kept verbatim as fallback" }
      }
    },
    "topicTags":    { "type": "array", "items": { "type": "string" }, "description": "future micro-skills" },
    "timeEstimateSec": { "type": "integer", "default": 45 },
    "examStyle":    { "type": "boolean", "default": true },
    "sourceFile":   { "type": "string" },
    "sourceIndex":  { "type": "integer" },
    "status":       { "type": "string", "enum": ["active","draft","flagged"], "default": "active" }
  }
}
```

Pipeline: `parse(pdfText) -> normalize -> dedup(by questionId, prefer longer rationale) ->
validate(schema) -> emit lib/bank/words-in-context.ts (or JSON)`. New files drop in without code
changes: the parser is keyed on the stable CB record structure (section 6), and the catalog reads
whatever the bank exports. Keep it data-driven so Rhetorical Synthesis, Transitions, Math, etc.
are just more records under new `skill` values.

## 9. Category mapping table (R&W catalog -> data status)

| Catalog type (UI) | internal `skill` slug | data now | status |
|---|---|---|---|
| Words in Context | `words-in-context` | ~125 Q | **LIVE** |
| Rhetorical Synthesis | `rhetorical-synthesis` | 0 | coming soon |
| Transitions | `transitions` | 0 | coming soon |
| Text Structure & Purpose | `text-structure-purpose` | 0 | coming soon |
| Command of Evidence | `command-of-evidence` | 0 | coming soon |
| Central Ideas & Details (Main Idea) | `central-ideas` | 0 | coming soon |
| Inferences | `inferences` | 0 | coming soon |
| Boundaries | `boundaries` | 0 | coming soon |
| Form, Structure & Sense (Grammar) | `grammar-usage` | 0 | coming soon |

Within Words in Context, the optional sub-toggle is `completion` vs `meaning`. Catalog cards for
0-question types render a "Loading the bank" / coming-soon state, never a dead end.

## 10. Difficulty mapping rule

- **Store native** `easy | medium | hard` from the `Question Difficulty:` label (cross-checked
  against the square meter when present; if they ever disagree, trust the text label and log it).
- **UI filter:** `Easy` = easy; `Difficult` = medium U hard; `All` = everything.
- **Graceful fallback:** if a chosen (skill x sub-type x difficulty) pool has < 5 items, widen to
  `All` difficulty and show a one-line note ("Only 3 Hard items here — mixing in Medium."). Never
  show an empty drill.

## 11. Explanation cleanup plan

1. **Dedup**, preferring the longer/official rationale when an id repeats across files.
2. **Split** the rationale blob into `correct` + per-distractor reasons using the reliable markers
   "Choice X is the best answer..." and "Choice Y is incorrect because...".
3. **Normalize** quotes/dashes; restore `{{blank}}`; re-italicize known work titles; recover
   `targetWord` from the quoted word in `meaning` stems.
4. **Keep `raw`** verbatim as a safety net so nothing is lost if the split misfires.
5. **Strip** OCR cruft (page numbers, the duplicated screenshot text, stray "Difficulty" image alt).

## 12. How Durden should behave by question type (practice + review only; never in full test)

**Global (practice):** never reveal the letter before the student answers; first nudge = strategy,
not answer; calm, sharp, second person; <= 3 short lines unless asked for depth.

**`completion` (fill-the-blank):**
- Name it: "Words in Context — completion. The blank has to fit the logic *and* the tone."
- Coach the move: find the sentence's logical pivot (contrast/cause/continuation), predict a word
  in plain language, then match it to a choice.
- Elimination: "Two of these clash with the author's stance — rule them out first."
- After answer (review): confirm the right word's precise sense; for each distractor, give the
  one-line reason it fails (too strong, wrong connotation, off-logic, right-topic-wrong-meaning).

**`meaning` (word-in-context, literary):**
- Name it: "It's asking what 'X' means *here* — not its most common definition."
- Coach the move: cover the word, read the sentence, predict the local meaning from surrounding
  detail; beware the trap choice that's the word's everyday sense but wrong in context.
- Use the passage: "The line says the rose 'revived from a deathlike slumber' — so 'singular' is
  pointing at something extraordinary, not lonely."
- After answer: contrast the in-context sense vs the dictionary-default trap.

**By difficulty:** Easy -> one crisp strategy line. Medium -> strategy + one elimination. Hard ->
walk the logical pivot explicitly and expose the most tempting distractor (the Hard items here,
e.g. 5e57efec / 54804e10 / e8fb0744, all hinge on one precise distractor).

Durden receives the structured screen context (type, difficulty, stem, choices, selectedAnswer,
passage, targetWord) and keys its template on `type` — it must never need to "guess" the archetype.