"use client";

import { hasSupabaseEnv, createClient } from "@/lib/supabase/client";
import type { OnboardingData } from "@/lib/onboarding";

/** Pull the signed-in user's profile from Supabase so the app remembers them. */
export async function fetchProfile(): Promise<Partial<OnboardingData> | null> {
  if (!hasSupabaseEnv) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("club_name,target_score,exam_date,fears,struggles,stay")
      .eq("id", user.id)
      .single();
    if (!data) return null;
    return {
      name: data.club_name ?? "",
      email: user.email ?? "",
      targetScore: data.target_score ?? 1400,
      examDate: data.exam_date ?? "",
      fears: data.fears ?? [],
      struggles: data.struggles ?? [],
      stay: data.stay ?? true,
    };
  } catch {
    return null;
  }
}
