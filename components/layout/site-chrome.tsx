"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { ReactNode } from "react";

const DriftOrbitBackground = dynamic(
  () =>
    import("@/components/visuals/drift-orbit-background").then(
      (mod) => mod.DriftOrbitBackground,
    ),
  { ssr: false },
);

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <>
      <DriftOrbitBackground />
      <div className="relative z-10 flex min-h-full flex-col">
        <header className="flex justify-center py-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-wide text-stone-700 hover:text-stone-900 transition-colors"
          >
            逃避診断
          </Link>
        </header>
        {children}
      </div>
    </>
  );
}
