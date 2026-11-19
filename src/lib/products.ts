import type { Product } from "./types";
import { catalogueProducts } from "./catalogue";

// Keep the existing database category key compatible with saved products.
// Visitors and admins see the current product name everywhere.
export function productTypeLabel(type: Product["type"]): string {
  return type === "compost" ? "Flower compost" : "Rangoli colour";
}

export function productDisplayName(name: string): string {
  return name.replace(/\bgulaal\b|\bgulal\b/gi, "rangoli colour");
}

export function normaliseProduct(product: Product): Product {
  const name = productDisplayName(product.name);
  const catalogue = catalogueProducts.find((item) =>
    name.toLowerCase().includes(item.name.replace(/ rangoli colour| flower compost/g, "").toLowerCase()),
  );
  return {
    ...product,
    name,
    price_inr: catalogue?.price_inr ?? product.price_inr,
    images: product.images ?? catalogue?.images,
    details: product.details ?? catalogue?.details,
    traceId: product.traceId ?? catalogue?.traceId,
  };
}

export function shopFilter(value: string | undefined): "all" | Product["type"] {
  if (value === "rangoli" || value === "gulaal") return "gulaal";
  return value === "compost" ? "compost" : "all";
}
