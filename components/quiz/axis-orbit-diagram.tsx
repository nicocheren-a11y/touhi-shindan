"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { breakdownToOrbitParams } from "@/lib/orbit-params";
import {
  ORBIT,
  ORBIT_VIEW_BOX,
  generateAnimatedOrbitPoints,
  generateOrbitEchoLayers,
  generateOrbitPoints,
  getResetDashStyle,
  pointsToAnimatedPath,
  referenceRingRadii,
  toMotionParams,
  type EchoLayer,
} from "@/lib/orbit-path";
import type { AxisBreakdownItem } from "@/lib/quiz-types";

type AxisOrbitDiagramProps = {
  items: AxisBreakdownItem[];
};

type FrameState = {
  echoes: EchoLayer[];
  mainPath: string;
  resetDash: { dasharray: string; dashoffset: number } | null;
};

function buildFrame(motion: ReturnType<typeof toMotionParams>, time: number): FrameState {
  const points = generateAnimatedOrbitPoints(motion, time);
  return {
    echoes: generateOrbitEchoLayers(motion, time),
    mainPath: pointsToAnimatedPath(points, motion.think, true),
    resetDash: getResetDashStyle(motion.resetPull, time),
  };
}

export function AxisOrbitDiagram({ items }: AxisOrbitDiagramProps) {
  const motion = useMemo(
    () => toMotionParams(breakdownToOrbitParams(items)),
    [items],
  );
  const rings = referenceRingRadii();

  const staticFrame = useMemo(() => {
    const points = generateOrbitPoints(motion);
    return {
      echoes: generateOrbitEchoLayers(motion, 0),
      mainPath: pointsToAnimatedPath(points, motion.think, true),
      resetDash: getResetDashStyle(motion.resetPull, 0),
    };
  }, [motion]);

  const [frame, setFrame] = useState<FrameState>(() => staticFrame);
  const [animate, setAnimate] = useState(false);
  const motionRef = useRef(motion);
  motionRef.current = motion;

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setAnimate(!reduced);
    if (reduced) {
      setFrame(buildFrame(motionRef.current, 0));
      return;
    }

    const start = performance.now();
    let id = 0;

    const tick = (now: number) => {
      const time = (now - start) * 0.001;
      setFrame(buildFrame(motionRef.current, time));
      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!animate) setFrame(staticFrame);
  }, [motion, animate, staticFrame]);

  const echoes = frame.echoes.length > 0 ? frame.echoes : staticFrame.echoes;
  const mainStroke = frame.mainPath || staticFrame.mainPath;

  return (
    <div
      className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4"
      role="img"
      aria-label="4つの軸の傾向を表した動く軌道図。太い線が現在の傾向、細い重なった線が軌道の動きの痕跡です。"
    >
      <div className="mx-auto w-full overflow-hidden">
        <svg
          viewBox={ORBIT_VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-square w-full"
          aria-hidden
        >
        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={rings.outer}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="0.5"
          strokeDasharray="3 5"
        />
        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={rings.mid}
          fill="none"
          stroke="#f5f5f4"
          strokeWidth="0.4"
          strokeDasharray="2 4"
        />
        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={rings.inner}
          fill="none"
          stroke="#f5f5f4"
          strokeWidth="0.4"
        />

        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={1.8}
          fill="#a8a29e"
          fillOpacity="0.35"
        />

        <g className="orbit-echo-trails">
          {echoes.map((layer, i) => (
            <path
              key={i}
              d={layer.path}
              fill="none"
              stroke="#64748b"
              strokeWidth={layer.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity={layer.opacity}
            />
          ))}
        </g>

        <path
          d={mainStroke}
          fill="none"
          stroke="#0d9488"
          strokeWidth={1.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.88}
          pathLength={100}
          strokeDasharray={frame.resetDash?.dasharray}
          strokeDashoffset={frame.resetDash?.dashoffset}
        />

        <text
          x={ORBIT.cx}
          y={ORBIT.cy - rings.inner + 6}
          textAnchor="middle"
          className="fill-stone-400 text-[7px]"
        >
          内向
        </text>
        <text
          x={ORBIT.cx}
          y={ORBIT.cy - rings.outer - 4}
          textAnchor="middle"
          className="fill-stone-500 text-[7px]"
        >
          外向
        </text>
        </svg>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] leading-snug text-stone-500 sm:text-xs">
        <li>① I/O … 中心へ潜る ↔ 外周へ拡散</li>
        <li>② A/D … 加速・分岐 ↔ 停止・曖昧</li>
        <li>③ F/T … 線が揺らぐ ↔ やや整然</li>
        <li>④ R/S … 点線で途切れる ↔ 分散する</li>
      </ul>
      <p className="mt-1.5 text-[10px] leading-snug text-stone-400 sm:text-xs">
        太い線がいまの傾向。細い線は過去の軌跡の重なりで、全体の「動き」として見てください。
      </p>
      {!animate ? (
        <p className="mt-1 text-center text-[10px] text-stone-400">
          動きはオフ（システムの「視差効果を減らす」設定）
        </p>
      ) : null}
    </div>
  );
}
