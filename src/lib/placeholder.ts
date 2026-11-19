import type { BatchTrace, TempleWithTotal } from "./types";

/* Sample data shown only while Supabase is not connected.
   None of it is real: pages that use it show a "Sample data" notice. */

export const sampleTemples: TempleWithTotal[] = [
  { id: "sample-1", name: "Sample temple one", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-01", kg_collected: 42 },
  { id: "sample-2", name: "Sample temple two", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-05", kg_collected: 18 },
  { id: "sample-3", name: "Sample temple three", area: "Area, Jaipur", photo_url: null, collecting_since: "2026-10-08", kg_collected: 9 },
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
