import type { Metadata } from "next";
import { LegalPage, H2 } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="June 2026">
      <p>
        By entering Study Club, you agree to these terms. They&apos;re short on
        purpose.
      </p>

      <H2>The deal</H2>
      <p>
        We give you the tools, the route, and honest feedback. You bring the
        reps. Study Club helps you prepare — it doesn&apos;t guarantee a specific
        score. The work does that.
      </p>

      <H2>Your account</H2>
      <p>
        Keep your login yours. You&apos;re responsible for activity on your
        account. One human, one account — no sharing logins to dodge limits.
      </p>

      <H2>The content</H2>
      <p>
        Lessons, questions, and explanations are for your personal preparation.
        Don&apos;t scrape, resell, or redistribute them. Official test material
        belongs to its respective owners and is used for practice only.
      </p>

      <H2>Your data</H2>
      <p>
        To build your route we collect your registration answers, your practice, and
        — only if you accept cookies — usage like pageviews, click heatmaps, and a
        coarse location. We use this solely to assess your level and serve the right
        material and tests. We never sell it or use it for anything illegal. Full
        detail is in the{" "}
        <a className="text-signal" href="/privacy">Privacy Policy</a>.
      </p>

      <H2>The house rules</H2>
      <p>
        Show up. Study the miss. Protect the streak. Beyond the spirit of the
        club, don&apos;t abuse the platform, other members, or the leaderboard.
        We can suspend accounts that do.
      </p>

      <H2>Changes & contact</H2>
      <p>
        We may update these terms as Study Club grows; we&apos;ll flag anything
        material. Questions go to{" "}
        <a className="text-signal" href="mailto:contact@StudyClub.uz">
          contact@StudyClub.uz
        </a>
        .
      </p>
    </LegalPage>
  );
}
