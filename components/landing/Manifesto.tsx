import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <section className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="kicker mb-8">The idea</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-4xl leading-[0.95] text-bone sm:text-6xl md:text-7xl">
            Study Club isn&apos;t where
            <br className="hidden sm:block" /> you{" "}
            <span className="text-ash">study</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] text-signal text-glow sm:text-6xl md:text-7xl">
            It&apos;s where you build momentum.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xl text-balance text-lg leading-relaxed text-bone-dim">
            One route. One next move. Evidence you can actually see. No noise, no
            busywork — just the shortest honest path from the score you have to
            the score you want.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
