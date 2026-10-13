import { getSupabase } from "./supabase";
import { sampleBatch, sampleImpact, sampleProducts, sampleTemples } from "./placeholder";
import type { BatchTrace, Impact, Product, TempleWithTotal } from "./types";

/* Each loader returns { data, sample }. `sample` is true when Supabase is not
   connected and the page is showing placeholder data instead of real figures. */

export async function getTemples(): Promise<{ data: TempleWithTotal[]; sample: boolean }> {
  const db = getSupabase();
  if (!db) return { data: sampleTemples, sample: true };
  const { data, error } = await db.from("temple_totals").select("*").order("collecting_since");
  if (error) throw new Error(`Could not load temples: ${error.message}`);
  return { data: (data ?? []).map((t) => ({ ...t, kg_collected: Number(t.kg_collected) })), sample: false };
}

/* Projected kg a year = average kg collected per day x 365.
   The average is taken over every day from the first collection to the last,
   so days with no pickup count as zero and the estimate stays cautious. */
export function projectYear(kg: number, firstDay: string | null, lastDay: string | null) {
  if (!firstDay || !lastDay || !Number.isFinite(kg) || kg <= 0) return null;
  const days = Math.round((Date.parse(lastDay) - Date.parse(firstDay)) / 86_400_000) + 1;
  if (!Number.isFinite(days) || days <= 0) return null;
  return Math.round((kg / days) * 365);
}

export async function getImpact(): Promise<{ data: Impact; sample: boolean }> {
  const db = getSupabase();
  if (!db) return { data: sampleImpact, sample: true };
  const { data, error } = await db.from("impact_stats").select("*").single();
  if (error) throw new Error(`Could not load impact figures: ${error.message}`);
  const kgCollected = Number(data.kg_collected);
  return {
    data: {
      kgCollected,
      gulaalKg: Number(data.gulaal_kg),
      projectedKgPerYear: projectYear(kgCollected, data.first_day, data.last_day),
    },
    sample: false,
  };
}

export async function getProducts(): Promise<{ data: Product[]; sample: boolean }> {
  const db = getSupabase();
  if (!db) return { data: sampleProducts, sample: true };
  const { data, error } = await db.from("products").select("*").order("type", { ascending: false }).order("name");
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return { data: data ?? [], sample: false };
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
  return { data: data as BatchTrace | null, sample: false };
}
