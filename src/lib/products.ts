import type { Product } from "./types";

// Keep the existing database category key compatible with saved products.
// Visitors and admins see the current product name everywhere.
export function productTypeLabel(type: Product["type"]): string {
  return type === "compost" ? "Flower compost" : "Rangoli colour";
}

export function productDisplayName(name: string): string {
  return name.replace(/\bgulaal\b|\bgulal\b/gi, "rangoli colour");
}

export function normaliseProduct(product: Product): Product {
  return { ...product, name: productDisplayName(product.name) };
}

export function shopFilter(value: string | undefined): "all" | Product["type"] {
  if (value === "rangoli" || value === "gulaal") return "gulaal";
  return value === "compost" ? "compost" : "all";
}
