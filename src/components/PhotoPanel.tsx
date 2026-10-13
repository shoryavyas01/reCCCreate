"use client";

import { useState } from "react";
import BotanicalMotif from "./BotanicalMotif";

export default function PhotoPanel({ src, alt, credit, ratio = "aspect-[4/3]" }: { src?: string | null; alt: string; credit?: string; ratio?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <figure className="overflow-hidden border border-black/10 bg-[#e9e2d1]">
    {src && src !== failedSrc ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" className={`${ratio} w-full object-cover`} onError={() => setFailedSrc(src)} />
    ) : <div className={`${ratio} relative flex w-full items-center justify-center overflow-hidden bg-[#e9e2d1]`}><BotanicalMotif className="h-36 w-24 text-[#8a7650]/50" /><span className="absolute bottom-3 left-4 text-[10px] tracking-wider text-[#716447]">{src ? "Photo unavailable" : "Botanical illustration"}</span></div>}
    {credit && <figcaption className="px-3 py-2 text-xs text-[#657169]">{credit}</figcaption>}
  </figure>;
}
