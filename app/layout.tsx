import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Study Club — Momentum, not memorization.",
    template: "%s · Study Club",
  },
  description:
    "You know your score. You know your goal. The distance between them is your route. Study Club is where students build momentum for the SAT.",
  applicationName: "Study Club",
  openGraph: {
    title: "Study Club",
    description: "Momentum, not memorization. The SAT route for serious students.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Study Club" },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}
    >
      <body className="grain vignette min-h-dvh bg-ink text-bone selection:bg-signal">
        {children}
      </body>
    </html>
  );
}
