import type { AxisBreakdownItem, DimensionId, PoleLetter } from "./quiz-types";

export type AxisPercent = {
  chosen: number;
  opposite: number;
  hasScores: boolean;
};

export function getAxisPercent(item: AxisBreakdownItem): AxisPercent {
  const total = item.chosenScore + item.oppositeScore;
  if (total <= 0) {
    return { chosen: 50, opposite: 50, hasScores: false };
  }
  const chosen = Math.round((item.chosenScore / total) * 100);
  return { chosen, opposite: 100 - chosen, hasScores: true };
}

/** 特定の極への寄り（0〜1）。スコアが無いときは選ばれた極を 0.65 とする */
export function poleLean(
  item: AxisBreakdownItem,
  pole: PoleLetter,
): number {
  const { chosen, hasScores } = getAxisPercent(item);
  const lean = item.chosen === pole ? chosen / 100 : (100 - chosen) / 100;
  if (hasScores) return lean;
  return item.chosen === pole ? 0.65 : 0.35;
}

export function findBreakdownItem(
  items: AxisBreakdownItem[],
  dimension: DimensionId,
): AxisBreakdownItem {
  const item = items.find((i) => i.dimension === dimension);
  if (!item) throw new Error(`Missing breakdown for ${dimension}`);
  return item;
}
