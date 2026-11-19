import { pageMetadata } from "@/lib/site";
import ShopExperience from "@/components/ShopExperience";
import { getProducts } from "@/lib/data";
import { sheetConfigured } from "@/lib/sheet";
import { shopFilter } from "@/lib/products";

export const metadata = pageMetadata('Shop rangoli colour & flower compost', 'Explore Kesar Kyari and Sunheri Subah rangoli colours at ₹20, and Temple Bloom flower compost at ₹50. Enquire with our Jaipur student team.', '/shop');
export const revalidate = 60;

export default async function Shop({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [{ data: products, catalogueOnly }, query] = await Promise.all([getProducts(), searchParams]);
  const initialFilter = shopFilter(query.type);
  return <><section className="section pb-12"><div className="container-site"><p className="eyebrow mb-6">Remade in Jaipur</p><div className="page-intro"><h1 className="max-w-[11ch]">A second life.<br /><span className="display-accent">A new purpose.</span></h1><p className="body-copy">Rangoli colour for celebrations. Compost for the soil. Both begin with flowers offered at Jaipur temples, and both give discarded petals a useful second life.</p></div></div></section><ShopExperience products={products} catalogueOnly={catalogueOnly} initialFilter={initialFilter} ordersOpen={sheetConfigured} /></>;
}
