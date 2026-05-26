import type { EmotionPole, TypeCode } from "./quiz-types";

export type PositiveEscapeAdvice = {
  title: string;
  intro: string;
  tips: string[];
};

export function getPositiveEscapeAdvice(
  code: TypeCode,
  afterEscapeWasAmbiguous: boolean,
): PositiveEscapeAdvice {
  const emotion = code[2] as EmotionPole;

  const feelTips = [
    "短い音楽や物語を「終わり」まで決めて聴く・読む（切り替えタイマー付き）",
    "ぬいぐるみや毛布など、安心できる感触に意識を向ける",
    "感情に名前をつけてから、5分だけ紙に書く",
  ];

  const thinkTips = [
    "調べ物は「3項目まで」と決め、メモを閉じたら手を止める",
    "考えを1行にまとめたら、小さな行動を1つだけ試す",
    "情報入力のあと、5分だけ歩く・水を飲むなど身体を動かす",
  ];

  const intro = afterEscapeWasAmbiguous
    ? "逃避のあと、すっきりしにくいこともあります。タイプに合いやすい「少し楽になる逃げ方」を試してみてください。"
    : "あなたのタイプでは、次のような逃げ方が心や頭を整えやすい傾向があります。";

  if (emotion === "F") {
    return {
      title: "心が少し楽になる逃げ方",
      intro,
      tips: [
        ...feelTips,
        "（参考）頭がごちゃつく日は、短い散歩で思考を一度止めるのも有効です",
      ],
    };
  }

  return {
    title: "頭が少し楽になる逃げ方",
    intro,
    tips: [
      ...thinkTips,
      "（参考）気持ちが重い日は、短い音楽で感情を先にほぐすのも有効です",
    ],
  };
}
