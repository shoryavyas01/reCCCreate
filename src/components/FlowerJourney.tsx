"use client";

import Link from "next/link";
import { useState } from "react";
import BotanicalMotif from "./BotanicalMotif";

const stages = [
  {
    label: "Gather",
    eyebrow: "01 · COLLECT",
    title: "Morning collections.",
    description: "Temple flowers are collected with partner temples in Jaipur and weighed before processing.",
  },
  {
    label: "Reimagine",
    eyebrow: "02 · TRANSFORM",
    title: "Sun-dried. Then ground.",
    description: "Sorted, sun-dried petals are ground into natural gulaal—a new form for flowers offered with meaning.",
  },
  {
    label: "Return",
    eyebrow: "03 · GIVE BACK",
    title: "The rest returns to soil.",
    description: "Petals not used for gulaal are directed to a compost unit, completing another part of the cycle.",
  },
] as const;

const nodePositions = [
  { x: 92, y: 182 },
  { x: 260, y: 78 },
  { x: 428, y: 182 },
] as const;

export default function FlowerJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];

  return (
    <section className="section-tight journey-section" aria-labelledby="journey-heading" data-reveal>
      <div className="container-site">
        <div className="journey-heading">
          <div>
            <p className="eyebrow mb-4">The work behind the colour</p>
            <h2 id="journey-heading" className="max-w-[13ch]">Collected. Sorted.<br /><span className="display-accent">Made again.</span></h2>
          </div>
          <p className="body-copy max-w-md">From morning collections to sun-dried colour and compost. Choose a step to see where the petals go.</p>
        </div>

        <div className="journey-card">
          <div className="journey-visual">
            <div className="journey-visual-label">FLOWER · COLOUR · SOIL</div>
            <BotanicalMotif className="absolute w-28 journey-flower" />
            <svg className="journey-diagram" viewBox="0 0 520 360" role="img" aria-labelledby="journey-diagram-title journey-diagram-desc">
              <title id="journey-diagram-title">Three steps in the ReCCCreate flower cycle</title>
              <desc id="journey-diagram-desc">A curved path links flower collection, natural gulaal, and compost from surplus petals.</desc>
              <path className="journey-path" d="M92 182 C130 18 390 18 428 182 C390 346 130 346 92 182Z" />
              {nodePositions.map((position, index) => (
                <g key={stages[index].label} className={`journey-node ${activeStage === index ? "is-active" : ""}`} transform={`translate(${position.x} ${position.y})`}>
                  <circle className="journey-node-ring" r="35" />
                  <circle className="journey-node-core" r="25" />
                  <text className="journey-node-number" y="1">0{index + 1}</text>
                </g>
              ))}
              <circle className="journey-orbit-dot" cx="260" cy="306" r="4" />
              <circle className="journey-orbit-dot" cx="260" cy="54" r="4" />
            </svg>
            <p className="journey-visual-caption">COLLECT → DRY → REMAKE</p>
          </div>

          <div className="journey-copy">
            <div className="journey-tabs" role="group" aria-label="Choose a step in the flower cycle">
              {stages.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  className={`journey-tab ${activeStage === index ? "is-selected" : ""}`}
                  aria-pressed={activeStage === index}
                  onClick={() => setActiveStage(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div key={activeStage} className="journey-copy-content" aria-live="polite">
              <p className="eyebrow mb-4">{stage.eyebrow}</p>
              <h3 className="journey-title">{stage.title}</h3>
              <p className="journey-description mt-4">{stage.description}</p>
            </div>
            <Link href="/trace/sample" className="journey-link mt-7">Follow a sample batch <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
