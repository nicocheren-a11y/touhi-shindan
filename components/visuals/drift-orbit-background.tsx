"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitSpec = {
  scale: number;
  opacity: number;
  color: number;
  phase: number;
  freqA: number;
  freqB: number;
  freqC: number;
  ampX: number;
  ampY: number;
  ampZ: number;
  rotSpeed: [number, number, number];
  layerOffset: number;
  offsetX?: number;
  offsetY?: number;
};

const ORBITS: OrbitSpec[] = [
  {
    scale: 3.2,
    opacity: 0.52,
    color: 0x64748b,
    phase: 0,
    freqA: 2,
    freqB: 3,
    freqC: 1,
    ampX: 1,
    ampY: 0.72,
    ampZ: 0.55,
    rotSpeed: [0.00008, 0.00012, 0.00005],
    layerOffset: 0,
  },
  {
    scale: 2.8,
    opacity: 0.44,
    color: 0x2dd4bf,
    phase: 1.2,
    freqA: 3,
    freqB: 2,
    freqC: 2,
    ampX: 0.85,
    ampY: 1,
    ampZ: 0.4,
    rotSpeed: [0.0001, 0.00007, 0.00011],
    layerOffset: 0.2,
    offsetX: 0.3,
  },
  {
    scale: 2.5,
    opacity: 0.4,
    color: 0x78716c,
    phase: 2.4,
    freqA: 4,
    freqB: 3,
    freqC: 1,
    ampX: 0.6,
    ampY: 0.55,
    ampZ: 0.9,
    rotSpeed: [0.00012, 0.00008, 0.00007],
    layerOffset: -0.25,
    offsetX: -0.4,
  },
  {
    scale: 2.2,
    opacity: 0.48,
    color: 0x5eead4,
    phase: 0.8,
    freqA: 2,
    freqB: 5,
    freqC: 3,
    ampX: 0.5,
    ampY: 0.8,
    ampZ: 0.35,
    rotSpeed: [0.00007, 0.00013, 0.00009],
    layerOffset: 0.35,
    offsetY: 0.25,
  },
  {
    scale: 1.9,
    opacity: 0.38,
    color: 0x94a3b8,
    phase: 3.1,
    freqA: 5,
    freqB: 4,
    freqC: 2,
    ampX: 0.45,
    ampY: 0.4,
    ampZ: 0.7,
    rotSpeed: [0.00014, 0.00005, 0.00011],
    layerOffset: -0.15,
  },
  {
    scale: 1.6,
    opacity: 0.42,
    color: 0x34d399,
    phase: 1.9,
    freqA: 3,
    freqB: 6,
    freqC: 2,
    ampX: 0.35,
    ampY: 0.5,
    ampZ: 0.25,
    rotSpeed: [0.00011, 0.00015, 0.00006],
    layerOffset: 0.3,
    offsetX: 0.5,
    offsetY: -0.2,
  },
];

function createLissajousPoints(spec: OrbitSpec, segments: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const wobble =
      Math.sin(t * 3 + spec.phase) * 0.05 +
      Math.cos(t * 5 + spec.phase * 0.7) * 0.04;
    points.push(
      new THREE.Vector3(
        Math.sin(spec.freqA * t + spec.phase) * spec.ampX + wobble,
        Math.sin(spec.freqB * t + spec.phase * 1.3) * spec.ampY - wobble * 0.6,
        Math.cos(spec.freqC * t + spec.phase * 0.8) * spec.ampZ + wobble * 0.4,
      ),
    );
  }
  return points;
}

function createOrbitLine(spec: OrbitSpec, segments: number): THREE.Line {
  const curve = new THREE.CatmullRomCurve3(
    createLissajousPoints(spec, segments),
    true,
    "catmullrom",
    0.15,
  );
  const geometry = new THREE.BufferGeometry().setFromPoints(
    curve.getPoints(segments),
  );
  const material = new THREE.LineBasicMaterial({
    color: spec.color,
    transparent: true,
    opacity: spec.opacity,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const line = new THREE.Line(geometry, material);
  line.scale.setScalar(spec.scale);
  line.position.set(spec.offsetX ?? 0, spec.offsetY ?? 0, spec.layerOffset);
  return line;
}

function createBranchArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  bend: number,
  color: number,
  opacity: number,
): THREE.Line {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.y += bend;
  mid.z -= bend * 0.4;
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    curve.getPoints(56),
  );
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.Line(geometry, material);
}

function createEllipseRing(
  radiusX: number,
  radiusY: number,
  color: number,
  opacity: number,
  tilt: number,
): THREE.Line {
  const points: THREE.Vector3[] = [];
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(t) * radiusX,
        Math.sin(t) * radiusY,
        Math.sin(t * 2) * 0.15,
      ),
    );
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  line.rotation.x = tilt;
  return line;
}

export function DriftOrbitBackground() {
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf5f5f4, 0.028);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const orbitGroups: {
      group: THREE.Group;
      spec: OrbitSpec;
      breathPhase: number;
    }[] = [];

    for (const spec of ORBITS) {
      const group = new THREE.Group();
      group.add(createOrbitLine(spec, 160));
      root.add(group);
      orbitGroups.push({ group, spec, breathPhase: spec.phase });
    }

    const branchGroup = new THREE.Group();
    const anchors = [
      new THREE.Vector3(1.1, 0.5, 0.2),
      new THREE.Vector3(-0.9, -0.35, 0.35),
      new THREE.Vector3(0.25, -1.0, -0.25),
      new THREE.Vector3(-0.45, 0.85, 0.1),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.7, -0.2, 0.45),
    ];
    for (let i = 0; i < anchors.length - 1; i++) {
      branchGroup.add(
        createBranchArc(
          anchors[i],
          anchors[i + 1],
          (i % 2 === 0 ? 1 : -1) * 0.35,
          0x64748b,
          0.22 + (i % 3) * 0.04,
        ),
      );
    }
    root.add(branchGroup);

    root.add(createEllipseRing(2.6, 1.8, 0x94a3b8, 0.2, 0.35));
    root.add(createEllipseRing(2.1, 2.3, 0x5eead4, 0.16, -0.25));
    root.add(createEllipseRing(1.5, 1.2, 0x78716c, 0.18, 0.55));

    let frameId = 0;
    let lastTime = 0;
    const FRAME_MS = 1000 / 30; // 30fps
    const start = performance.now();

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (time: number) => {
      if (time - lastTime < FRAME_MS) {
        frameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;
      const t = (time - start) * 0.001;
      const breath = reducedMotion ? 0 : Math.sin(t * 0.55);

      root.rotation.y = reducedMotion ? 0.25 : t * 0.055;
      root.rotation.x = reducedMotion ? 0.12 : Math.sin(t * 0.14) * 0.14;
      root.position.y = breath * 0.05;

      for (const { group, spec, breathPhase } of orbitGroups) {
        group.rotation.x += reducedMotion ? 0 : spec.rotSpeed[0];
        group.rotation.y += reducedMotion ? 0 : spec.rotSpeed[1];
        group.rotation.z += reducedMotion ? 0 : spec.rotSpeed[2];

        const micro = reducedMotion
          ? 0
          : Math.sin(t * 1.3 + breathPhase) * 0.018 +
            Math.cos(t * 0.9 + breathPhase * 1.4) * 0.012;
        group.position.x = (spec.offsetX ?? 0) + micro;
        group.position.y = (spec.offsetY ?? 0) + micro * 0.7;
        group.scale.setScalar(
          1 + (reducedMotion ? 0 : Math.sin(t * 0.7 + breathPhase) * 0.02),
        );
      }

      branchGroup.rotation.z = reducedMotion ? 0 : t * 0.025;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-stone-200/30 via-stone-100/20 to-teal-100/25" />
      <div ref={canvasHostRef} className="absolute inset-0" />
    </div>
  );
}
