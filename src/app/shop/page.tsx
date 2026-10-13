import type { Metadata } from "next";
import ShopExperience from "@/components/ShopExperience";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Shop", description: "Natural gulaal and flower compost from a Jaipur student venture. Explore the collection and request a local order." };
export const revalidate = 60;

export default async function Shop({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [{ data: products, sample }, query] = await Promise.all([getProducts(), searchParams]);
  const initialFilter = query.type === "gulaal" || query.type === "compost" ? query.type : "all";
  return <><section className="section pb-12"><div className="container-site"><p className="eyebrow mb-6">Remade in Jaipur</p><div className="page-intro"><h1 className="max-w-[11ch]">A second life.<br /><span className="display-accent">A new purpose.</span></h1><p className="body-copy">Natural gulaal for celebrations. Compost for the soil. Both begin with flowers offered at Jaipur temples, and both carry a story you can trace.</p></div></div></section><ShopExperience products={products} sample={sample} initialFilter={initialFilter} /></>;
}
