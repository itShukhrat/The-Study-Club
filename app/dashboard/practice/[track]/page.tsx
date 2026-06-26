import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrack } from "@/lib/sat-topics";
import { TopicCatalogue } from "@/components/practice/TopicCatalogue";
import { ExamLobby } from "@/components/practice/ExamLobby";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  if (track === "exam") return { title: "Full Exam" };
  const t = getTrack(track);
  return { title: t ? t.name : "Practice" };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  if (track === "exam") return <ExamLobby />;
  const t = getTrack(track);
  if (!t) notFound();
  return <TopicCatalogue track={t} />;
}
