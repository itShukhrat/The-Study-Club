/**
 * Digital SAT taxonomy — College Board domains & skills, with approximate
 * question counts. Drives the Question Bank catalogue.
 */

export type Topic = { id: string; name: string; count: number };
export type Domain = { name: string; topics: Topic[] };
export type Track = {
  id: "rw" | "math";
  name: string;
  blurb: string;
  total: number;
  minutes: number;
  domains: Domain[];
};

export const RW: Track = {
  id: "rw",
  name: "Reading & Writing",
  blurb: "This is where points quietly leak. Plug the leaks — evidence, structure, clean sentences — and stop handing the test free wrong answers.",
  total: 1492,
  minutes: 64,
  domains: [
    {
      name: "Craft and Structure",
      topics: [
        { id: "words-in-context", name: "Words in Context", count: 219 },
        { id: "text-structure", name: "Text Structure and Purpose", count: 115 },
        { id: "cross-text", name: "Cross-Text Connections", count: 57 },
      ],
    },
    {
      name: "Information and Ideas",
      topics: [
        { id: "central-ideas", name: "Central Ideas and Details", count: 121 },
        { id: "command-of-evidence", name: "Command of Evidence", count: 196 },
        { id: "inferences", name: "Inferences", count: 98 },
      ],
    },
    {
      name: "Standard English Conventions",
      topics: [
        { id: "boundaries", name: "Boundaries", count: 185 },
        { id: "form-structure-sense", name: "Form, Structure, and Sense", count: 180 },
      ],
    },
    {
      name: "Expression of Ideas",
      topics: [
        { id: "rhetorical-synthesis", name: "Rhetorical Synthesis", count: 171 },
        { id: "transitions", name: "Transitions", count: 139 },
      ],
    },
  ],
};

export const MATH: Track = {
  id: "math",
  name: "Math",
  blurb: "Easy up top, traps at the end. We drill both until test day has nothing left to surprise you with.",
  total: 2390,
  minutes: 70,
  domains: [
    {
      name: "Algebra",
      topics: [
        { id: "linear-1var", name: "Linear equations in one variable", count: 210 },
        { id: "linear-2var", name: "Linear equations in two variables", count: 196 },
        { id: "linear-functions", name: "Linear functions", count: 188 },
        { id: "systems", name: "Systems of linear equations", count: 174 },
        { id: "inequalities", name: "Linear inequalities", count: 152 },
      ],
    },
    {
      name: "Advanced Math",
      topics: [
        { id: "equivalent-expr", name: "Equivalent expressions", count: 201 },
        { id: "nonlinear-eq", name: "Nonlinear equations & systems", count: 219 },
        { id: "nonlinear-fn", name: "Nonlinear functions", count: 207 },
      ],
    },
    {
      name: "Problem-Solving & Data Analysis",
      topics: [
        { id: "ratios-rates", name: "Ratios, rates, proportions, units", count: 168 },
        { id: "percentages", name: "Percentages", count: 132 },
        { id: "one-var-data", name: "One-variable data & distributions", count: 121 },
        { id: "two-var-data", name: "Two-variable data & models", count: 118 },
        { id: "probability", name: "Probability & conditional probability", count: 96 },
        { id: "inference", name: "Inference from sample statistics", count: 84 },
      ],
    },
    {
      name: "Geometry & Trigonometry",
      topics: [
        { id: "area-volume", name: "Area and volume", count: 104 },
        { id: "lines-angles", name: "Lines, angles, and triangles", count: 112 },
        { id: "right-triangles", name: "Right triangles and trigonometry", count: 98 },
        { id: "circles", name: "Circles", count: 90 },
      ],
    },
  ],
};

export const TRACKS: Record<"rw" | "math", Track> = { rw: RW, math: MATH };

export function getTrack(id: string): Track | null {
  return id === "rw" || id === "math" ? TRACKS[id] : null;
}
