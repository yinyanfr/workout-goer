import { useEffect, useRef } from "react";

interface Pt {
  x: number;
  y: number;
  z: number;
}

const rotX = (p: Pt, a: number): Pt => {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
};

const rotY = (p: Pt, a: number): Pt => {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
};

const rotZ = (p: Pt, a: number): Pt => {
  const c = Math.cos(a),
    s = Math.sin(a);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
};

function project(p: Pt, w: number, h: number, dist: number): [number, number] {
  const z = p.z + dist;
  const scale = Math.min(w, h) * 0.22;
  return [(p.x / z) * scale + w / 2, (-p.y / z) * scale + h / 2];
}

function torusGrid(
  R: number,
  r: number,
  ts: number,
  ps: number,
): Pt[][] {
  const grid: Pt[][] = [];
  for (let i = 0; i < ts; i++) {
    grid[i] = [];
    const theta = (i / ts) * Math.PI * 2;
    for (let j = 0; j < ps; j++) {
      const phi = (j / ps) * Math.PI * 2;
      const rr = R + r * Math.cos(phi);
      grid[i].push({
        x: rr * Math.cos(theta),
        y: rr * Math.sin(theta),
        z: r * Math.sin(phi),
      });
    }
  }
  return grid;
}

// two interleaved toruses for a double-helix style
function helixRing(radius: number, turns: number, segs: number): Pt[][] {
  const strands: Pt[][] = [[], []];
  for (let i = 0; i < segs; i++) {
    const t = (i / segs) * Math.PI * 2 * turns;
    strands[0].push({
      x: radius * Math.cos(t),
      y: radius * Math.sin(t),
      z: (i / segs) * 6 - 3,
    });
    strands[1].push({
      x: radius * Math.cos(t + Math.PI),
      y: radius * Math.sin(t + Math.PI),
      z: (i / segs) * 6 - 3,
    });
  }
  return strands;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;

    const grid1 = torusGrid(2.2, 0.55, 48, 18);
    const grid2 = torusGrid(1.5, 0.35, 36, 14);
    const helix = helixRing(1.2, 4, 120);
    const ringPts: Pt[] = [];
    for (let i = 0; i < 80; i++) {
      const a = (i / 80) * Math.PI * 2;
      ringPts.push({ x: Math.cos(a) * 2.8, y: Math.sin(a) * 2.8, z: 0 });
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 14,
        z: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
        vz: (Math.random() - 0.5) * 0.002,
      });
    }

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawLine(p1: Pt, p2: Pt, alpha: number) {
      const [x1, y1] = project(p1, w, h, 7);
      const [x2, y2] = project(p2, w, h, 7);
      ctx!.beginPath();
      ctx!.moveTo(x1, y1);
      ctx!.lineTo(x2, y2);
      ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx!.stroke();
    }

    function drawGrid(grid: Pt[][], alpha: number) {
      const ts = grid.length;
      const ps = grid[0].length;
      for (let i = 0; i < ts; i++) {
        for (let j = 0; j < ps; j++) {
          drawLine(grid[i][j], grid[(i + 1) % ts][j], alpha * 0.7);
          drawLine(grid[i][j], grid[i][(j + 1) % ps], alpha * 0.4);
        }
      }
    }

    function drawStrand(pts: Pt[], alpha: number) {
      for (let i = 0; i < pts.length - 1; i++) {
        drawLine(pts[i], pts[i + 1], alpha);
      }
    }

    function drawParticles(particles: Particle[]) {
      for (const p of particles) {
        const [x, y] = project(p, w, h, 8);
        const size = ((p.z + 5) / 10) * 2;
        ctx!.beginPath();
        ctx!.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180,200,255,${0.3 + size * 0.15})`;
        ctx!.fill();
      }
    }

    function animate() {
      frame++;
      ctx!.clearRect(0, 0, w, h);

      const a1 = frame * 0.003;
      const a2 = frame * 0.005;
      const a3 = frame * 0.002;
      const a4 = frame * 0.007;

      // main torus - slow tilt
      const t1 = grid1.map((row) =>
        row.map((p) => rotZ(rotX(rotY(p, a1), a2 * 0.6), a3 * 0.4)),
      );
      drawGrid(t1, 0.25);

      // secondary torus - faster, offset rotation
      const t2 = grid2.map((row) =>
        row.map((p) => rotZ(rotY(rotX(p, -a2), -a1 * 0.7), a4 * 0.5)),
      );
      drawGrid(t2, 0.18);

      // helix strands
      const h1 = helix[0].map((p) => rotY(rotX(p, a3 * 0.8), -a1 * 1.2));
      const h2 = helix[1].map((p) => rotY(rotX(p, a3 * 0.8 + Math.PI / 2), -a1 * 1.2));
      drawStrand(h1, 0.3);
      drawStrand(h2, 0.2);

      // outer ring
      const ring = ringPts.map((p) => rotX(rotY(p, a4), -a2 * 0.5));
      for (let i = 0; i < ring.length; i++) {
        drawLine(ring[i], ring[(i + 1) % ring.length], 0.12);
      }

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (Math.abs(p.x) > 7) p.vx *= -1;
        if (Math.abs(p.y) > 7) p.vy *= -1;
        if (Math.abs(p.z) > 5) p.vz *= -1;
      }
      drawParticles(particles);

      requestAnimationFrame(animate);
    }

    const id = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#0b0b12",
      }}
    />
  );
}
