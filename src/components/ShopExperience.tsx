"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import BotanicalMotif from "./BotanicalMotif";
import PhotoPanel from "./PhotoPanel";
import FormShell from "./FormShell";
import SampleNotice from "./SampleNotice";

type Filter = "all" | "gulaal" | "compost";
export default function ShopExperience({ products, sample, initialFilter }: { products: Product[]; sample: boolean; initialFilter: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const order = useRef<HTMLElement>(null);
  const available = products.filter((p) => p.in_stock);
  const visible = products.filter((p) => filter === "all" || p.type === filter);
  const product = available.find((p) => p.id === selected);
  const reason = sample ? "These are sample products. Orders open once the team publishes the live collection." : available.length === 0 ? "Orders are paused while products are out of stock. Please check back soon." : undefined;
  function choose(id: string) {
    setSelected(id);
    setQuantity(1);
    order.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    // Focus the first field without interrupting the scroll.
    order.current?.querySelector<HTMLInputElement>("#order-name")?.focus({ preventScroll: true });
  }
  return <>
    <section className="section-tight bg-[#ebe9dd]" aria-labelledby="products-heading"><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">The collection</p><h2 id="products-heading">Colour and care,<br /><span className="display-accent">from the same petals.</span></h2></div><p className="max-w-xs text-sm leading-7 text-[#646c59]">Local order requests. The team confirms price, availability and delivery before you pay.</p></div>
      {sample && <SampleNotice />}
      <div className="shop-filters" role="group" aria-label="Filter products">{(["all", "gulaal", "compost"] as Filter[]).map((value) => <button type="button" className="filter-button" aria-pressed={filter === value} key={value} onClick={() => setFilter(value)}>{value === "all" ? "All products" : value === "gulaal" ? "Natural gulaal" : "Flower compost"}</button>)}</div>
      <p className="sr-only" aria-live="polite">{visible.length} products shown</p>
      {visible.length === 0 ? <div className="card p-8"><h3>{products.length ? "No products in this collection yet." : "Our collection is being prepared."}</h3><p className="body-copy mt-3">Check back soon or contact the team for availability.</p>{filter !== "all" && <button className="btn btn-secondary mt-5" onClick={() => setFilter("all")}>Show all products</button>}</div> : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <li key={item.id} className="flex flex-col border border-black/15 bg-[#f6f1e7]">
        {item.photo_url ? <PhotoPanel src={item.photo_url} alt={item.name} ratio="aspect-square" /> : <div className={`product-placeholder ${item.type === "compost" ? "compost" : item.name.toLowerCase().includes("rose") ? "rose" : ""}`}><BotanicalMotif className="product-botanical" /><span className="product-art-label">Botanical illustration · {item.type}</span></div>}
        <div className="flex flex-1 flex-col p-6"><p className="eyebrow">{item.type} · {item.size}</p><h3 className="mt-3 font-display text-3xl font-normal">{item.name}</h3><p className="mt-3 flex-1 text-sm leading-7 text-[#646c59]">{item.ingredients || "Ask the team for ingredient details."}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-black/15 pt-5"><p className="text-base font-medium">{item.price_inr > 0 ? `₹${item.price_inr.toLocaleString("en-IN")}` : "Price on request"}</p>{item.in_stock ? <button className="btn btn-primary min-h-10 px-4 py-2" onClick={() => choose(item.id)} aria-label={`${sample ? "View" : "Order"} ${item.name}`}>{sample ? "View sample" : "Request order"} ↗</button> : <span className="text-xs text-[#646c59]">Out of stock</span>}</div></div>
      </li>)}</ul>}
    </div></section>
    <section ref={order} id="order" className="section" aria-labelledby="order-heading"><div className="container-site grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
      <div><p className="eyebrow mb-5">From our circle to yours</p><h2 id="order-heading">Bring a little<br /><span className="display-accent">colour home.</span></h2><p className="body-copy mt-5">Send a request and the team will call to confirm the details. Payment is by UPI on delivery.</p><p className="mt-6 border-t border-black/15 pt-5 text-sm text-[#646c59]">No payment is collected on this website.</p></div>
      <FormShell subject="New order from the ReCCCreate website" submitLabel="Request order" thanks="Your request has reached the team. We will call to confirm price, availability and delivery before payment." disabledReason={reason} onSent={() => { setSelected(""); setQuantity(1); }}>
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="label" htmlFor="order-name">Name</label><input className="field" id="order-name" name="name" minLength={2} maxLength={100} required autoComplete="name" /></div><div><label className="label" htmlFor="order-phone">Phone</label><input className="field" id="order-phone" name="phone" type="tel" pattern="[+0-9 ()-]{10,20}" title="Enter a phone number with 10 to 20 characters, including country code if needed." maxLength={20} required autoComplete="tel" /></div></div>
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]"><div><label className="label" htmlFor="order-product">Product</label><select className="field" id="order-product" name="product" required value={selected} onChange={(e) => setSelected(e.target.value)}><option value="" disabled>Choose a product</option>{available.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.size}){p.price_inr > 0 ? `, ₹${p.price_inr}` : ""}</option>)}</select></div><div><label className="label" htmlFor="order-quantity">Quantity</label><input className="field" id="order-quantity" name="quantity" type="number" min={1} max={100} step={1} value={Number.isFinite(quantity) ? quantity : ""} onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)} required /></div></div>
        {product && <div className="order-summary" role="status"><strong>{product.name}</strong><p>{Number.isFinite(quantity) && quantity >= 1 && quantity <= 100 ? `${quantity} × ${product.size}` : "Enter a quantity from 1 to 100"}{product.price_inr > 0 && Number.isFinite(quantity) && quantity >= 1 && quantity <= 100 ? ` · Product total ₹${(product.price_inr * quantity).toLocaleString("en-IN")}` : " · Price confirmed by the team"}</p><p className="mt-1 text-xs">Delivery arrangements and final price are confirmed by phone.</p></div>}
        <div><label className="label" htmlFor="order-delivery">Delivery area or school class</label><input className="field" id="order-delivery" name="delivery_area_or_class" required maxLength={300} placeholder="For example: Bhankrota, or Class 9B" /></div>
        <input type="hidden" name="product_details" value={product ? `${product.name} (${product.size})` : ""} /><input type="hidden" name="payment" value="UPI on delivery" />
      </FormShell>
    </div></section>
  </>;
}
