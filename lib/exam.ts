// Study Club — exam engine: types, official SAT raw->scaled scoring, grading.
// Conversion tables are the College Board "Raw Score Conversion Table: Section
// Scores" from SAT Practice Test #1 (R&W raw 0-66, Math raw 0-54).

export type ExamChoice = { id: "A" | "B" | "C" | "D"; text: string };

export type ExamQuestion = {
  n: number;
  domain: string;
  skill?: string;
  type: "mcq" | "spr";
  passageHtml?: string;
  stemHtml: string;
  choices?: ExamChoice[];
  correct?: "A" | "B" | "C" | "D";
  sprAnswers?: string[];
  figure?: string;
};

export type ExamModule = {
  id: string;
  section: "rw" | "math";
  label: string;
  minutes: number;
  questions: ExamQuestion[];
};

export type ExamTest = { id: string; title: string; modules: ExamModule[]; kind?: "practice" | "mock" };

// [low, high] indexed by raw score
export const RW_TABLE: [number, number][] = [
  [200,200],[200,200],[200,200],[200,200],[200,200],[200,200],[200,200],[200,210],
  [210,230],[220,240],[230,250],[250,270],[260,280],[280,300],[290,310],[300,320],
  [330,350],[350,370],[360,380],[370,390],[380,400],[390,410],[400,420],[410,430],
  [420,440],[430,450],[430,450],[440,460],[450,470],[460,480],[460,480],[470,490],
  [480,500],[490,510],[490,510],[500,520],[510,530],[520,540],[520,540],[530,550],
  [540,560],[550,570],[550,570],[560,580],[570,590],[570,590],[580,600],[590,610],
  [590,610],[600,620],[610,630],[610,630],[620,640],[630,650],[640,660],[640,660],
  [650,670],[660,680],[670,690],[680,700],[690,710],[700,720],[710,730],[720,740],
  [740,760],[770,780],[790,800],
];

export const MATH_TABLE: [number, number][] = [
  [200,200],[200,200],[200,200],[200,200],[200,200],[200,200],[200,200],[200,220],
  [200,230],[220,250],[250,280],[270,300],[290,320],[300,330],[310,340],[320,350],
  [330,360],[340,370],[350,380],[360,390],[370,400],[380,410],[400,430],[410,440],
  [420,450],[430,460],[440,470],[450,480],[460,490],[470,500],[480,510],[490,520],
  [510,540],[520,550],[530,560],[540,570],[550,580],[560,590],[570,600],[590,620],
  [600,630],[610,640],[620,650],[630,660],[640,670],[660,690],[670,700],[690,720],
  [700,730],[720,750],[740,770],[760,790],[770,790],[790,800],[800,800],
];

export const RW_MAX = 66;
export const MATH_MAX = 54;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi));

export function scaleFromRange([lo, hi]: [number, number]): number {
  return Math.round((lo + hi) / 2 / 10) * 10;
}

/** Section score (200-800) from a section raw score. */
export function sectionScore(section: "rw" | "math", raw: number) {
  const table = section === "rw" ? RW_TABLE : MATH_TABLE;
  const r = clamp(Math.round(raw), 0, table.length - 1);
  const range = table[r];
  return { score: scaleFromRange(range), low: range[0], high: range[1] };
}

/** Normalize a student-produced response for comparison. */
export function normalizeSpr(v: string): string {
  return (v || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .toLowerCase();
}

export function isCorrect(q: ExamQuestion, answer: string | undefined): boolean {
  if (answer == null || answer === "") return false;
  if (q.type === "mcq") return answer === q.correct;
  const a = normalizeSpr(answer);
  return (q.sprAnswers || []).some((acc) => normalizeSpr(acc) === a);
}

export type AnswerMap = Record<string, string>; // key `${moduleId}:${n}` -> answer

export function answerKey(moduleId: string, n: number) {
  return `${moduleId}:${n}`;
}

export type DomainStat = { domain: string; correct: number; total: number };
export type SectionResult = {
  section: "rw" | "math";
  label: string;
  raw: number;
  total: number;
  estimatedFullRaw: number;
  complete: boolean;
  score: number;
  low: number;
  high: number;
  domains: DomainStat[];
};

export type GradeResult = {
  sections: SectionResult[];
  total: number;
  totalLow: number;
  totalHigh: number;
};

export function gradeTest(test: ExamTest, answers: AnswerMap): GradeResult {
  const bySection: Record<"rw" | "math", ExamModule[]> = { rw: [], math: [] };
  for (const m of test.modules) bySection[m.section].push(m);

  const sections: SectionResult[] = [];

  (["rw", "math"] as const).forEach((section) => {
    const mods = bySection[section];
    if (!mods.length) return;
    const domainMap = new Map<string, DomainStat>();
    let raw = 0;
    let total = 0;
    for (const m of mods) {
      for (const q of m.questions) {
        total += 1;
        const ok = isCorrect(q, answers[answerKey(m.id, q.n)]);
        if (ok) raw += 1;
        const d = domainMap.get(q.domain) || { domain: q.domain, correct: 0, total: 0 };
        d.total += 1;
        if (ok) d.correct += 1;
        domainMap.set(q.domain, d);
      }
    }
    const sectionMax = section === "rw" ? RW_MAX : MATH_MAX;
    const complete = total >= sectionMax;
    // Extrapolate to a full-section raw when only part of the section was taken.
    const estimatedFullRaw = complete ? raw : Math.round((raw / Math.max(total, 1)) * sectionMax);
    const sc = sectionScore(section, estimatedFullRaw);
    sections.push({
      section,
      label: section === "rw" ? "Reading & Writing" : "Math",
      raw,
      total,
      estimatedFullRaw,
      complete,
      score: sc.score,
      low: sc.low,
      high: sc.high,
      domains: [...domainMap.values()],
    });
  });

  const total = sections.reduce((s, x) => s + x.score, 0);
  const totalLow = sections.reduce((s, x) => s + x.low, 0);
  const totalHigh = sections.reduce((s, x) => s + x.high, 0);
  return { sections, total, totalLow, totalHigh };
}