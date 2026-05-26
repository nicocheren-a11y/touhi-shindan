export type DimensionId = "direction" | "method" | "emotion" | "recovery";

export type DirectionPole = "I" | "O";
export type MethodPole = "A" | "D";
export type EmotionPole = "F" | "T";
export type RecoveryPole = "R" | "S";

export type PoleLetter =
  | DirectionPole
  | MethodPole
  | EmotionPole
  | RecoveryPole;

export type TypeCode =
  | "IAFR" | "IAFS" | "IATR" | "IATS"
  | "IDFR" | "IDFS" | "IDTR" | "IDTS"
  | "OAFR" | "OAFS" | "OATR" | "OATS"
  | "ODFR" | "ODFS" | "ODTR" | "ODTS";

export type PoleWeight = {
  pole: PoleLetter;
  points: number;
};

/** 1つの回答で複数の軸に加点する（質問13など） */
export type AxisWeight = {
  dimension: DimensionId;
  pole: PoleLetter;
  points: number;
};

export type AnswerOption = {
  id: string;
  label: string;
  pole: PoleLetter | null;
  both?: boolean;
  weights?: PoleWeight[];
  axisWeights?: AxisWeight[];
  /** 逃避後の感覚がはっきりしない（感情軸へは加算する） */
  ambiguousOutcome?: boolean;
};

export type Question = {
  id: string;
  dimension: DimensionId;
  text: string;
  options: AnswerOption[];
  /** グラデーション設問用：選択肢の並びが意味を持つとき */
  scaleHint?: { from: string; to: string };
};

export type AnswerSelection = {
  dimension: DimensionId;
  pole: PoleLetter | null;
  isBoth?: boolean;
  weights?: PoleWeight[];
  axisWeights?: AxisWeight[];
  ambiguousOutcome?: boolean;
};

export type ResultProfile = {
  code: TypeCode;
  title: string;
  tagline: string;
  description: string;
  hints: string[];
};

export type AxisBreakdownItem = {
  dimension: DimensionId;
  chosen: PoleLetter;
  chosenLabel: string;
  opposite: PoleLetter;
  oppositeLabel: string;
  chosenScore: number;
  oppositeScore: number;
  unsureCount: number;
  bothCount: number;
};
