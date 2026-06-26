import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTest } from "@/lib/exam-test1";
import { ExamRunner } from "@/components/exam/ExamRunner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}): Promise<Metadata> {
  const { testId } = await params;
  const t = getTest(testId);
  return { title: t ? t.title : "Test" };
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTest(testId);
  if (!test) notFound();
  return <ExamRunner test={test} />;
}