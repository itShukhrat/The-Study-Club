/**
 * STUDY CLUB — brand content.
 * One voice: a coach, not a cheerleader. Short. Human. Built to be remembered.
 * Banned forever: "unlock your potential", "achieve your dreams",
 * "succeed academically", "future leaders", "world class education",
 * "maximize success".
 */

export const BRAND = {
  name: "Study Club",
  mark: "SC",
  domainTagline: "Momentum, not memorization.",
} as const;

/** The Rules. Original. Written to be repeated, not copied from a movie. */
export const RULES: { n: string; rule: string; sub: string }[] = [
  { n: "01", rule: "Show up.", sub: "Small still counts. Especially small." },
  { n: "02", rule: "Study the miss.", sub: "Your mistakes are the map. Read them." },
  { n: "03", rule: "Protect the streak.", sub: "Keep it breathing and it carries you." },
  { n: "04", rule: "Do the question you want to skip.", sub: "That's where the points hide." },
  { n: "05", rule: "Trust the route.", sub: "Even on slow days. Especially on slow days." },
  { n: "06", rule: "Never start over.", sub: "You're already moving. Keep moving." },
];

export const RULES_CLOSER = "Progress remembers everything.";

/** First-screen lines — emotional tension, never "Welcome to Study Club". */
export const HERO_LINES = [
  "You know your score.",
  "You know your goal.",
  "The distance between them is your route.",
] as const;

export const HERO_FINAL = "Let's find it.";

/** The manifesto block — the "what this is" without sounding like a school. */
export const MANIFESTO = [
  "Study Club isn't where you study.",
  "It's where you build momentum.",
  "One route. One next move. Evidence you can see.",
];

/** 100 original mottos. Used in the marquee, loading states, empty states, emails. */
export const MOTTOS: string[] = [
  "Make it count.",
  "Stay on the route.",
  "Progress leaves evidence.",
  "The work shows.",
  "Don't guess. Decide.",
  "Move the score.",
  "Show up tomorrow.",
  "The route remembers.",
  "Small work still counts.",
  "Miss a day. Not your route.",
  "Today's work shows up later.",
  "Know what to fix. Then fix it.",
  "Quiet reps. Loud results.",
  "You against last week.",
  "The score moves when you do.",
  "No empty effort.",
  "Earn the number.",
  "Discipline is a quiet sound.",
  "Start before you feel ready.",
  "The gap is the plan.",
  "Win the first question of the day.",
  "One more, then rest.",
  "Mistakes are directions.",
  "Keep the streak breathing.",
  "Hard now. Calm in June.",
  "Practice like it's the real thing.",
  "The test rewards the prepared, not the lucky.",
  "Reps don't lie.",
  "Build the student, not the score.",
  "Beat the version of you that quit.",
  "Boring work. Beautiful results.",
  "Your future is a habit.",
  "Less hype. More reps.",
  "Find the gap. Close the gap.",
  "Don't break the chain.",
  "Slow is smooth. Smooth is fast.",
  "Effort compounds. So do excuses.",
  "Show the work. The work shows.",
  "Read it twice. Miss it never.",
  "The clock is honest. Be honester.",
  "Doubt less. Drill more.",
  "Every question is a vote for the score you want.",
  "Be hard to surprise.",
  "Train the panic out.",
  "Confidence is just reps you remember.",
  "The route is short when you walk it daily.",
  "Numbers don't argue.",
  "You fall to your reps, not your hopes.",
  "Make future-you proud.",
  "Outwork the doubt.",
  "The streak is the strategy.",
  "Fix one weakness today.",
  "Sharpen something.",
  "Done beats perfect. Daily beats done.",
  "Pressure is a skill. Practice it.",
  "Your weakest topic is your fastest gain.",
  "The score is downstream of the habit.",
  "Stop starting over.",
  "Be the student nobody bets against.",
  "Earn quiet confidence.",
  "Tomorrow-you is watching.",
  "Trade scrolling for scoring.",
  "The hard chapter is where the points are.",
  "Win the rep in front of you.",
  "Consistency is talent you can build.",
  "The route doesn't care how you feel. Walk it anyway.",
  "Less motivation. More machinery.",
  "Get one percent harder to beat.",
  "Practice the question you fear.",
  "Receipts, not resolutions.",
  "The test is a mirror. Train for the reflection.",
  "Bad day? Small rep. Still counts.",
  "Master the boring stuff.",
  "The gap closes from both ends.",
  "You already know the topic you're avoiding.",
  "Don't study harder. Study the right thing.",
  "Aim at the miss.",
  "Calm hands. Sharp mind.",
  "The points are in the patterns.",
  "Be relentless about the basics.",
  "One clean rep at a time.",
  "Make the test boring.",
  "Repetition is the shortcut.",
  "The route is yours. Walk it.",
  "Quiet today. Loud on results day.",
  "Turn nerves into reps.",
  "You trained for this. So score like it.",
  "Don't chase the score. Build it.",
  "Every miss is tuition.",
  "Keep moving. The score follows.",
  "Discipline now. Options later.",
  "The streak protects you.",
  "You're closer than yesterday.",
  "Train the test, not just the topic.",
  "Show up small. Win big.",
  "Progress hides in the reps you almost skipped.",
  "Become unsurprisable.",
  "Fewer excuses. Better questions.",
  "The work is the shortcut.",
  "Walk in ready. Walk out done.",
];

/** "Stay signed in" — never call it Remember Me. */
export const STAY_OPTIONS = [
  "Stay on my route.",
  "Keep me inside.",
  "Don't make me start over.",
] as const;

/** Future chapters — locked, but alive. */
export const FUTURE_CHAPTERS: { title: string; line: string; eta: string }[] = [
  { title: "University Guidance", line: "Where the score actually goes.", eta: "Next chapter" },
  { title: "Scholarships", line: "The money nobody told you about.", eta: "Being built" },
  { title: "Essays", line: "Sound like you. Only sharper.", eta: "Soon" },
  { title: "ACT", line: "Same discipline. Different test.", eta: "On the map" },
  { title: "AP", line: "More routes are coming.", eta: "Stay close" },
];

/** Fears (onboarding step 3) — the real ones, named plainly. */
export const FEARS = [
  { id: "time", label: "Running out of time", icon: "timer" },
  { id: "reading", label: "Reading passages", icon: "book" },
  { id: "math", label: "Math", icon: "sigma" },
  { id: "motivation", label: "Staying motivated", icon: "flame" },
  { id: "consistency", label: "Being consistent", icon: "repeat" },
  { id: "anxiety", label: "Test anxiety", icon: "wind" },
] as const;

/** Struggles (onboarding step 4) — SAT-specific. */
export const STRUGGLES = [
  "Algebra",
  "Advanced math",
  "Geometry & trig",
  "Problem solving & data",
  "Grammar & conventions",
  "Inference",
  "Vocabulary in context",
  "Main ideas",
  "Pacing",
  "Careless mistakes",
] as const;
