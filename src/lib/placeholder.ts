import type { BatchTrace, Product, TempleWithTotal } from "./types";

/* Sample data shown only while Supabase is not connected.
   None of it is real: pages that use it show a "Sample data" notice. */

export const sampleTemples: TempleWithTotal[] = [
  { id: "sample-1", name: "Sample temple one", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-01", kg_collected: 42 },
  { id: "sample-2", name: "Sample temple two", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-05", kg_collected: 18 },
  { id: "sample-3", name: "Sample temple three", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-08", kg_collected: 9 },
];

export const sampleProducts: Product[] = [
  { id: "sample-rangoli-kesar", name: "Kesar Kyari rangoli colour", type: "gulaal", price_inr: 0, size: "Paper pouch", photo_url: "/images/products/kesar-kyari.webp", ingredients: "Flower-based colour for rangoli and decorative use. Ask the team for full ingredient details.", in_stock: true },
  { id: "sample-compost", name: "Temple Bloom flower compost", type: "compost", price_inr: 0, size: "Paper pouch", photo_url: "/images/products/temple-bloom.webp", ingredients: "Compost made from collected temple flowers.", in_stock: true },
];

export const sampleBatch: BatchTrace = {
  id: "sample",
  product_id: "sample-rangoli-kesar",
  temple_id: "sample-1",
  collected_on: "2026-10-10",
  kg_flowers_used: 5,
  kg_produced: 0.5,
  made_by: "Aryaman, Shubhi, Paridhi, Kushagra",
  product: { name: "Kesar Kyari rangoli colour", type: "gulaal", size: "Paper pouch" },
  temple: { name: "Sample temple one", area: "Area, Jaipur" },
};
