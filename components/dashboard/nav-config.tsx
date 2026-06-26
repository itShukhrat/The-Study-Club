import {
  Compass,
  Route,
  Target,
  GraduationCap,
  BookA,
  TrendingUp,
  Trophy,
  Sparkles,
  User,
  Landmark,
  Coins,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Today", href: "/dashboard", icon: Compass },
  { label: "Study Plan", href: "/dashboard/plan", icon: Route },
  { label: "Practice", href: "/dashboard/practice", icon: Target },
  { label: "Learn", href: "/dashboard/learn", icon: GraduationCap },
  { label: "Vocabulary", href: "/dashboard/vocab", icon: BookA },
  { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Plans", href: "/dashboard/plans", icon: Sparkles },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export const FUTURE_NAV: { label: string; icon: LucideIcon }[] = [
  { label: "University", icon: Landmark },
  { label: "Scholarships", icon: Coins },
  { label: "Essays", icon: PenLine },
];

/** Section copy for the dynamic stub pages. */
export const SECTION_COPY: Record<
  string,
  { title: string; line: string; status: string }
> = {
  plan: {
    title: "Study Plan",
    line: "Your weeks to test day, mapped to the topics that move the score most. The engine that builds this is coming next.",
    status: "Wiring the route engine",
  },
  practice: {
    title: "Practice",
    line: "Full digital SATs, timed sections, and targeted drills with Desmos built in. The question bank is being loaded.",
    status: "Loading the question bank",
  },
  learn: {
    title: "Learn",
    line: "Short lessons, then ten questions that prove you got it. No three-hour lectures. The library is being built.",
    status: "Recording the lessons",
  },
  vocab: {
    title: "Vocabulary",
    line: "Spaced repetition that brings back the words you miss until they stick. A daily word puzzle keeps the streak alive.",
    status: "Curating the word lists",
  },
  progress: {
    title: "Progress",
    line: "Baseline vs today, accuracy by topic, pacing vs the room. The full score map lands once you take your first test.",
    status: "Take a test to draw the map",
  },
  leaderboard: {
    title: "Leaderboard",
    line: "Quiet competition. Points for showing up, not for being loud. The board opens when the club fills up.",
    status: "Filling the club",
  },
  plans: {
    title: "Plans",
    line: "Free gets you the route. Paid unlocks deeper drills and 1-on-1 coaching. Pricing is being finalized.",
    status: "Setting the price",
  },
  profile: {
    title: "Profile",
    line: "Your name, your target, your exam date, and how you like the route to feel. Full settings are coming.",
    status: "Building settings",
  },
};
