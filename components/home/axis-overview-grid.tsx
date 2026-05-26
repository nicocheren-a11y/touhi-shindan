import { DIMENSIONS } from "@/lib/dimensions";
import type { DimensionId } from "@/lib/quiz-types";

const AXIS_TOOLTIPS: Record<DimensionId, string> = {
  direction:
    "逃げ場が「一人の内側」か「外の世界」かを見る軸です。",
  method:
    "意志的に没頭するか、無意識に流されるかを見る軸です。",
  emotion:
    "感情を和らげる逃避か、考え・決断から距離を取る逃避かを見る軸です。",
  recovery:
    "一度ゼロに戻すか、生活を維持しながら逃げるかを見る軸です。",
};

function axisTitle(name: string) {
  return name.replace(/^軸[①②③④]：/, "");
}

export function AxisOverviewGrid() {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-stone-800">4つの軸</h2>
      <div
        className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-lg border border-stone-300 bg-stone-300 shadow-sm"
        role="table"
        aria-label="4つの診断軸の一覧"
      >
        {DIMENSIONS.map((dim) => (
          <div
            key={dim.id}
            role="cell"
            tabIndex={0}
            className="group relative min-h-[6.25rem] bg-stone-50 outline-none sm:min-h-[6.75rem]"
          >
            <div className="flex h-full flex-col items-center justify-center gap-1 px-3 py-3.5 text-center sm:py-4">
              <span className="text-xs font-semibold leading-tight text-stone-800">
                {axisTitle(dim.name)}
              </span>
              <span className="font-mono text-lg font-bold tracking-[0.12em] text-teal-800">
                {dim.poles.map((p) => p.letter).join(" / ")}
              </span>
              <span className="text-[10px] text-stone-500">
                {dim.poles.map((p) => p.short).join(" × ")}
              </span>
            </div>

            <div
              role="tooltip"
              className="pointer-events-none absolute inset-0 flex flex-col justify-center bg-stone-800/95 p-2.5 text-left text-[10px] leading-snug text-stone-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-3 sm:text-[11px]"
            >
              <p className="font-semibold text-teal-200">
                {axisTitle(dim.name)}（
                {dim.poles.map((p) => p.letter).join(" / ")}）
              </p>
              <p className="mt-1">{AXIS_TOOLTIPS[dim.id]}</p>
              <p className="mt-1.5 text-[10px] text-stone-400">
                {dim.poles[0].letter}＝{dim.poles[0].short}／
                {dim.poles[1].letter}＝{dim.poles[1].short}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
