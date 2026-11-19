import { getSupabase } from "./supabase";
import { sampleBatch, sampleProducts, sampleTemples } from "./placeholder";
import { normaliseProduct, productDisplayName } from "./products";
import type { BatchTrace, Product, TempleWithTotal } from "./types";

/* Each loader returns { data, sample }. `sample` is true when Supabase is not
   connected and the page is showing placeholder data instead of real figures. */

export async function getTemples(): Promise<{ data: TempleWithTotal[]; sample: boolean }> {
  const db = getSupabase();
  if (!db) return { data: sampleTemples, sample: true };
  const { data, error } = await db.from("temple_totals").select("*").order("collecting_since");
  if (error) throw new Error(`Could not load temples: ${error.message}`);
  return { data: (data ?? []).map((t) => ({ ...t, kg_collected: Number(t.kg_collected) })), sample: false };
}

export async function getProducts(): Promise<{ data: Product[]; sample: boolean }> {
  const db = getSupabase();
  if (!db) return { data: sampleProducts, sample: true };
  const { data, error } = await db.from("products").select("*").order("type", { ascending: false }).order("name");
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return { data: (data ?? []).map(normaliseProduct), sample: false };
}

export async function getBatch(id: string): Promise<{ data: BatchTrace | null; sample: boolean }> {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return { data: null, sample: false };
  const db = getSupabase();
  if (!db) return { data: id === sampleBatch.id ? sampleBatch : null, sample: true };
  const { data, error } = await db
    .from("batches")
    .select("*, product:products(name, type, size), temple:temples(name, area)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Could not load batch: ${error.message}`);
  const batch = data as BatchTrace | null;
  return {
    data: batch ? { ...batch, product: batch.product ? { ...batch.product, name: productDisplayName(batch.product.name) } : null } : null,
    sample: false,
  };
}
