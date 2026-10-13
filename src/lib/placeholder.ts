import type { BatchTrace, Impact, Product, TempleWithTotal } from "./types";

/* Sample data shown only while Supabase is not connected.
   None of it is real: pages that use it show a "Sample data" notice. */

export const sampleTemples: TempleWithTotal[] = [
  { id: "sample-1", name: "Sample temple one", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-01", kg_collected: 42 },
  { id: "sample-2", name: "Sample temple two", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-05", kg_collected: 18 },
  { id: "sample-3", name: "Sample temple three", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-08", kg_collected: 9 },
];

export const sampleImpact: Impact = {
  kgCollected: 69,
  gulaalKg: 6,
  projectedKgPerYear: 2099,
};

export const sampleProducts: Product[] = [
  { id: "sample-gulaal-yellow", name: "Marigold yellow gulaal", type: "gulaal", price_inr: 0, size: "100 g pouch", photo_url: null, ingredients: "Dried marigold petals, cornflour", in_stock: true },
  { id: "sample-gulaal-pink", name: "Rose pink gulaal", type: "gulaal", price_inr: 0, size: "100 g pouch", photo_url: null, ingredients: "Dried rose petals, cornflour", in_stock: true },
  { id: "sample-compost", name: "Flower compost", type: "compost", price_inr: 0, size: "1 kg pack", photo_url: null, ingredients: "Composted temple flowers", in_stock: true },
];

export const sampleBatch: BatchTrace = {
  id: "sample",
  product_id: "sample-gulaal-yellow",
  temple_id: "sample-1",
  collected_on: "2026-10-10",
  kg_flowers_used: 5,
  kg_produced: 0.5,
  made_by: "Aryaman, Shubhi, Paridhi, Kushagra",
  product: { name: "Marigold yellow gulaal", type: "gulaal", size: "100 g pouch" },
  temple: { name: "Sample temple one", area: "Area, Jaipur" },
};
