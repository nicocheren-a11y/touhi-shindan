import {
  CATEGORY_ORDER,
  CATEGORY_THEME,
  getCategoryKey,
  getTypeTitle,
  SORTED_TYPE_CODES,
} from "@/lib/type-categories";

export function TypeListSection() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-stone-800">16タイプ一覧</h2>
      <div className="flex flex-wrap gap-2 text-xs">
        {CATEGORY_ORDER.map((key) => {
          const theme = CATEGORY_THEME[key];
          return (
            <span
              key={key}
              className={`rounded-full px-2.5 py-1 font-medium ${theme.chip}`}
            >
              {theme.label}
            </span>
          );
        })}
      </div>
      <ul className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
        {SORTED_TYPE_CODES.map((code) => {
          const category = CATEGORY_THEME[getCategoryKey(code)];
          return (
            <li
              key={code}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${category.item}`}
            >
              <span className={`font-mono font-semibold ${category.code}`}>
                {code}
              </span>
              <span className="text-stone-700">{getTypeTitle(code)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
