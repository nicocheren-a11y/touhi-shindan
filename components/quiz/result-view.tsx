import Link from "next/link";
import { ShareButtons } from "@/components/quiz/share-buttons";
import { AxisBreakdown } from "@/components/quiz/axis-breakdown";
import type { AxisBreakdownItem, ResultProfile } from "@/lib/quiz-types";

type ResultViewProps = {
  profile: ResultProfile;
  breakdown: AxisBreakdownItem[];
  showScores: boolean;
  lowConfidence?: boolean;
};

export function ResultView({
  profile,
  breakdown,
  showScores,
  lowConfidence = false,
}: ResultViewProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-teal-700">あなたのタイプ</p>
        <p
          className="font-mono text-4xl font-bold tracking-[0.35em] text-teal-700 sm:text-5xl"
          aria-label={`タイプコード ${profile.code}`}
        >
          {profile.code}
        </p>
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          {profile.title}
        </h1>
        <p className="text-lg text-stone-600">{profile.tagline}</p>
      </div>

      {lowConfidence ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          「わからない」の回答が多い軸があります。結果は参考値として見て、もう一度診断してみるのもおすすめです。
        </p>
      ) : null}

      <AxisBreakdown items={breakdown} showScores={showScores} />

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="leading-relaxed text-stone-700">{profile.description}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-800">
          今日から試せるヒント
        </h2>
        <ul className="space-y-2">
          {profile.hints.map((hint) => (
            <li
              key={hint}
              className="flex gap-3 rounded-xl bg-teal-50 px-4 py-3 text-stone-700"
            >
              <span className="mt-0.5 shrink-0 text-teal-600" aria-hidden>
                ✓
              </span>
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/result/detail?code=${profile.code}`}
        className="flex h-12 w-full items-center justify-center rounded-full border-2 border-teal-600 bg-white px-6 font-medium text-teal-800 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        現実逃避パターンの詳しい解説を見る
      </Link>

      <ShareButtons resultTitle={profile.title} typeCode={profile.code} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/quiz"
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-teal-600 px-6 font-medium text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          もう一度診断する
        </Link>
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-stone-300 bg-white px-6 font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          トップへ戻る
        </Link>
      </div>

      <p className="text-center text-xs text-stone-400">
        ※ この診断は自己理解のための参考です。医療・心理の専門的な診断ではありません。
      </p>
    </div>
  );
}
