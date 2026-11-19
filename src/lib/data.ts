import { getSupabase } from "./supabase";
import { projectTemples } from "./temples";
import { catalogueProducts } from "./catalogue";
import { normaliseProduct, productDisplayName } from "./products";
import type { BatchTrace, Product, TempleWithTotal } from "./types";

export async function getTemples(): Promise<{ data: TempleWithTotal[] }> {
  const db = getSupabase();
  if (!db) return { data: projectTemples };
  const { data, error } = await db.from("temple_totals").select("*").order("collecting_since");
  if (error) throw new Error(`Could not load temples: ${error.message}`);
  const live = (data ?? []).map((t) => ({ ...t, kg_collected: t.kg_collected == null ? null : Number(t.kg_collected) })) as TempleWithTotal[];
  const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return { data: [...projectTemples.map((temple) => {
    const recorded = live.find((item) => key(item.name) === key(temple.name));
    return recorded ? { ...temple, ...recorded, photo_url: recorded.photo_url || temple.photo_url } : temple;
  }), ...live.filter((item) => !projectTemples.some((temple) => key(temple.name) === key(item.name)))] };
}

export async function getProducts(): Promise<{ data: Product[]; catalogueOnly: boolean }> {
  const db = getSupabase();
  if (!db) return { data: catalogueProducts, catalogueOnly: true };
  const { data, error } = await db.from("products").select("*").order("type", { ascending: false }).order("name");
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return { data: (data ?? []).map(normaliseProduct), catalogueOnly: false };
}

export async function getBatch(id: string): Promise<{ data: BatchTrace | null; catalogueOnly: boolean }> {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return { data: null, catalogueOnly: false };
  const db = getSupabase();
  if (!db) return { data: null, catalogueOnly: false };
  const { data, error } = await db
    .from("batches")
    .select("*, product:products(name, type, size), temple:temples(name, area)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Could not load batch: ${error.message}`);
  const batch = data as BatchTrace | null;
  return {
    data: batch ? { ...batch, product: batch.product ? { ...batch.product, name: productDisplayName(batch.product.name) } : null } : null,
    catalogueOnly: false,
  };
}
