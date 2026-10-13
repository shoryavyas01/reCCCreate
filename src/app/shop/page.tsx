import type { Metadata } from "next";
import FormShell from "@/components/FormShell";
import SampleNotice from "@/components/SampleNotice";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Shop", description: "Explore natural gulaal and compost made with care from temple-offered flowers in Jaipur." };
export const revalidate = 60;

export default async function Shop() {
  const { data: products, sample } = await getProducts();
  const available = products.filter((product) => product.in_stock);

  return <>
    <section className="section pb-12"><div className="container-site">
      <p className="eyebrow mb-6">Made with a little more meaning</p>
      <div className="grid gap-7 md:grid-cols-[1.1fr_.9fr] md:items-end"><h1 className="max-w-[10ch]">A second life, <span className="display-accent">in every color.</span></h1><p className="body-copy max-w-xl md:pb-2">Natural gulaal and compost made from flowers offered at Jaipur temples. Scan the QR code on a pack to follow its batch story.</p></div>
    </div></section>

    <section className="section-tight bg-white/55" aria-labelledby="products-heading"><div className="container-site">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow mb-4">The collection</p><h2 id="products-heading">Made thoughtfully. Shared locally.</h2></div><p className="max-w-sm text-sm leading-6 text-[#657169]">Prices and availability are shown as provided by the team.</p></div>
      {sample && <SampleNotice />}
      {products.length === 0 ? <div className="card max-w-2xl p-7"><p className="font-semibold">Our first products will be listed here soon.</p><p className="mt-2 text-sm text-[#657169]">Get in touch if you would like to know when the first collection is available.</p></div> :
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <li key={product.id} className="card flex flex-col p-4">
          {product.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.photo_url} alt={product.name} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
          ) : <div className="product-placeholder" role="img" aria-label={`Product photo coming soon: ${product.name}`}><span className="relative z-10 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-medium text-[#52665b] backdrop-blur-sm">Product photo coming soon</span><span className="absolute bottom-4 right-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#66806f]">0{index + 1}</span></div>}
          <div className="px-2 pb-2 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#8a6e4f]">{product.type}</p><h3 className="mt-2">{product.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-[#657169]">{product.ingredients || "Ingredients to be added."}</p>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-black/10 pt-4"><p><span className="text-xl font-semibold tracking-tight">{product.price_inr > 0 ? `₹${product.price_inr}` : "Price to come"}</span><span className="mt-1 block text-xs text-[#7c867f]">{product.size}</span></p>{product.in_stock ? <a href="#order" className="btn btn-primary min-h-10 px-4 py-2 text-xs">Order <span aria-hidden="true">↗</span></a> : <span className="rounded-full border border-black/15 px-3 py-2 text-xs font-medium text-[#657169]">Out of stock</span>}</div>
          </div>
        </li>)}</ul>}
    </div></section>

    <section id="order" className="section scroll-mt-20" aria-labelledby="order-heading"><div className="container-site grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
      <div className="md:sticky md:top-28 md:self-start"><p className="eyebrow mb-4">A local order, made easy</p><h2 id="order-heading">Let’s bring a little color your way.</h2><p className="body-copy mt-5">Tell us what you would like and where to bring it. The team will confirm by phone. Payment is by UPI on delivery.</p><div className="mt-6 rounded-2xl border border-[#21483b]/10 bg-[#e8eee8]/60 p-4 text-sm text-[#55665c]"><p className="font-semibold text-[#21483b]">No online payment</p><p className="mt-1">Pay by UPI when your order is delivered.</p></div></div>
      <FormShell subject="New order from the ReCCCreate website" submitLabel="Send order" thanks="We have your order and will call you to confirm it. You pay by UPI on delivery.">
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required autoComplete="name" /></div><div><label className="label" htmlFor="phone">Phone</label><input className="field" id="phone" name="phone" type="tel" required autoComplete="tel" /></div></div>
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]"><div><label className="label" htmlFor="product">Product</label><select className="field" id="product" name="product" required defaultValue=""><option value="" disabled>Choose a product</option>{available.map((product) => <option key={product.id} value={`${product.name} (${product.size})`}>{product.name} ({product.size}){product.price_inr > 0 ? `, ₹${product.price_inr}` : ""}</option>)}</select></div><div><label className="label" htmlFor="quantity">Quantity</label><input className="field" id="quantity" name="quantity" type="number" min={1} max={100} defaultValue={1} required /></div></div>
        <div><label className="label" htmlFor="delivery">Delivery area or school class</label><input className="field" id="delivery" name="delivery_area_or_class" required placeholder="For example: Bhankrota, or Class 9B" /></div><input type="hidden" name="payment" value="UPI on delivery" /><p className="text-xs text-[#657169]">Payment: by UPI on delivery.</p>
      </FormShell>
    </div></section>
  </>;
}
