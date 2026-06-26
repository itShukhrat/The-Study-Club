import type { Metadata } from "next";
import { QuestionBankHub } from "@/components/practice/QuestionBankHub";

export const metadata: Metadata = { title: "Question Bank" };

export default function PracticePage() {
  return <QuestionBankHub />;
}
