import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ResultClient } from "@/components/quiz/result-client";
import { RESULT_PROFILES } from "@/lib/result-profiles";
import { isTypeCode } from "@/lib/scoring";

type ResultPageProps = {
  searchParams: Promise<{ code?: string }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const { code: rawCode } = await searchParams;
  const code = rawCode?.toUpperCase();

  if (!code || !isTypeCode(code)) {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-xl font-semibold text-stone-800">
            結果が見つかりません
          </h1>
          <p className="text-stone-600">
            診断を完了してから、このページを開いてください。
          </p>
          <Link
            href="/quiz"
            className="rounded-full bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700"
          >
            診断をはじめる
          </Link>
        </div>
      </PageShell>
    );
  }

  const profile = RESULT_PROFILES[code];

  return (
    <PageShell maxWidth="lg">
      <ResultClient profile={profile} />
    </PageShell>
  );
}
