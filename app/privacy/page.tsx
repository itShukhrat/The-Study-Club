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
        <strong>Your route &amp; survey answers.</strong> During registration you
        tell us your target score, exam date, what scares you, and the topics you
        struggle with. We keep those answers so we can assess your level and serve
        the right material and tests — that&apos;s the whole point of asking.
      </p>
      <p>
        <strong>Account.</strong> Your email and Study Club name, used to sign you
        in, verify you, and keep your progress.
      </p>
      <p>
        <strong>Your practice.</strong> Answers, scores, streaks, and the mistakes
        we turn into reps.
      </p>
      <p>
        <strong>Usage, with your consent.</strong> If you accept cookies, we record
        which pages you visit, how far you scroll, and where you tap (aggregated into
        anonymous heatmaps), plus a coarse location (country/region/city) derived from
        your IP. We store a <em>salted hash</em> of your IP — never the raw address.
        Decline, and we collect none of this.
      </p>

      <H2>Why we collect it — and what we&apos;ll never do</H2>
      <p>
        Every piece of this exists for one reason: to figure out where you stand and
        give you the proper material, drills, and tests to move your score. We use it
        to improve the product and your route.
      </p>
      <p>
        We do <strong>not</strong> sell your personal information. We do <strong>not</strong>{" "}
        share it for advertising, and we do <strong>not</strong> use it for anything
        illegal or deceptive. We don&apos;t track you across other websites.
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
        <a className="text-signal" href="mailto:contact@StudyClub.uz">
          contact@StudyClub.uz
        </a>
        . Leaving the club removes your account and personal data.
      </p>

      <H2>Cookies & analytics</H2>
      <p>
        Essential cookies keep you signed in. Optional analytics cookies — which you
        approve in the banner on your first visit — power our own privacy-respecting
        analytics: pageviews, scroll depth, click heatmaps, and coarse location.
        You can decline or change your mind anytime without losing any functionality.
      </p>
      <p>
        Email (verification, password resets, changes) is sent through our processor
        Resend; accounts and data are stored with Supabase. Both act on our behalf
        under their own security commitments.
      </p>
    </LegalPage>
  );
}
