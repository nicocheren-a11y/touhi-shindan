import { DIMENSIONS } from "./dimensions";
import type { ResultProfile, TypeCode } from "./quiz-types";

export type EscapeAxisSection = {
  axisLabel: string;
  letter: string;
  title: string;
  body: string;
  inDailyLife: string;
};

export type EscapeExplanation = {
  summary: string;
  sections: EscapeAxisSection[];
  synthesis: string;
};

const POLE_DETAIL: Record<
  string,
  { title: string; body: string; inDailyLife: string }
> = {
  I: {
    title: "内向（I）— 内側の世界に逃げる",
    body:
      "つらいとき、意識は外ではなく「自分の中」や「一人の空間」に向きやすいタイプです。部屋、空想、内省、別アカウントなど、他人の目が届きにくい場所が安全基地になります。",
    inDailyLife:
      "連絡を後回しにして一人になる、布団や部屋にこもる、頭の中で物語を作る——こうしたパターンが出やすいです。",
  },
  O: {
    title: "外向（O）— 外の世界に逃げる",
    body:
      "つらいとき、内側で処理するより「外に出す」ほうが楽になる傾向があります。人、会話、外出、イベント、SNSなど、外側の刺激で気持ちを切り替えようとします。",
    inDailyLife:
      "その場で返信する、誰かと話す、出かける、予定で埋める——外側を動かすことで、本題から距離を取りやすいです。",
  },
  A: {
    title: "能動（A）— 選んだ没頭で忘れる",
    body:
      "現実逃避を「偶然」ではなく、ある程度コントロールできているタイプです。ゲーム、推し活、創作、運動など、自分で選んだ没頭が得意で、技術として使えます。",
    inDailyLife:
      "「これをする」と決めてスマホや趣味を開く、ストレスの日に買い物や更新チェックに行く——意志的な切り替えが多いです。",
  },
  D: {
    title: "漂流（D）— 流されて時間が消える",
    body:
      "「やめよう」と思う前に、すでに時間が過ぎているパターンが多いタイプです。無限スクロール、ぼーっとする、寝落ちなど、意志より慣性が先に立ちます。",
    inDailyLife:
      "気づいたら2時間経っていた、止め時がない、なんとなくスマホ——選んだ感覚より「漂った」感覚が強いです。",
  },
  F: {
    title: "感情（F）— 気持ちを和らげるために逃げる",
    body:
      "逃避の根っこに、傷つき・寂しさ・不安などの感情があります。音楽、物語、ぬいぐるみ、安心できる空間など、心を直接ほぐす方向に逃げやすいです。",
    inDailyLife:
      "言葉で傷ついたあとに癒し系コンテンツへ、泣きたい気持ちを別の感覚で埋める——感情ケアが先に来ます。",
  },
  T: {
    title: "思考（T）— 考えることで距離を取る",
    body:
      "感情より「頭の負荷」から逃げるタイプです。決められない、失敗が怖い、考えが止まらない——そういう状態から、調べ物・分析・作業・情報収集へ移りやすいです。",
    inDailyLife:
      "本題の前にリサーチが増える、リストや計画だけ進む、眠れない夜に手順を反芻する——思考が逃避の主役です。",
  },
  R: {
    title: "リセット（R）— ゼロに戻して回復する",
    body:
      "限界が来ると、遮断・睡眠・失踪のように「一度すべて止める」回復を選びやすいタイプです。連絡を断ち、予定を消し、まっさらな状態から再開したい欲求が強いです。",
    inDailyLife:
      "休日に人間モードOFF、SNSを消す、丸一日寝る——完全リセットが周期性に現れます。",
  },
  S: {
    title: "維持（S）— 壊れずに分散して回復する",
    body:
      "逃避しながらも、生活の体裁は保とうとするタイプです。ながら逃避、軽いサボり、ギリギリの社会接続——表向きは「普通」に見えることも多いです。",
    inDailyLife:
      "出勤はするが手を抜く、返信は遅いが完全には切らない、ドラマを見ながら家事——途切れさせずに分散します。",
  },
};

const SYNTHESIS_TEMPLATES: Partial<Record<TypeCode, string>> = {};

function defaultSynthesis(code: TypeCode, title: string): string {
  const [d, m, e, r] = code.split("");
  const parts: string[] = [];

  parts.push(
    d === "I"
      ? "基本は「内側に閉じる」逃避"
      : "基本は「外側に広げる」逃避",
  );
  parts.push(
    m === "A"
      ? "その手段は自分で選んだ没頭"
      : "その手段は無意識の漂流",
  );
  parts.push(
    e === "F"
      ? "動機は感情のケア"
      : "動機は思考の整理・停止",
  );
  parts.push(
    r === "R"
      ? "回復は一度ゼロに戻すタイプ"
      : "回復は生活を維持しながら分散するタイプ",
  );

  return `あなた（${title}）の現実逃避は、${parts.join("、")}という組み合わせです。4つが重なると、本人は「休んでいる」「調べている」「普通に過ごしている」と感じていても、本当に向き合いたいテーマからは距離を保っている状態になりやすいです。`;
}

export function buildEscapeExplanation(profile: ResultProfile): EscapeExplanation {
  const letters = profile.code.split("");
  const sections: EscapeAxisSection[] = DIMENSIONS.map((dim, index) => {
    const letter = letters[index];
    const detail = POLE_DETAIL[letter];

    return {
      axisLabel: dim.questionLabel,
      letter,
      title: detail.title,
      body: detail.body,
      inDailyLife: detail.inDailyLife,
    };
  });

  return {
    summary: `${profile.title}（${profile.code}）の回答から見える、あなたの現実逃避のパターンを4つの軸ごとに解説します。`,
    sections,
    synthesis:
      SYNTHESIS_TEMPLATES[profile.code] ??
      defaultSynthesis(profile.code, profile.title),
  };
}
