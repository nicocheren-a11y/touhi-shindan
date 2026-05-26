/** 軌道図の見た目パラメータ（0〜1） */
export type OrbitVisualParams = {
  outward: number;
  drift: number;
  wavy: number;
  resetPull: number;
};

export type OrbitMotionParams = OrbitVisualParams & {
  inward: number;
  active: number;
  think: number;
  sustain: number;
};

export type Point = { x: number; y: number };

export const ORBIT = { cx: 100, cy: 100 } as const;
/** 参照リング（outer=68）より少し内側に収める */
const MAX_ORBIT_RADIUS = 69;
export const ORBIT_VIEW_BOX = "0 0 200 200";

export function toMotionParams(params: OrbitVisualParams): OrbitMotionParams {
  return {
    ...params,
    inward: 1 - params.outward,
    active: 1 - params.drift,
    think: 1 - params.wavy,
    sustain: 1 - params.resetPull,
  };
}

/** 静止フレーム（SSR・reduced motion 用） */
export function generateOrbitPoints(
  params: OrbitVisualParams,
  segments = 120,
): Point[] {
  return generateAnimatedOrbitPoints(toMotionParams(params), 0, segments);
}

/**
 * 時間付き軌道点
 * I: 中心へ / O: 外周へ / F: 揺らぐ / T: やや整然（連続した曲線）
 * A: 加速・分岐 / D: 停止・曖昧 / R: 途切れ / S: 分散
 */
function computeOrbitPoint(
  p: OrbitMotionParams,
  segT: number,
  effectiveTime: number,
  time: number,
): Point {
  const theta = segT * Math.PI * 2 + effectiveTime * (0.15 + p.active * 0.28);
    let angle = theta;

    angle += Math.sin(theta * 4.1 + effectiveTime * 0.9) * 0.22 * p.drift;
    angle += Math.cos(theta * 6.7) * 0.1 * p.drift;

    let r = 26 + p.outward * 38 + p.inward * 6;

    r *= 0.86 + p.outward * 0.3;
    r *= 1 - p.inward * 0.14 * (0.5 + 0.5 * Math.sin(effectiveTime * 0.5));
    r *= 1 + p.outward * 0.12 * Math.sin(effectiveTime * 0.42 + 0.5);

    r += Math.sin(theta * 5.2 + effectiveTime * 2.4) * 9.5 * p.wavy;
    r += Math.sin(theta * 11 + effectiveTime * 1.1) * 3.8 * p.wavy;
    angle += Math.sin(theta * 3 + effectiveTime * 3.5) * 0.06 * p.wavy;

    r *= 1 - p.resetPull * 0.34 * (0.55 + 0.45 * Math.cos(theta * 2 - 0.3));
    r *= 0.96 + p.sustain * 0.08;

    // T: 角度の折れ曲げは使わない（rだけ整えると同方向に飛び出す）。F同様に連続＋弱い幾何
    if (p.think > 0.15) {
      const sides = 6;
      r *= 1 + p.think * 0.05 * Math.cos(sides * angle);
      angle += p.think * 0.03 * Math.sin(sides * angle + effectiveTime * 0.4);
      r += Math.sin(theta * 4 + effectiveTime * 1.1) * 2.8 * p.think;
      angle += Math.sin(theta * 2 + effectiveTime * 1.8) * 0.035 * p.think;
    }

    r *= 1 - p.drift * 0.07 * Math.sin(theta * 7);
    r +=
      Math.sin(theta * 13 + effectiveTime * 0.45) *
      3 *
      p.drift *
      (0.4 + 0.6 * Math.sin(time * 0.35));

    angle += p.active * 0.06 * Math.sin(effectiveTime * 2.2 + theta * 3);

  r = Math.max(14, Math.min(MAX_ORBIT_RADIUS, r));

  return {
    x: ORBIT.cx + Math.cos(angle) * r,
    y: ORBIT.cy + Math.sin(angle) * r,
  };
}

export function generateAnimatedOrbitPoints(
  p: OrbitMotionParams,
  time: number,
  segments = 140,
): Point[] {
  const stutter =
    p.drift * Math.pow(Math.max(0, Math.sin(time * 0.65)), 2) * 0.55;
  const effectiveTime = time * (0.3 + p.active * 0.5) - stutter;

  const points: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const segT = i / segments;
    points.push(computeOrbitPoint(p, segT, effectiveTime, time));
  }
  return points;
}

export type EchoLayer = {
  path: string;
  opacity: number;
  strokeWidth: number;
};

/** 過去フレームの軌跡を重ねる（背景の細い線） */
export function generateOrbitEchoLayers(
  p: OrbitMotionParams,
  time: number,
  layerCount = 9,
): EchoLayer[] {
  const layers: EchoLayer[] = [];
  const lagStep = 0.22 + p.drift * 0.1;

  for (let i = layerCount; i >= 1; i--) {
    const lag = i * lagStep;
    const pts = generateAnimatedOrbitPoints(p, time - lag, 112);
    const path = pointsToAnimatedPath(pts, p.think, true);
    if (!path) continue;

    const age = i / (layerCount + 1);
    layers.push({
      path,
      opacity: 0.09 + (1 - age) * 0.2,
      strokeWidth: 0.42 + (1 - age) * 0.4,
    });
  }

  if (p.active > 0.45) {
    const branchCount = p.active > 0.68 ? 2 : 1;
    for (let b = 0; b < branchCount; b++) {
      const pts = generateAnimatedOrbitPoints(
        {
          ...p,
          drift: Math.min(1, p.drift + 0.06),
          wavy: Math.min(1, p.wavy + 0.05 * (b + 1)),
        },
        time - 0.3 - b * 0.45,
        96,
      );
      const path = pointsToAnimatedPath(pts, p.think, true);
      if (path) {
        layers.push({
          path,
          opacity: 0.1 + p.active * 0.1,
          strokeWidth: 0.38,
        });
      }
    }
  }

  if (p.sustain > 0.35) {
    const outerPts = generateAnimatedOrbitPoints(
      {
        ...p,
        outward: Math.min(1, p.outward + 0.08 * p.sustain),
        wavy: p.wavy * 0.85,
      },
      time - 0.4,
      96,
    );
    const path = pointsToAnimatedPath(outerPts, p.think, true);
    if (path) {
      layers.push({
        path,
        opacity: 0.08 + p.sustain * 0.12,
        strokeWidth: 0.36,
      });
    }
  }

  return layers;
}

/** R軸：閉じた軌道の上で「途切れ」を点線の隙間で表す（パス自体は分割しない） */
export function getResetDashStyle(
  resetPull: number,
  time: number,
): { dasharray: string; dashoffset: number } | null {
  if (resetPull < 0.45) return null;

  const gap = 6 + resetPull * 14;
  const draw = 100 - gap;
  return {
    dasharray: `${draw} ${gap}`,
    dashoffset: -(time * 18 * resetPull) % 100,
  };
}

/** 分岐軌道（A） */
export function generateBranchPaths(
  p: OrbitMotionParams,
  time: number,
): string[] {
  if (p.active < 0.55) return [];

  const count = p.active > 0.72 ? 2 : 1;
  const paths: string[] = [];

  for (let b = 0; b < count; b++) {
    const phase = time * (0.4 + b * 0.15) + b * 1.7;
    const pts: Point[] = [];
    const segs = 48;
    const arcStart = b * 0.35;
    const arcLen = 0.35 + p.active * 0.25;

    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      if (u < arcStart || u > arcStart + arcLen) continue;

      const theta = u * Math.PI * 2 + phase;
      const r =
        34 +
        p.outward * 22 +
        Math.sin(theta * 4 + phase) * 6 * p.active;

      pts.push({
        x: ORBIT.cx + Math.cos(theta) * r,
        y: ORBIT.cy + Math.sin(theta) * r,
      });
    }

    const path = pointsToAnimatedPath(pts, p.think, false);
    if (path) paths.push(path);
  }

  return paths;
}

/** 分散ドット（S） */
export function generateScatterPoints(
  p: OrbitMotionParams,
  time: number,
): Point[] {
  if (p.sustain < 0.28) return [];

  const count = 5 + Math.floor(p.sustain * 4);
  const dots: Point[] = [];

  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 + time * 0.12;
    const spread = 12 + p.sustain * 18 + Math.sin(time * 0.5 + i) * 6;
    const r = 42 + p.outward * 20 + spread * (0.5 + 0.5 * Math.sin(time * 0.35 + i * 0.8));

    dots.push({
      x: ORBIT.cx + Math.cos(theta) * r,
      y: ORBIT.cy + Math.sin(theta) * r,
    });
  }

  return dots;
}

export function pointsToAnimatedPath(
  points: Point[],
  think: number,
  closed = true,
): string {
  if (points.length < 2) return "";
  const tension = 0.4 + (1 - think) * 0.1;
  return pointsToSmoothPath(points, closed, tension);
}

function pointsToSmoothPath(
  points: Point[],
  closed: boolean,
  tension: number,
): string {
  const p = closed && points.length > 1 ? points.slice(0, -1) : [...points];
  const len = p.length;
  if (len < 2) return "";

  let d = `M ${p[0].x.toFixed(2)} ${p[0].y.toFixed(2)}`;

  for (let i = 0; i < (closed ? len : len - 1); i++) {
    const p0 = p[(i - 1 + len) % len];
    const p1 = p[i];
    const p2 = p[(i + 1) % len];
    const p3 = p[(i + 2) % len];

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return closed ? `${d} Z` : d;
}

export function pointsToSmoothClosedPath(
  points: Point[],
  tension = 0.4,
): string {
  return pointsToSmoothPath(points, true, tension);
}

export function referenceRingRadii(): {
  inner: number;
  mid: number;
  outer: number;
} {
  return { inner: 28, mid: 48, outer: 68 };
}
