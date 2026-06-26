import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Enter the Club",
  description: "Build your SAT route in about ninety seconds.",
};

export default async function EnterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return <OnboardingFlow next={sp.next ?? "/dashboard"} />;
}
