"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import PhotoPanel from "./PhotoPanel";

export default function ProductGallery({ name, images }: { name: string; images: NonNullable<Product["images"]> }) {
  const [side, setSide] = useState(0);
  const image = images[side] ?? images[0];
  return <div className="product-gallery">
    <PhotoPanel src={image.src} alt={image.alt} ratio="aspect-[4/5]" fit="contain" />
    <div className="product-gallery-controls" role="group" aria-label={`View ${name} packaging`}>
      {images.length > 1 ? images.map((item, index) => <button key={item.src} type="button" aria-pressed={side === index} onClick={() => setSide(index)}>{item.label}</button>) : <span>Product view</span>}
    </div>
    <p className="sr-only" aria-live="polite">Showing {image.label.toLowerCase()} of {name}.</p>
  </div>;
}
