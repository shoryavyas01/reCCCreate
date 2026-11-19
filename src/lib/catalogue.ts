import type { Product } from "./types";

const howToUse = [
  "Take a small amount of colour.",
  "Sprinkle or gently press it onto your chosen surface.",
  "Create your rangoli pattern.",
];

// Product information supplied on the photographed labels. These are catalogue
// previews until live stock and order services are connected. Batch information
// describes the pictured pack, rather than every future pack of that product.
export const catalogueProducts: Product[] = [
  {
    id: "sample-rangoli-kesar",
    traceId: "RG-601",
    name: "Kesar Kyari rangoli colour",
    type: "gulaal",
    price_inr: 199,
    size: "Paper pouch",
    photo_url: "/images/products/kesar-kyari-front.webp",
    ingredients: "Dried marigold/saffron petals, natural pigments and permitted binders.",
    in_stock: true,
    images: [
      { src: "/images/products/kesar-kyari-front.webp", label: "Front", alt: "Kesar Kyari rangoli colour — front of pouch" },
      { src: "/images/products/kesar-kyari-back.webp", label: "Back", alt: "Kesar Kyari rangoli colour — back label" },
    ],
    details: {
      shade: "Orange",
      howToUse,
      pack: [
        { label: "MRP", value: "₹199, inclusive of all taxes" },
        { label: "Batch", value: "RG-601" },
        { label: "Manufactured", value: "10 October 2025" },
        { label: "Best before", value: "10 October 2027" },
      ],
      madeBy: "ReCCCreate, Jaipur, Rajasthan",
    },
  },
  {
    id: "catalogue-rangoli-sunheri",
    traceId: "1001",
    name: "Sunheri Subah rangoli colour",
    type: "gulaal",
    price_inr: 20,
    size: "100 g pouch",
    photo_url: "/images/products/sunheri-subah-front.webp",
    ingredients: "Dried marigold petals (temple flower waste), natural pigments and permitted binders.",
    in_stock: true,
    images: [
      { src: "/images/products/sunheri-subah-front.webp", label: "Front", alt: "Sunheri Subah rangoli colour — front of pouch" },
      { src: "/images/products/sunheri-subah-back.webp", label: "Back", alt: "Sunheri Subah rangoli colour — back label" },
    ],
    details: {
      shade: "Yellow",
      howToUse,
      pack: [
        { label: "Net quantity", value: "100 g" },
        { label: "MRP", value: "₹20, inclusive of all taxes" },
        { label: "Batch", value: "1001" },
        { label: "Manufactured", value: "22 October 2026" },
        { label: "Best before", value: "2 months from manufacture" },
      ],
      madeBy: "ReCCCreate, Jaipur, Rajasthan – 302039",
    },
  },
  {
    id: "sample-compost",
    traceId: "temple-bloom",
    name: "Temple Bloom flower compost",
    type: "compost",
    price_inr: 0,
    size: "Paper pouch",
    photo_url: "/images/products/temple-bloom.webp",
    ingredients: "Compost made from collected temple flowers.",
    in_stock: true,
  },
];
