import Link from "next/link";
import { AxisOverviewGrid } from "@/components/home/axis-overview-grid";
import { TypeListSection } from "@/components/home/type-list-section";
import { PageShell } from "@/components/layout/page-shell";

export default function IntroPage() {
  return (
    <PageShell maxWidth="lg">
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div className="space-y-4 text-center sm:text-left">
          <p className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
            全16問・約3分・16タイプ
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            逃避診断について
          </h1>
          <p className="text-lg leading-relaxed text-stone-600">
            4つの軸（I/O · A/D · F/T · R/S）から、あなたの「逃げ方」を4文字と16タイプで診断します。
            正解はありません。いまの自分に近いほうを選んでください。
          </p>
        </div>

        <AxisOverviewGrid />

        <TypeListSection />

        <Link
          href="/quiz"
          className="flex h-14 w-full items-center justify-center rounded-full bg-teal-600 text-lg font-semibold text-white shadow-md transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.99]"
        >
          診断をはじめる
        </Link>

        <p className="text-center text-xs text-stone-400 sm:text-left">
          ※ 娯楽・自己理解のためのコンテンツです
        </p>
      </div>
    </PageShell>
  );
}
