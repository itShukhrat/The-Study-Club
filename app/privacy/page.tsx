import type { Metadata } from "next";
import { LegalPage, H2 } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy" updated="June 2026">
      <p>
        Study Club exists to move your score, not to sell your data. This page
        explains, in plain language, what we collect and why.
      </p>

      <H2>What we collect</H2>
      <p>
        The route you build: your target score, exam date, the topics you
        struggle with, and your Study Club name. Your email, used to sign you in
        and keep your progress. The practice you do: answers, scores, streaks,
        and the mistakes we turn into reps.
      </p>

      <H2>Why we collect it</H2>
      <p>
        To draw your personalized route and show honest progress. We do not use
        your work to train models without consent, and we do not sell personal
        information to third parties.
      </p>

      <H2>If you&apos;re under 13</H2>
      <p>
        We require verifiable parental consent before creating an account, in
        line with COPPA. Parents can review or delete their child&apos;s data at
        any time by contacting us.
      </p>

      <H2>Your control</H2>
      <p>
        You can export or delete everything from Profile, or by emailing{" "}
        <a className="text-signal" href="mailto:privacy@studyclub.app">
          privacy@studyclub.app
        </a>
        . Leaving the club removes your account and personal data.
      </p>

      <H2>Cookies & analytics</H2>
      <p>
        We use essential cookies to keep you signed in, and privacy-respecting
        analytics to understand which parts of the route work. You can opt out of
        analytics without losing any functionality.
      </p>
    </LegalPage>
  );
}
