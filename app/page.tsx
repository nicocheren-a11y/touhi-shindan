import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default function Home() {
  return (
    <PageShell variant="landing">
      <div className="flex min-h-[min(70vh,32rem)] flex-col items-center justify-center gap-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          逃避診断
        </h1>

        <Link
          href="/intro"
          className="flex h-14 w-full items-center justify-center rounded-full bg-teal-600 text-lg font-semibold text-white shadow-md transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.99] sm:h-16 sm:text-xl"
        >
          逃避診断を始める
        </Link>

        <p className="text-xs text-stone-500">
          ※ 娯楽・自己理解のためのコンテンツです
        </p>
      </div>
    </PageShell>
  );
}
