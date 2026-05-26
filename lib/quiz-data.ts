import {
  choices,
  choicesWithBoth,
  emotionAfterOutcomeChoices,
  gradientChoices,
  recoveryRestChoices,
} from "./quiz-options";
import type { Question } from "./quiz-types";

export const QUESTIONS: Question[] = [
  // direction (I / O) — 場所・人との距離・エネルギーの向き
  {
    id: "d1",
    dimension: "direction",
    text: "しんどいときに連絡が来たら、まず向かいたい方向は？",
    options: choices(
      "d1",
      {
        label:
          "まず一人の時間（返信はあと回し・部屋で静かにする・ひとりで落ち着く）",
        pole: "I",
      },
      {
        label:
          "まず外や人のほう（その場で返信する・誰かと話す・出かけて切り替える）",
        pole: "O",
      },
    ),
  },
  {
    id: "d2",
    dimension: "direction",
    text: "急にしんどくなったとき、体が先に動くのは？",
    options: choicesWithBoth(
      "d2",
      { label: "部屋に入る・布団・自分だけの空間", pole: "I" },
      { label: "散歩・コンビニ・誰かのところへ向かう", pole: "O" },
    ),
  },
  {
    id: "d3",
    dimension: "direction",
    text: "「自分のペースに戻れた」と感じるのは？",
    options: choices(
      "d3",
      { label: "誰にも見られず、内側だけが静かなとき", pole: "I" },
      { label: "外の刺激や人の温度で気分が動いたとき", pole: "O" },
    ),
  },
  {
    id: "d4",
    dimension: "direction",
    text: "本音をごまかしたあと、安心できる場所は？",
    options: choicesWithBoth(
      "d4",
      { label: "日記・別アカウント・空想など内側だけの世界", pole: "I" },
      { label: "軽い雑談・イベント・人混みの中", pole: "O" },
    ),
  },
  // method (A / D) — 始め方・コントロール・説明の仕方
  {
    id: "m1",
    dimension: "method",
    text: "時間が2〜3時間溶けたとき、始まり方は？",
    options: choices(
      "m1",
      { label: "「これをする」と決めてから始めた", pole: "A" },
      { label: "何となく手が動いて、気づいたら終わっていた", pole: "D" },
    ),
  },
  {
    id: "m2",
    dimension: "method",
    text: "没頭やスクロールの「やめ時」に、いちばん近いのは？",
    scaleHint: { from: "自分で区切れる", to: "流されてしまう" },
    options: gradientChoices("m2", [
      {
        label: "区切りを決めていて、だいたい止められる",
        weights: [{ pole: "A", points: 2 }],
      },
      {
        label: "ふと「やめよう」と思って、いきなり止められる",
        weights: [
          { pole: "A", points: 1 },
          { pole: "D", points: 1 },
        ],
      },
      {
        label: "止めようと思っていたら、もう時間が経っていた",
        weights: [
          { pole: "A", points: 1 },
          { pole: "D", points: 2 },
        ],
      },
      {
        label: "止めようとも思わない（気づいたら終わっている）",
        weights: [{ pole: "D", points: 2 }],
      },
    ]),
  },
  {
    id: "m3",
    dimension: "method",
    text: "自分が現実逃避しているとき、うまく言葉にするなら？",
    options: choices(
      "m3",
      { label: "ゲーム・推し活・創作など、自分で選んでいる", pole: "A" },
      { label: "ぼーっとした・寝た・なんとなくスマホ", pole: "D" },
    ),
  },
  {
    id: "m4",
    dimension: "method",
    text: "一日の終わり、しんどさをごまかすためにいちばんやりがちなのは？",
    options: choices(
      "m4",
      {
        label: "「これをする」と決めて、運動・推し活・買い物などに切り替える",
        pole: "A",
      },
      {
        label: "何も決めず、スマホを見続ける・ぼーっとする・寝落ちする",
        pole: "D",
      },
    ),
  },
  // emotion (F / T) — きっかけ・残る感覚・夜の思考
  {
    id: "e1",
    dimension: "emotion",
    text: "逃避が始まりやすい「きっかけ」に近いのは？",
    options: choices(
      "e1",
      { label: "言葉や態度で傷ついた・寂しさがこみ上げる", pole: "F" },
      { label: "決められない・失敗が想像できる・頭がフル回転", pole: "T" },
    ),
  },
  {
    id: "e2",
    dimension: "emotion",
    text: "逃避がひと段落したあと、いちばん近い感覚は？",
    options: emotionAfterOutcomeChoices(
      "e2",
      { label: "ほっとした・涙が出た・心が少し温かくなった" },
      { label: "頭がすっきりした・整理できた・納得した" },
    ),
  },
  {
    id: "e3",
    dimension: "emotion",
    text: "逃避で、いちばん遠ざけたくなることに近いのは？",
    options: choices(
      "e3",
      {
        label: "自分の気持ちをはっきり感じる・認めること",
        pole: "F",
      },
      {
        label: "決めてしまう・選ぶ・「どうするか」を確定させること",
        pole: "T",
      },
    ),
  },
  {
    id: "e4",
    dimension: "emotion",
    text: "眠れない夜、頭の中で繰り返すのは？",
    options: choicesWithBoth(
      "e4",
      { label: "あの人の言葉・関係・自分の気持ち", pole: "F" },
      { label: "手順・選択肢・これからどうするかのリスト", pole: "T" },
    ),
  },
  // recovery (R / S) — 休み方・サボり方・復帰のしかた
  {
    id: "r1",
    dimension: "recovery",
    text: "休日で本当に休みたいとき、いちばん近い過ごし方は？",
    scaleHint: { from: "ゼロに戻す", to: "壊れず維持する" },
    options: recoveryRestChoices("r1", {
      extremeReset: {
        label:
          "人間モードOFF：連絡遮断・予定キャンセル・布団からほぼ出ない。やることは全部止める",
        axisWeights: [
          { dimension: "recovery", pole: "R", points: 2 },
          { dimension: "direction", pole: "I", points: 2 },
        ],
      },
      middleInnerActive: {
        label:
          "一人の部屋で、ゲーム・創作・推し活など自分で選んだ没頭で休む（連絡は後回し）",
        axisWeights: [
          { dimension: "recovery", pole: "R", points: 1 },
          { dimension: "direction", pole: "I", points: 2 },
          { dimension: "method", pole: "A", points: 2 },
          { dimension: "emotion", pole: "F", points: 1 },
        ],
      },
      middleOuterDrift: {
        label:
          "カフェや散歩など外にいて、ぼーっとしたりスマホを見て時間が過ぎる（予定は軽め）",
        axisWeights: [
          { dimension: "recovery", pole: "S", points: 1 },
          { dimension: "direction", pole: "O", points: 2 },
          { dimension: "method", pole: "D", points: 2 },
        ],
      },
      extremeSustain: {
        label:
          "表は普段通り：予定・返信・家事までこなす。周りからは普通の休日に見える",
        axisWeights: [
          { dimension: "recovery", pole: "S", points: 2 },
          { dimension: "direction", pole: "O", points: 1 },
          { dimension: "method", pole: "A", points: 1 },
        ],
      },
    }),
  },
  {
    id: "r2",
    dimension: "recovery",
    text: "仕事や学校のことがしんどくて、サボりたくなったとき、実際にやりがちなのは？",
    options: choices(
      "r2",
      {
        label:
          "有休・欠席などで休み、課題や仕事はその間まるごと手をつけない",
        pole: "R",
      },
      {
        label:
          "出勤・登校はする（オンライン参加も）が、手を抜く・締切直前だけ動く",
        pole: "S",
      },
    ),
  },
  {
    id: "r3",
    dimension: "recovery",
    text: "SNSやメッセージがしんどいときの対処は？",
    options: choices(
      "r3",
      { label: "アカウントを消す・通知オフ・完全に切る", pole: "R" },
      { label: "更新は減らすが、つながりは残す", pole: "S" },
    ),
  },
  {
    id: "r4",
    dimension: "recovery",
    text: "「もう無理」のあと、現実に戻るしかたは？",
    options: choices(
      "r4",
      { label: "一度全部止めて、まっさらな状態から再開", pole: "R" },
      { label: "ペースを落として、途切れさせず続ける", pole: "S" },
    ),
  },
];
