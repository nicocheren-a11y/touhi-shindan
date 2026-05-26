import type {
  AnswerOption,
  AxisWeight,
  PoleLetter,
  PoleWeight,
} from "./quiz-types";

export const UNSURE_LABEL = "わからない・どちらとも言えない";
export const UNSURE_SIMPLE_LABEL = "わからない";
export const BOTH_LABEL = "どちらも当てはまる";
export const NEITHER_OUTCOME_LABEL =
  "どちらともいえない（すっきりもほっともしない）";

export function choice(
  questionId: string,
  side: string,
  label: string,
  pole: PoleLetter,
): AnswerOption {
  return { id: `${questionId}-${side}`, label, pole };
}

function unsureOption(
  questionId: string,
  label: string = UNSURE_LABEL,
): AnswerOption {
  return { id: `${questionId}-u`, label, pole: null };
}

export function choices(
  questionId: string,
  a: { label: string; pole: PoleLetter },
  b: { label: string; pole: PoleLetter },
): AnswerOption[] {
  return [
    choice(questionId, "a", a.label, a.pole),
    choice(questionId, "b", b.label, b.pole),
    unsureOption(questionId),
  ];
}

export function multiAxisChoice(
  questionId: string,
  side: string,
  label: string,
  axisWeights: AxisWeight[],
): AnswerOption {
  return {
    id: `${questionId}-${side}`,
    label,
    pole: null,
    axisWeights,
  };
}

/** 休日の過ごし方（質問13）：両極＋中間2つ（複数軸に加点） */
export function recoveryRestChoices(
  questionId: string,
  options: {
    extremeReset: { label: string; axisWeights: AxisWeight[] };
    middleInnerActive: { label: string; axisWeights: AxisWeight[] };
    middleOuterDrift: { label: string; axisWeights: AxisWeight[] };
    extremeSustain: { label: string; axisWeights: AxisWeight[] };
  },
): AnswerOption[] {
  return [
    multiAxisChoice(questionId, "a", options.extremeReset.label, options.extremeReset.axisWeights),
    multiAxisChoice(questionId, "b", options.middleInnerActive.label, options.middleInnerActive.axisWeights),
    multiAxisChoice(questionId, "c", options.middleOuterDrift.label, options.middleOuterDrift.axisWeights),
    multiAxisChoice(questionId, "d", options.extremeSustain.label, options.extremeSustain.axisWeights),
    unsureOption(questionId),
  ];
}

/** 逃避後の感覚（質問10）：F / T / どちらともいえない（加算あり） */
export function emotionAfterOutcomeChoices(
  questionId: string,
  f: { label: string },
  t: { label: string },
): AnswerOption[] {
  return [
    choice(questionId, "f", f.label, "F"),
    choice(questionId, "t", t.label, "T"),
    {
      id: `${questionId}-neither`,
      label: `${NEITHER_OUTCOME_LABEL}・ただ時間が過ぎた`,
      pole: null,
      ambiguousOutcome: true,
      weights: [
        { pole: "F", points: 1 },
        { pole: "T", points: 1 },
      ],
    },
    unsureOption(questionId, UNSURE_SIMPLE_LABEL),
  ];
}

/** 状況によって両方ありうる質問用（どちらも＋わからない） */
export function choicesWithBoth(
  questionId: string,
  a: { label: string; pole: PoleLetter },
  b: { label: string; pole: PoleLetter },
): AnswerOption[] {
  return [
    choice(questionId, "a", a.label, a.pole),
    choice(questionId, "b", b.label, b.pole),
    { id: `${questionId}-both`, label: BOTH_LABEL, pole: null, both: true },
    unsureOption(questionId),
  ];
}

/** 軸上のグラデーション（上から能動側→漂流側など） */
export function gradientChoices(
  questionId: string,
  steps: { label: string; weights: PoleWeight[] }[],
): AnswerOption[] {
  return [
    ...steps.map((step, index) => ({
      id: `${questionId}-${index + 1}`,
      label: step.label,
      pole: null,
      weights: step.weights,
    })),
    unsureOption(questionId),
  ];
}
