import { catalogueProducts } from "./catalogue";

// Batch identifiers and dates transcribed from the supplied packaging photographs.
// A product record does not imply a verified collection-to-batch link.
export const productTraces = [
  { id: "RG-601", product: catalogueProducts[0], kind: "Batch record", batch: "RG-601", manufactured: "10 October 2025", bestBefore: "10 October 2027" },
  { id: "1001", product: catalogueProducts[1], kind: "Batch record", batch: "1001", manufactured: "22 October 2026", bestBefore: "2 months from manufacture" },
  { id: "temple-bloom", product: catalogueProducts[2], kind: "Product journey", batch: null, manufactured: null, bestBefore: null },
];
export function findProductTrace(id: string) {
  return productTraces.find((record) => record.id.toLowerCase() === id.toLowerCase());
}
