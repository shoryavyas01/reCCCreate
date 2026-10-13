export type Temple = {
  id: string;
  name: string;
  area: string;
  photo_url: string | null;
  collecting_since: string | null;
  is_visible: boolean;
};

export type TempleWithTotal = Omit<Temple, "is_visible"> & { kg_collected: number };

export type Collection = { id: string; temple_id: string; date: string; kg: number };

export type Product = {
  id: string;
  name: string;
  type: "gulaal" | "compost";
  price_inr: number;
  size: string;
  photo_url: string | null;
  ingredients: string | null;
  in_stock: boolean;
};

export type Batch = {
  id: string;
  product_id: string;
  temple_id: string | null;
  collected_on: string;
  kg_flowers_used: number;
  kg_produced: number | null;
  made_by: string | null;
};

export type BatchTrace = Batch & {
  product: Pick<Product, "name" | "type" | "size"> | null;
  temple: Pick<Temple, "name" | "area"> | null;
};

export type Impact = {
  kgCollected: number;
  gulaalKg: number;
  projectedKgPerYear: number | null;
};
