"use client";

import dynamic    from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(
  () => import("@/components/animations/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent rounded-3xl animate-pulse" />
    ),
  }
);

export function HeroSceneWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full h-full bg-gradient-to-br from-[var(--color-bid-500)]/10 to-transparent rounded-3xl animate-pulse" />
    }>
      <HeroScene />
    </Suspense>
  );
}
