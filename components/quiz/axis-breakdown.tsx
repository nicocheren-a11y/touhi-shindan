import { AxisOrbitDiagram } from "@/components/quiz/axis-orbit-diagram";
import { getAxisPercent } from "@/lib/axis-percent";
import { DIMENSIONS } from "@/lib/dimensions";
import type { AxisBreakdownItem } from "@/lib/quiz-types";

type AxisBreakdownProps = {
  items: AxisBreakdownItem[];
  showScores: boolean;
};

export function AxisBreakdown({ items, showScores }: AxisBreakdownProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">4つの傾向</h2>
        <p className="mt-1 text-sm text-stone-500">
          あなたの回答から描いた軌道図です。内向ほど中心、外向ほど外周へ。感情は揺らぎ、思考はやや整然な曲線になります。
        </p>
      </div>

      <AxisOrbitDiagram items={items} />

      <ul className="space-y-3">
        {items.map((item) => {
          const dim = DIMENSIONS.find((d) => d.id === item.dimension)!;
          const { chosen, opposite, hasScores } = getAxisPercent(item);
          const total = item.chosenScore + item.oppositeScore;

          return (
            <li
              key={item.dimension}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-stone-500">{dim.questionLabel}</span>
                <span className="font-mono text-lg font-bold tracking-widest text-teal-700">
                  {item.chosen}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-stone-800">
                {item.chosenLabel}
              </p>
              {item.bothCount > 0 ? (
                <p className="mt-2 text-xs text-stone-400">
                  どちらも: {item.bothCount}問（両方の傾向に加算）
                </p>
              ) : null}
              {item.unsureCount > 0 ? (
                <p className="mt-2 text-xs text-stone-400">
                  わからない: {item.unsureCount}問（この軸の判定には含めません）
                </p>
              ) : null}
              {showScores && total > 0 ? (
                <div className="mt-3 space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all"
                      style={{ width: `${chosen}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-400">
                    {item.chosen} {chosen}% / {item.opposite} {opposite}%
                  </p>
                </div>
              ) : showScores && total === 0 && item.unsureCount > 0 ? (
                <p className="mt-2 text-xs text-amber-700">
                  この軸は「わからない」のみのため、参考として先頭の文字を表示しています
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
