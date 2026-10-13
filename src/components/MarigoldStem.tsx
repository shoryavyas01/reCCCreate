"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const STEM = "#2f5d3a";
const STEP = 72; // vertical distance between zigzag corners, in px

type Shape = { width: number; height: number; nodes: number[] };

function petals(count: number, rx: number, ry: number, distance: number, fill: string, offset = 0) {
  return Array.from({ length: count }, (_, i) => (
    <ellipse
      key={`${fill}-${i}`}
      cx={50}
      cy={50 - distance}
      rx={rx}
      ry={ry}
      fill={fill}
      transform={`rotate(${(360 / count) * i + offset} 50 50)`}
    />
  ));
}

function Marigold({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute left-0 top-0" aria-hidden="true">
      {petals(16, 9, 14, 32, "#d9741a")}
      {petals(12, 8, 12, 23, "#e8891c", 15)}
      {petals(9, 7, 10, 14, "#f2a63a")}
      {petals(6, 5, 7, 6, "#f7c04a", 30)}
      <circle cx={50} cy={50} r={5} fill="#c9a227" />
    </svg>
  );
}

/* A marigold at the top left whose stem zigzags down beside the sections.
   The stem is drawn as the visitor scrolls: the path has pathLength 1, and
   stroke-dashoffset moves from 1 (hidden) to 0 (fully drawn) with scroll position.
   Each child marked with data-stem-node gets a leaf where the stem passes it. */
export default function MarigoldStem({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const [shape, setShape] = useState<Shape | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    const g = gutter.current;
    if (!el || !g) return;

    const measure = () => {
      const top = el.getBoundingClientRect().top;
      setShape({
        width: g.clientWidth,
        height: el.clientHeight,
        nodes: Array.from(el.querySelectorAll<HTMLElement>("[data-stem-node]")).map(
          (n) => n.getBoundingClientRect().top - top + 28,
        ),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (still.matches) return setProgress(1);
      const rect = el.getBoundingClientRect();
      const drawnTo = window.innerHeight * 0.7 - rect.top;
      setProgress(Math.min(1, Math.max(0, drawnTo / rect.height)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  let stem: ReactNode = null;
  if (shape && shape.height > shape.width) {
    const { width, height, nodes } = shape;
    const start = width * 0.8; // just under the flower head
    const end = height - 24;
    const xs = [width * 0.2, width * 0.8];

    const points: [number, number][] = [[width / 2, start]];
    for (let y = start + STEP, i = 0; y < end; y += STEP, i++) points.push([xs[i % 2], y]);
    const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const drawnY = start + progress * (end - start);

    const leaf = Math.max(0.6, width / 110);

    const xAt = (y: number) => {
      for (let i = 1; i < points.length; i++) {
        const [x0, y0] = points[i - 1];
        const [x1, y1] = points[i];
        if (y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0);
      }
      return points[points.length - 1][0];
    };

    stem = (
      <svg width={width} height={height} className="absolute left-0 top-0" aria-hidden="true">
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={STEM}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
        {nodes
          .filter((y) => y > start && y < end)
          .map((y, i) => {
            const x = xAt(y);
            const side = i % 2 ? -1 : 1;
            return (
              <path
                key={y}
                d="M0 0 C 8 -14, 26 -14, 30 0 C 26 14, 8 14, 0 0 Z"
                fill={STEM}
                transform={`translate(${x} ${y}) scale(${side * leaf} ${leaf}) rotate(-25)`}
                style={{ opacity: drawnY >= y ? 1 : 0, transition: "opacity 400ms" }}
              />
            );
          })}
      </svg>
    );
  }

  return (
    <div ref={wrap} className="relative pl-14 md:pl-28">
      <div ref={gutter} className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24">
        {shape && <Marigold size={shape.width} />}
        {stem}
      </div>
      {children}
    </div>
  );
}
