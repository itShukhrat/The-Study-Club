import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Today",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <main className="lg:pl-[260px]">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
