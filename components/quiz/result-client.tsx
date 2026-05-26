"use client";

import { useEffect, useState } from "react";
import { AxisBreakdown } from "@/components/quiz/axis-breakdown";
import { ResultView } from "@/components/quiz/result-view";
import {
  breakdownFromCode,
  hadAmbiguousEscapeOutcome,
  hasLowConfidenceAxis,
} from "@/lib/scoring";
import type { AnswerSelection, AxisBreakdownItem, ResultProfile } from "@/lib/quiz-types";

const SESSION_KEY = "touhi-quiz-session";

type ResultClientProps = {
  profile: ResultProfile;
};

export function ResultClient({ profile }: ResultClientProps) {
  const [breakdown, setBreakdown] = useState<AxisBreakdownItem[]>(() =>
    breakdownFromCode(profile.code),
  );
  const [showScores, setShowScores] = useState(true);
  const [lowConfidence, setLowConfidence] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        breakdown?: AxisBreakdownItem[];
      };
      if (Array.isArray(parsed.breakdown) && parsed.breakdown.length === 4) {
        setBreakdown(parsed.breakdown);
        setShowScores(true);
        setLowConfidence(hasLowConfidenceAxis(parsed.breakdown));
      }
    } catch {
      // ignore invalid session data
    }
  }, []);

  return (
    <ResultView
      profile={profile}
      breakdown={breakdown}
      showScores={showScores}
      lowConfidence={lowConfidence}
    />
  );
}

export function saveQuizSessionToStorage(
  breakdown: AxisBreakdownItem[],
  answers: AnswerSelection[],
) {
  const payload = {
    breakdown,
    ambiguousOutcome: hadAmbiguousEscapeOutcome(answers),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}
