import { findBreakdownItem, poleLean } from "./axis-percent";
import type { OrbitVisualParams } from "./orbit-path";
import type { AxisBreakdownItem } from "./quiz-types";

export function breakdownToOrbitParams(
  items: AxisBreakdownItem[],
): OrbitVisualParams {
  const direction = findBreakdownItem(items, "direction");
  const method = findBreakdownItem(items, "method");
  const emotion = findBreakdownItem(items, "emotion");
  const recovery = findBreakdownItem(items, "recovery");

  return {
    outward: poleLean(direction, "O"),
    drift: poleLean(method, "D"),
    wavy: poleLean(emotion, "F"),
    resetPull: poleLean(recovery, "R"),
  };
}
