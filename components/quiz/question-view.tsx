import { getDimensionMeta } from "@/lib/dimensions";
import { BOTH_LABEL, UNSURE_LABEL } from "@/lib/quiz-options";
import type { Question } from "@/lib/quiz-types";
import { ProgressBar } from "./progress-bar";

const optionButtonClass =
  "w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-left text-stone-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.99]";

type QuestionViewProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  onBack?: () => void;
};

export function QuestionView({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  onSelect,
  onBack,
}: QuestionViewProps) {
  const dimension = getDimensionMeta(question.dimension);
  const hasBothOption = question.options.some((o) => o.both);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            ← 前の質問
          </button>
        ) : (
          <span className="w-[7.5rem] shrink-0" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <ProgressBar current={questionIndex + 1} total={totalQuestions} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-teal-700">
          Q{questionIndex + 1} · {dimension.questionLabel}
        </p>
        <h2 className="text-xl font-semibold leading-relaxed text-stone-800 sm:text-2xl">
          {question.text}
        </h2>
        {question.scaleHint ? (
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
            <span>{question.scaleHint.from}</span>
            <span className="flex-1 border-t border-dashed border-stone-300" />
            <span>{question.scaleHint.to}</span>
          </div>
        ) : null}
      </div>

      <ul className="flex flex-col gap-3" role="listbox" aria-label="回答を選択">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(option.id)}
                className={
                  isSelected
                    ? `${optionButtonClass} border-teal-500 bg-teal-50 ring-2 ring-teal-500/30`
                    : optionButtonClass
                }
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-stone-400">
        {hasBothOption
          ? `「${BOTH_LABEL}」は両方の傾向に1ずつ加算されます。`
          : null}
        「{UNSURE_LABEL}」は{dimension.questionLabel}の判定に含めません。
      </p>
    </div>
  );
}
