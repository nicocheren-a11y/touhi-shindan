"use client";

import { useEffect, useState } from "react";
import { EscapeDetailView } from "@/components/quiz/escape-detail-view";
import { buildEscapeExplanation } from "@/lib/escape-explanation";
import {
  getPositiveEscapeAdvice,
  type PositiveEscapeAdvice,
} from "@/lib/positive-escape-advice";
import { breakdownFromCode } from "@/lib/scoring";
import type { AxisBreakdownItem, ResultProfile } from "@/lib/quiz-types";

const SESSION_KEY = "touhi-quiz-session";

type EscapeDetailClientProps = {
  profile: ResultProfile;
};

export function EscapeDetailClient({ profile }: EscapeDetailClientProps) {
  const [positiveAdvice, setPositiveAdvice] = useState<PositiveEscapeAdvice>(
    () => getPositiveEscapeAdvice(profile.code, false),
  );
  const [breakdown, setBreakdown] = useState<AxisBreakdownItem[]>(() =>
    breakdownFromCode(profile.code),
  );
  const explanation = buildEscapeExplanation(profile);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        ambiguousOutcome?: boolean;
        breakdown?: AxisBreakdownItem[];
      };
      if (typeof parsed.ambiguousOutcome === "boolean") {
        setPositiveAdvice(
          getPositiveEscapeAdvice(profile.code, parsed.ambiguousOutcome),
        );
      }
      if (Array.isArray(parsed.breakdown) && parsed.breakdown.length === 4) {
        setBreakdown(parsed.breakdown);
      }
    } catch {
      // ignore
    }
  }, [profile.code]);

  return (
    <EscapeDetailView
      profile={profile}
      explanation={explanation}
      positiveAdvice={positiveAdvice}
      breakdown={breakdown}
    />
  );
}

export { SESSION_KEY };
