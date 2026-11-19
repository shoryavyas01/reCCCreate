import { getSupabase } from "./supabase";
import { projectTemples } from "./temples";
import { catalogueProducts } from "./catalogue";
import { normaliseProduct } from "./products";
import type { Product, TempleWithTotal } from "./types";

export async function getTemples(): Promise<{ data: TempleWithTotal[] }> {
  const db = getSupabase();
  if (!db) return { data: projectTemples };
  const { data, error } = await db.from("temple_totals").select("*").order("collecting_since");
  if (error) { console.error("Temple catalogue unavailable"); return { data: projectTemples }; }
  const live = (data ?? []).map((t) => ({ ...t, kg_collected: t.kg_collected == null ? null : Number(t.kg_collected) })) as TempleWithTotal[];
  const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return { data: [...projectTemples.map((temple) => {
    const recorded = live.find((item) => key(item.name) === key(temple.name));
    return recorded ? { ...temple, ...recorded, photo_url: recorded.photo_url || temple.photo_url, photo_kind: recorded.photo_url ? recorded.photo_kind : temple.photo_kind, photo_credit: recorded.photo_url ? recorded.photo_credit : temple.photo_credit, photo_source: recorded.photo_url ? recorded.photo_source : temple.photo_source } : temple;
  }), ...live.filter((item) => !projectTemples.some((temple) => key(temple.name) === key(item.name)))] };
}

export async function getProducts(): Promise<{ data: Product[]; catalogueOnly: boolean }> {
  const db = getSupabase();
  if (!db) return { data: catalogueProducts, catalogueOnly: true };
  const { data, error } = await db.from("products").select("*").order("type", { ascending: false }).order("name");
  if (error) { console.error("Product catalogue unavailable"); return { data: catalogueProducts, catalogueOnly: true }; }
  return { data: (data ?? []).map(normaliseProduct), catalogueOnly: false };
}
