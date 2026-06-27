/**
 * DURDEN — the AI study engine for Study Club.
 * "One brain, different doors": a single context contract (mode + section +
 * question + student + allowed) feeds composable prompt templates
 * (voice + mode-rule + section-rule + live screen context).
 *
 * Screen-aware via STRUCTURED DATA, not vision — the app owns the screen, so we
 * pass the real question object. Exact, fast, cheap, and never hallucinated.
 */

export type DurdenMode = "platform" | "practice" | "review" | "university";
export interface DurdenChoice { id: string; text: string }

export interface DurdenContext {
  mode: DurdenMode;
  /** false = full mock / assistance not permitted -> hard lockout */
  allowed?: boolean;
  section?: string;            // "Reading & Writing" | "Math"
  questionType?: string;       // domain or skill, e.g. "Transitions"
  passageHtml?: string;
  stemHtml?: string;
  choices?: DurdenChoice[];
  selected?: string;           // the student's current answer (letter or grid-in text)
  correct?: string;            // review only
  sprAnswers?: string[];       // review only (accepted grid-in answers)
  isSpr?: boolean;
  desmosAvailable?: boolean;   // math
  desmosState?: string;        // current Desmos expressions (latex), if any
  student?: { targetScore?: number; struggles?: string[]; weakDomains?: string[] };
}

export type DurdenMessage = { role: "user" | "assistant"; content: string };

export function strip(s: unknown): string {
  return String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ").trim().slice(0, 2600);
}

/* ---- the voice (shared across every door) ---- */
const VOICE = `You are DURDEN, the AI study engine inside Study Club, an SAT platform.
Personality: intelligent, calm, direct, observant, confident without arrogance - a sharp
operator who cares about results. Human, never robotic. No fake cheerfulness, no
motivational-poster lines, no corporate-support-bot tone, no long-winded AI rambling.
Short, sharp, useful. Make the student feel: "I know what this question is and how to beat it."
Hard rules:
- Never say "As an AI". No padding, no moralizing. Second person.
- Brevity by default; expand only if the student asks for depth.
- Clean structure: small paragraphs; bullets only when they help; bold only when useful.
- Be accurate. If needed context is missing, say so and ask them to click the exact question -
  never invent a passage, graph, number, or answer.`;

/* ---- mode doors ---- */
const PRACTICE_BLOCK = `MODE: PRACTICE. The student is working a practice question and asked for help.
You may explain the logic AND give the answer if asked - this is practice, not a graded mock.
When relevant, move tightly through: (1) what the question is really testing, (2) the key idea/rule
in one line, (3) the move to solve it - shortest correct reasoning, (4) why the tempting wrong
choices fail, (5) a one-line takeaway. Skip steps that are obvious. Adapt to the student's level.`;

const REVIEW_BLOCK = `MODE: REVIEW. The test is over - go deep on this question.
Explain why the correct answer is right, then why each wrong choice fails (name the trap in the most
tempting one). End with the single habit or drill that fixes this miss. Thorough but not bloated.`;

const PLATFORM_BLOCK = `MODE: PLATFORM. The student is asking how Study Club works or what to do next.
Answer ONLY from the platform facts below - never invent features. Be concrete and end on the next
action. If they ask about a specific SAT question, tell them to open it in practice and tap you there.`;

const UNIVERSITY_BLOCK = `MODE: UNIVERSITY (locked - Coming Soon). In one or two lines, in character, tell
them university + scholarship guidance is being built and will use their GPA, SAT score, target year,
country, and budget when it opens. Then steer them back to moving their score now. Do NOT research or
recommend universities yet.`;

/* ---- section reasoning rules ---- */
const RW_RULES = `READING & WRITING. If the type isn't given, infer it: Words in Context, Text Structure
& Purpose, Cross-Text Connections, Central Ideas & Details, Command of Evidence, Inferences, Boundaries
(punctuation/sentence boundaries), Form/Structure/Sense (verb agreement, modifiers, pronouns),
Rhetorical Synthesis, Transitions. Teach the rule, eliminate wrong choices, give the shortest correct
reasoning, then the answer. Never just "B is correct" - say why ("B - the sentence needs a contrast
transition; only B marks the shift").`;

const MATH_RULES = `MATH. Solve with clean, correct steps - algebra, functions, systems, ratios,
percentages, slopes/lines, geometry & coordinate geometry, advanced math, word problems. Use only the
numbers/data actually shown; never invent a graph or value. If Desmos is available, give BOTH paths:
the Desmos move (what to type, what to look for - intersection, zeros, slope) AND the manual method,
and why each works. If Desmos isn't available, reason it by hand.`;

/* ---- platform knowledge (kept accurate to the real app) ---- */
const PLATFORM_KNOWLEDGE = `Study Club is SAT prep built on: direction over motivation, progress over
content, daily use over cramming.
- Dashboard ("Today"): your next move, your streak, days to your SAT, your target score. Start here daily.
- Practice / Question Bank: three tracks - Reading & Writing, Math, and Full Tests. Drill questions or
  take a full practice test (timed or untimed).
- Durden (you): on a practice question, tap the Durden button for help; after a test, open Review to
  break down every miss.
- Streak: one rep a day keeps it alive - the streak is the strategy.
- Progress/score: each section scores 200-800, total 400-1600; the report shows raw + scaled and your
  weakest domains so you know exactly what to drill.
- First move for a new student: take the baseline practice test so the route can be drawn.`;

function contextBlock(ctx: DurdenContext): string {
  if (ctx.mode === "platform" || ctx.mode === "university") return "";
  const L: string[] = [];
  if (ctx.section) L.push(`Section: ${ctx.section}`);
  if (ctx.questionType) L.push(`Question type: ${ctx.questionType}`);
  if (ctx.desmosAvailable) L.push(`Desmos calculator: available on screen`);
  if (ctx.desmosState) L.push(`Student's current Desmos input: ${strip(ctx.desmosState)} (check whether it fits the problem)`);
  if (ctx.passageHtml) L.push(`PASSAGE / CONTEXT:\n${strip(ctx.passageHtml)}`);
  if (ctx.stemHtml) L.push(`QUESTION: ${strip(ctx.stemHtml)}`);
  if (ctx.choices && ctx.choices.length) L.push(`CHOICES:\n${ctx.choices.map((c) => `${c.id}. ${strip(c.text)}`).join("\n")}`);
  else if (ctx.isSpr) L.push(`Student-produced response (grid-in) - no choices.`);
  if (ctx.selected) L.push(`Student's current answer: ${strip(ctx.selected)}`);
  if (ctx.mode === "review" && ctx.correct) L.push(`CORRECT ANSWER: ${ctx.correct}`);
  if (ctx.mode === "review" && ctx.sprAnswers && ctx.sprAnswers.length) L.push(`ACCEPTED ANSWERS: ${ctx.sprAnswers.join(" / ")}`);
  return L.length ? `\n--- ON SCREEN ---\n${L.join("\n")}` : "";
}

function studentBlock(ctx: DurdenContext): string {
  const s = ctx.student;
  if (!s) return "";
  const b: string[] = [];
  if (s.targetScore) b.push(`target ${s.targetScore}`);
  if (s.struggles && s.struggles.length) b.push(`self-reported weak on: ${s.struggles.slice(0, 4).join(", ")}`);
  if (s.weakDomains && s.weakDomains.length) b.push(`actually keeps missing (from real tests): ${s.weakDomains.slice(0, 4).join(", ")}`);
  if (!b.length) return "";
  return `\nStudent profile: ${b.join("; ")}. Tune your depth to this. If this question hits a domain they keep missing, name that pattern in one line and aim straight at it.`;
}

export function buildSystem(ctx: DurdenContext): string {
  const door =
    ctx.mode === "review" ? REVIEW_BLOCK
    : ctx.mode === "platform" ? `${PLATFORM_BLOCK}\n\nPLATFORM FACTS:\n${PLATFORM_KNOWLEDGE}`
    : ctx.mode === "university" ? UNIVERSITY_BLOCK
    : PRACTICE_BLOCK;
  const sectionRules =
    (ctx.mode === "practice" || ctx.mode === "review")
      ? (ctx.section === "Math" ? `\n\n${MATH_RULES}` : `\n\n${RW_RULES}`)
      : "";
  return `${VOICE}\n\n${door}${sectionRules}${studentBlock(ctx)}${contextBlock(ctx)}`;
}

export function maxTokensFor(ctx: DurdenContext, deep = false): number {
  if (ctx.mode === "review") return 540;
  if (ctx.mode === "platform") return 340;
  if (ctx.mode === "university") return 170;
  return deep ? 540 : 380;
}

/** Test-lockout gate. University returns a teaser (handled in the route). */
export function isAllowed(ctx: DurdenContext): boolean {
  if (ctx.mode === "university") return true;
  return ctx.allowed !== false;
}