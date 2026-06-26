import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { MottoMarquee } from "@/components/landing/MottoMarquee";
import { Manifesto } from "@/components/landing/Manifesto";
import { RouteSection } from "@/components/landing/RouteSection";
import { RulesSection } from "@/components/landing/RulesSection";
import { FutureChapters } from "@/components/landing/FutureChapters";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <MottoMarquee />
      <Manifesto />
      <RouteSection />
      <RulesSection />
      <FutureChapters />
      <FinalCTA />
      <Footer />
    </main>
  );
}
