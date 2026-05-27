"use client";

import dynamic from "next/dynamic";
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
      <div className="relative z-10 flex min-h-full flex-col">{children}</div>
    </>
  );
}
