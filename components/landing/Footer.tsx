import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo size={28} animated={false} />
          <p className="mt-5 text-sm leading-relaxed text-ash">
            The SAT route for serious students. Momentum, not memorization.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Product"
            links={[
              ["The Route", "#route"],
              ["The Rules", "#rules"],
              ["What's Next", "#next"],
              ["Enter", "/enter"],
            ]}
          />
          <FooterCol
            title="Soon"
            links={[
              ["University", "#next"],
              ["Scholarships", "#next"],
              ["Essays", "#next"],
              ["ACT / AP", "#next"],
            ]}
          />
          <FooterCol
            title="Club"
            links={[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "mailto:contact@StudyClub.uz"],
            ]}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-center sm:flex-row sm:text-left">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash-2">
          © {new Date().getFullYear()} Study Club
        </p>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash-2">
          Progress remembers everything.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="kicker mb-4 text-[0.62rem]">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-bone-dim transition-colors hover:text-bone"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
