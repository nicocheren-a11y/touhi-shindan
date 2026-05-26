import type { DimensionId, PoleLetter } from "./quiz-types";

export type DimensionMeta = {
  id: DimensionId;
  name: string;
  questionLabel: string;
  poles: {
    letter: PoleLetter;
    label: string;
    short: string;
    description: string;
  }[];
};

export const DIMENSIONS: DimensionMeta[] = [
  {
    id: "direction",
    name: "軸①：逃避の方向",
    questionLabel: "① 逃避の方向",
    poles: [
      {
        letter: "I",
        label: "I — Inner（内向逃避）",
        short: "内向",
        description:
          "一人の空間・内側の世界に逃げる。部屋、空想、内省",
      },
      {
        letter: "O",
        label: "O — Outer（外向逃避）",
        short: "外向",
        description:
          "外の刺激・人・場所に逃げる。外出、会話、イベント",
      },
    ],
  },
  {
    id: "method",
    name: "軸②：逃避の方法",
    questionLabel: "② 逃避の方法",
    poles: [
      {
        letter: "A",
        label: "A — Active（能動逃避）",
        short: "能動",
        description:
          "ゲーム、推し活、創作、運動など意志的に現実を忘れる",
      },
      {
        letter: "D",
        label: "D — Drift（漂流逃避）",
        short: "漂流",
        description:
          "無限スクロール、ぼーっとする、気づいたら時間が消える",
      },
    ],
  },
  {
    id: "emotion",
    name: "軸③：感情処理",
    questionLabel: "③ 感情処理",
    poles: [
      {
        letter: "F",
        label: "F — Feel（感情型）",
        short: "感情",
        description:
          "感情を和らげるために逃げる。音楽、物語、安心空間",
      },
      {
        letter: "T",
        label: "T — Think（思考型）",
        short: "思考",
        description:
          "考えすぎを止めるために逃げる。考察、情報収集、作業",
      },
    ],
  },
  {
    id: "recovery",
    name: "軸④：回復スタイル",
    questionLabel: "④ 回復スタイル",
    poles: [
      {
        letter: "R",
        label: "R — Reset（リセット型）",
        short: "リセット",
        description:
          "寝る、消える、連絡を断つ。「ゼロに戻す」回復",
      },
      {
        letter: "S",
        label: "S — Sustain（維持型）",
        short: "維持",
        description:
          "ながら逃避しつつ現実を維持。「壊れないよう分散する」回復",
      },
    ],
  },
];

export function getDimensionMeta(id: DimensionId): DimensionMeta {
  const meta = DIMENSIONS.find((d) => d.id === id);
  if (!meta) throw new Error(`Unknown dimension: ${id}`);
  return meta;
}
