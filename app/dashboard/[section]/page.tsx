import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionStub } from "@/components/dashboard/SectionStub";
import { SECTION_COPY } from "@/components/dashboard/nav-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const copy = SECTION_COPY[section];
  return { title: copy ? copy.title : "Study Club" };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const copy = SECTION_COPY[section];
  if (!copy) notFound();
  return <SectionStub title={copy.title} line={copy.line} status={copy.status} />;
}
