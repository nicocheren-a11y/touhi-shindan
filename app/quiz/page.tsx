"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { saveQuizSessionToStorage } from "@/components/quiz/result-client";
import { PageShell } from "@/components/layout/page-shell";
import { QuestionView } from "@/components/quiz/question-view";
import { QUESTIONS } from "@/lib/quiz-data";
import {
  buildAxisBreakdown,
  calculateTypeCode,
} from "@/lib/scoring";
import type { AnswerOption, AnswerSelection } from "@/lib/quiz-types";

function toSelection(
  question: (typeof QUESTIONS)[number],
  option: AnswerOption,
): AnswerSelection {
  if (option.both) {
    return { dimension: question.dimension, pole: null, isBoth: true };
  }
  if (option.axisWeights?.length) {
    return {
      dimension: question.dimension,
      pole: null,
      axisWeights: option.axisWeights,
    };
  }
  if (option.ambiguousOutcome && option.weights?.length) {
    return {
      dimension: question.dimension,
      pole: null,
      weights: option.weights,
      ambiguousOutcome: true,
    };
  }
  if (option.weights?.length) {
    return {
      dimension: question.dimension,
      pole: null,
      weights: option.weights,
    };
  }
  return { dimension: question.dimension, pole: option.pole };
}

export default function QuizPage() {
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSelection[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);

  const question = QUESTIONS[questionIndex];
  const isLast = questionIndex === QUESTIONS.length - 1;
  const canGoBack = questionIndex > 0;

  const handleSelect = useCallback(
    (optionId: string) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;

      const selection = toSelection(question, option);
      const nextAnswers = [...answers];
      const nextOptionIds = [...selectedOptionIds];

      if (questionIndex < nextAnswers.length) {
        nextAnswers[questionIndex] = selection;
        nextAnswers.length = questionIndex + 1;
        nextOptionIds[questionIndex] = optionId;
        nextOptionIds.length = questionIndex + 1;
      } else {
        nextAnswers.push(selection);
        nextOptionIds.push(optionId);
      }

      if (isLast) {
        const code = calculateTypeCode(nextAnswers);
        const breakdown = buildAxisBreakdown(nextAnswers);
        saveQuizSessionToStorage(breakdown, nextAnswers);
        router.push(`/result?code=${code}`);
        return;
      }

      setAnswers(nextAnswers);
      setSelectedOptionIds(nextOptionIds);
      setQuestionIndex((i) => i + 1);
    },
    [answers, isLast, question, questionIndex, router, selectedOptionIds],
  );

  const handleBack = useCallback(() => {
    if (questionIndex === 0) return;
    setQuestionIndex((i) => i - 1);
  }, [questionIndex]);

  return (
    <PageShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-teal-700">逃避診断</p>
        <h1 className="mt-1 text-lg font-semibold text-stone-800">
          近いほうを選んでください（「どちらも」「わからない」も選べます）
        </h1>
      </header>

      <QuestionView
        question={question}
        questionIndex={questionIndex}
        totalQuestions={QUESTIONS.length}
        selectedOptionId={selectedOptionIds[questionIndex]}
        onSelect={handleSelect}
        onBack={canGoBack ? handleBack : undefined}
      />
    </PageShell>
  );
}
