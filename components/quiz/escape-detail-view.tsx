import Link from "next/link";
import { ShareButtons } from "@/components/quiz/share-buttons";
import { getAxisPercent } from "@/lib/axis-percent";
import type { PositiveEscapeAdvice } from "@/lib/positive-escape-advice";
import type { EscapeExplanation } from "@/lib/escape-explanation";
import { DIMENSIONS } from "@/lib/dimensions";
import type { AxisBreakdownItem, ResultProfile } from "@/lib/quiz-types";

type EscapeDetailViewProps = {
  profile: ResultProfile;
  explanation: EscapeExplanation;
  positiveAdvice: PositiveEscapeAdvice;
  breakdown: AxisBreakdownItem[];
};

export function EscapeDetailView({
  profile,
  explanation,
  positiveAdvice,
  breakdown,
}: EscapeDetailViewProps) {
  const percentByDimension = Object.fromEntries(
    breakdown.map((item) => [item.dimension, getAxisPercent(item)]),
  ) as Record<string, ReturnType<typeof getAxisPercent>>;
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-teal-700">詳しい解説</p>
        <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
          あなたの現実逃避のしかた
        </h1>
        <p className="text-stone-600">
          <span className="font-mono font-semibold text-teal-700">
            {profile.code}
          </span>
          {" · "}
          {profile.title}
        </p>
      </div>

      <p className="leading-relaxed text-stone-700">{explanation.summary}</p>

      <div className="space-y-4">
        {explanation.sections.map((section, index) => {
          const dim = DIMENSIONS[index];
          const pct = percentByDimension[dim.id];
          return (
          <section
            key={section.axisLabel}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-teal-700">
                {section.axisLabel}
              </p>
              {pct ? (
                <p className="font-mono text-sm font-semibold text-teal-800">
                  {section.letter} {pct.chosen}%
                  {!pct.hasScores ? (
                    <span className="ml-1 text-xs font-normal text-stone-400">
                      （回答データなし）
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-stone-900">
              {section.title}
            </h2>
            <p className="mt-3 leading-relaxed text-stone-700">{section.body}</p>
            <p className="mt-3 rounded-xl bg-stone-50 px-4 py-3 text-sm leading-relaxed text-stone-600">
              <span className="font-medium text-stone-800">日常では：</span>
              {section.inDailyLife}
            </p>
          </section>
          );
        })}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
        <h2 className="text-lg font-semibold text-stone-900">まとめ</h2>
        <p className="mt-3 leading-relaxed text-stone-700">
          {explanation.synthesis}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
        <h2 className="text-lg font-semibold text-stone-800">
          {positiveAdvice.title}
        </h2>
        <p className="text-sm leading-relaxed text-stone-600">
          {positiveAdvice.intro}
        </p>
        <ul className="space-y-2">
          {positiveAdvice.tips.map((tip) => (
            <li
              key={tip}
              className="flex gap-3 rounded-xl bg-white px-4 py-3 text-sm text-stone-700"
            >
              <span className="mt-0.5 shrink-0 text-teal-600" aria-hidden>
                ◎
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <ShareButtons resultTitle={profile.title} typeCode={profile.code} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/result?code=${profile.code}`}
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-stone-300 bg-white px-6 font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          結果に戻る
        </Link>
        <Link
          href="/quiz"
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-teal-600 px-6 font-medium text-white transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          もう一度診断する
        </Link>
      </div>

      <p className="text-center text-xs text-stone-400">
        ※ この解説は自己理解のための参考です。医療・心理の専門的な診断ではありません。
      </p>
    </div>
  );
}
