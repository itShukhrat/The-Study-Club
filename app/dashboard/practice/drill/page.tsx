import type { Metadata } from "next";
import { PracticeRoom } from "@/components/practice/PracticeRoom";
import { getTrack } from "@/lib/sat-topics";

export const metadata: Metadata = { title: "Drill" };

export default async function DrillPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; topic?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const track = getTrack(sp.track ?? "");

  const backHref = sp.mode === "exam"
    ? "/dashboard/practice/exam"
    : track
      ? `/dashboard/practice/${track.id}`
      : "/dashboard/practice";
  const backLabel = sp.mode === "exam" ? "Exam lobby" : track ? track.name : "Question Bank";

  let contextLabel = "Warm-up drill";
  if (sp.mode === "exam") contextLabel = "Full Exam";
  else if (sp.mode === "weak") contextLabel = "Weakest topics";
  else if (sp.mode === "all" && track) contextLabel = `All ${track.name} topics`;
  else if (sp.topic && track) {
    const topic = track.domains.flatMap((d) => d.topics).find((t) => t.id === sp.topic);
    if (topic) contextLabel = topic.name;
  }

  return <PracticeRoom backHref={backHref} backLabel={backLabel} contextLabel={contextLabel} />;
}
