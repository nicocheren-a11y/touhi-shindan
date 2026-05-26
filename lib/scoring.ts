import { DIMENSIONS } from "./dimensions";
import type {
  AnswerSelection,
  AxisBreakdownItem,
  DimensionId,
  PoleLetter,
  TypeCode,
} from "./quiz-types";

const TYPE_CODE_ORDER: TypeCode[] = [
  "IAFR", "IAFS", "IATR", "IATS",
  "IDFR", "IDFS", "IDTR", "IDTS",
  "OAFR", "OAFS", "OATR", "OATS",
  "ODFR", "ODFS", "ODTR", "ODTS",
];

const QUESTIONS_PER_AXIS = 4;

export function isTypeCode(value: string): value is TypeCode {
  return TYPE_CODE_ORDER.includes(value.toUpperCase() as TypeCode);
}

function initScores(): Record<DimensionId, Record<string, number>> {
  const scores = {} as Record<DimensionId, Record<string, number>>;
  for (const dim of DIMENSIONS) {
    scores[dim.id] = {};
    for (const pole of dim.poles) {
      scores[dim.id][pole.letter] = 0;
    }
  }
  return scores;
}

function applyAnswer(
  scores: Record<DimensionId, Record<string, number>>,
  answer: AnswerSelection,
): void {
  const { dimension, pole, isBoth, weights, axisWeights } = answer;

  if (axisWeights?.length) {
    for (const { dimension: dimId, pole: wPole, points } of axisWeights) {
      scores[dimId][wPole] = (scores[dimId][wPole] ?? 0) + points;
    }
    return;
  }

  if (weights?.length) {
    for (const { pole: wPole, points } of weights) {
      scores[dimension][wPole] = (scores[dimension][wPole] ?? 0) + points;
    }
    return;
  }

  if (isBoth) {
    const dim = DIMENSIONS.find((d) => d.id === dimension)!;
    for (const p of dim.poles) {
      scores[dimension][p.letter] = (scores[dimension][p.letter] ?? 0) + 1;
    }
    return;
  }

  if (pole === null) return;
  scores[dimension][pole] = (scores[dimension][pole] ?? 0) + 1;
}

function countByDimension(
  answers: AnswerSelection[],
  predicate: (answer: AnswerSelection) => boolean,
): Record<DimensionId, number> {
  const counts = {} as Record<DimensionId, number>;
  for (const dim of DIMENSIONS) {
    counts[dim.id] = 0;
  }
  for (const answer of answers) {
    if (predicate(answer)) {
      counts[answer.dimension] += 1;
    }
  }
  return counts;
}

function isUnsureAnswer(answer: AnswerSelection): boolean {
  return (
    answer.pole === null &&
    !answer.isBoth &&
    !answer.ambiguousOutcome &&
    !answer.weights?.length &&
    !answer.axisWeights?.length
  );
}

export function hadAmbiguousEscapeOutcome(
  answers: AnswerSelection[],
): boolean {
  return answers.some((a) => a.ambiguousOutcome);
}

function resolveAxisLetter(
  dimId: DimensionId,
  scores: Record<DimensionId, Record<string, number>>,
): PoleLetter {
  const dim = DIMENSIONS.find((d) => d.id === dimId)!;
  const [first, second] = dim.poles;
  const firstScore = scores[dimId][first.letter] ?? 0;
  const secondScore = scores[dimId][second.letter] ?? 0;
  return (firstScore >= secondScore ? first.letter : second.letter) as PoleLetter;
}

export function calculateTypeCode(answers: AnswerSelection[]): TypeCode {
  const scores = initScores();

  for (const answer of answers) {
    applyAnswer(scores, answer);
  }

  const letters = DIMENSIONS.map((dim) => resolveAxisLetter(dim.id, scores));
  return letters.join("") as TypeCode;
}

export function breakdownFromCode(code: TypeCode): AxisBreakdownItem[] {
  const letters = code.split("") as PoleLetter[];

  return DIMENSIONS.map((dim, index) => {
    const chosen = letters[index];
    const chosenMeta = dim.poles.find((p) => p.letter === chosen)!;
    const oppositeMeta = dim.poles.find((p) => p.letter !== chosen)!;

    return {
      dimension: dim.id,
      chosen,
      chosenLabel: chosenMeta.label,
      opposite: oppositeMeta.letter as PoleLetter,
      oppositeLabel: oppositeMeta.label,
      chosenScore: 0,
      oppositeScore: 0,
      unsureCount: 0,
      bothCount: 0,
    };
  });
}

export function buildAxisBreakdown(
  answers: AnswerSelection[],
): AxisBreakdownItem[] {
  const scores = initScores();
  const unsureCounts = countByDimension(answers, isUnsureAnswer);
  const bothCounts = countByDimension(answers, (a) => !!a.isBoth);

  for (const answer of answers) {
    applyAnswer(scores, answer);
  }

  return DIMENSIONS.map((dim) => {
    const [first, second] = dim.poles;
    const firstScore = scores[dim.id][first.letter] ?? 0;
    const secondScore = scores[dim.id][second.letter] ?? 0;
    const chosen = resolveAxisLetter(dim.id, scores);
    const opposite =
      chosen === first.letter ? second.letter : first.letter;
    const chosenMeta = dim.poles.find((p) => p.letter === chosen)!;
    const oppositeMeta = dim.poles.find((p) => p.letter === opposite)!;

    return {
      dimension: dim.id,
      chosen,
      chosenLabel: chosenMeta.label,
      opposite: opposite as PoleLetter,
      oppositeLabel: oppositeMeta.label,
      chosenScore: chosen === first.letter ? firstScore : secondScore,
      oppositeScore: chosen === first.letter ? secondScore : firstScore,
      unsureCount: unsureCounts[dim.id],
      bothCount: bothCounts[dim.id],
    };
  });
}

export function hasLowConfidenceAxis(breakdown: AxisBreakdownItem[]): boolean {
  return breakdown.some(
    (item) =>
      item.unsureCount >= 2 ||
      (item.chosenScore === 0 && item.oppositeScore === 0),
  );
}

export { QUESTIONS_PER_AXIS };
