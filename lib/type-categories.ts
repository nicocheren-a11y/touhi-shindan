import { ALL_TYPE_CODES, RESULT_PROFILES } from "@/lib/result-profiles";
import type { TypeCode } from "@/lib/quiz-types";

export type CategoryKey = "AF" | "AT" | "DF" | "DT";

export type CategoryTheme = {
  label: string;
  chip: string;
  item: string;
  code: string;
};

export const CATEGORY_THEME: Record<CategoryKey, CategoryTheme> = {
  AF: {
    label: "能動×感情",
    chip: "bg-rose-100 text-rose-700",
    item: "border-rose-200 bg-rose-50/70",
    code: "text-rose-700",
  },
  AT: {
    label: "能動×思考",
    chip: "bg-amber-100 text-amber-700",
    item: "border-amber-200 bg-amber-50/70",
    code: "text-amber-700",
  },
  DF: {
    label: "漂流×感情",
    chip: "bg-sky-100 text-sky-700",
    item: "border-sky-200 bg-sky-50/70",
    code: "text-sky-700",
  },
  DT: {
    label: "漂流×思考",
    chip: "bg-violet-100 text-violet-700",
    item: "border-violet-200 bg-violet-50/70",
    code: "text-violet-700",
  },
};

export const CATEGORY_ORDER: CategoryKey[] = ["AF", "AT", "DF", "DT"];

export function getCategoryKey(code: TypeCode): CategoryKey {
  return `${code[1]}${code[2]}` as CategoryKey;
}

export const SORTED_TYPE_CODES = [...ALL_TYPE_CODES].sort((a, b) => {
  const aCategory = getCategoryKey(a);
  const bCategory = getCategoryKey(b);
  const byCategory =
    CATEGORY_ORDER.indexOf(aCategory) - CATEGORY_ORDER.indexOf(bCategory);
  if (byCategory !== 0) return byCategory;
  return a.localeCompare(b);
});

export function getTypeTitle(code: TypeCode): string {
  return RESULT_PROFILES[code].title;
}
