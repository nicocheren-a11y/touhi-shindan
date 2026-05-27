import Link from "next/link";
import type { ReactNode } from "react";

/** 全ページ共通の最小幅 + ビューポート比例（md / lg） */
const CONTENT_WIDTH_CLASS = "w-full max-w-[clamp(28rem,62vw,56rem)]";
const WIDE_WIDTH_CLASS = "w-full max-w-[clamp(28rem,72vw,60rem)]";

type PageShellProps = {
  children: ReactNode;
  maxWidth?: "md" | "lg";
  /** トップの開始画面 — カードを薄くして背景の軌道を見せる */
  variant?: "default" | "landing";
};

export function PageShell({
  children,
  maxWidth = "md",
  variant = "default",
}: PageShellProps) {
  const isLanding = variant === "landing";
  const widthClass =
    isLanding || maxWidth === "md"
      ? CONTENT_WIDTH_CLASS
      : WIDE_WIDTH_CLASS;

  const outerCard = isLanding
    ? "rounded-3xl border border-white/25 bg-white/20 p-1 shadow-sm shadow-stone-300/20 backdrop-blur-[1px] sm:p-2"
    : "rounded-3xl border border-white/40 bg-white/40 p-1 shadow-sm shadow-stone-300/30 backdrop-blur-[2px] sm:p-2";
  const innerCard = isLanding
    ? "rounded-[1.35rem] bg-white/30 px-6 py-10 backdrop-blur-[0px] sm:px-10 sm:py-14 md:px-14"
    : "rounded-[1.35rem] bg-white/50 px-6 py-8 backdrop-blur-[1px] sm:px-8 sm:py-10 md:px-10";

  return (
    <div className="min-h-full">
      <div
        className={`mx-auto flex min-h-full w-full flex-col px-5 py-10 sm:px-6 sm:py-14 ${widthClass}`}
      >
        <div className={outerCard}>
          <div className={innerCard}>
            {!isLanding && (
              <div className="mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors"
                >
                  ← トップに戻る
                </Link>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
