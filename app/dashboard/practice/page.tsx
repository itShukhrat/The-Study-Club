import type { Metadata } from "next";
import { PracticeRoom } from "@/components/practice/PracticeRoom";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return <PracticeRoom />;
}
