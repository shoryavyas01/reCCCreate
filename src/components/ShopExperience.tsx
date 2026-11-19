"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productTypeLabel } from "@/lib/products";
import BotanicalMotif from "./BotanicalMotif";
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import FormShell from "./FormShell";
import { sendOrder } from "@/lib/order";
import FormConsent from "./FormConsent";

type Filter = "all" | "gulaal" | "compost";
export default function ShopExperience({ products, catalogueOnly, initialFilter, ordersOpen }: { products: Product[]; catalogueOnly: boolean; initialFilter: Filter; ordersOpen: boolean }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const order = useRef<HTMLElement>(null);
  const available = products.filter((p) => p.in_stock);
  const visible = products.filter((p) => filter === "all" || p.type === filter);
  const product = available.find((p) => p.id === selected);
  const reason = !ordersOpen ? "Online order requests are not open yet. Please contact the team for availability." : available.length === 0 ? "Orders are paused while products are out of stock. Please check back soon." : undefined;
  function choose(id: string) {
    setSelected(id);
    setQuantity(1);
    order.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    // Focus the first field without interrupting the scroll.
    order.current?.querySelector<HTMLInputElement>("#order-name")?.focus({ preventScroll: true });
  }
  return <>
    <section className="section-tight bg-[#d5b57d]" aria-labelledby="products-heading"><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">The collection</p><h2 id="products-heading">Colour and care,<br /><span className="display-accent">from the same petals.</span></h2></div><p className="max-w-xs text-sm leading-7 text-[#4e503a]">Local order requests. The team confirms price, availability and delivery before you pay.</p></div>
      {catalogueOnly && !ordersOpen && <p className="catalogue-note">Explore the collection. Contact the team to confirm availability and place an order.</p>}
      <div className="shop-filters" role="group" aria-label="Filter products">{(["all", "gulaal", "compost"] as Filter[]).map((value) => <button type="button" className="filter-button" aria-pressed={filter === value} key={value} onClick={() => setFilter(value)}>{value === "all" ? "All products" : value === "gulaal" ? "Rangoli colour" : "Flower compost"}</button>)}</div>
      <p className="sr-only" aria-live="polite">{visible.length} products shown</p>
      {visible.length === 0 ? <div className="card p-8"><h3>{products.length ? "No products in this collection yet." : "Our collection is being prepared."}</h3><p className="body-copy mt-3">Check back soon or contact the team for availability.</p>{filter !== "all" && <button className="btn btn-secondary mt-5" onClick={() => setFilter("all")}>Show all products</button>}</div> : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item) => <li key={item.id} id={item.slug} className="product-card flex flex-col border border-black/15 bg-[#ecd4a9]">
        {item.images?.length || item.photo_url ? <ProductGallery name={item.name} images={item.images?.length ? item.images : [{ src: item.photo_url!, label: "Front", alt: item.name }]} /> : <div className={`product-placeholder ${item.type === "compost" ? "compost" : item.name.toLowerCase().includes("rose") ? "rose" : ""}`}><BotanicalMotif className="product-botanical" variant={item.type === "compost" ? "sprout" : "marigold"} /><span className="product-art-label">Botanical illustration · {productTypeLabel(item.type)}</span></div>}
        <div className="flex flex-1 flex-col p-6"><p className="eyebrow">{productTypeLabel(item.type)} · {item.size}</p><h3 className="mt-3 font-display text-3xl font-normal">{item.name}</h3><p className="product-ingredients mt-3 text-sm leading-7 text-[#4e503a]"><strong>Ingredients:</strong> {item.ingredients || "Ask the team for ingredient details."}</p><ProductDetails product={item} /><div className="product-actions mt-auto border-t border-black/15 pt-5"><p className="text-base font-medium">{item.price_inr > 0 ? `${catalogueOnly ? "MRP " : ""}₹${item.price_inr.toLocaleString("en-IN")}` : "Price on request"}</p>{item.in_stock ? !ordersOpen ? <Link href="/contact" className="btn btn-primary min-h-10 px-4 py-2" aria-label={`Enquire about ${item.name}`}>Enquire</Link> : <button className="btn btn-primary min-h-10 px-4 py-2" onClick={() => choose(item.id)} aria-label={`Order ${item.name}`}>Request order</button> : <span className="text-xs text-[#4e503a]">Out of stock</span>}</div></div>
      </li>)}</ul>}
    </div></section>
    <section ref={order} id="order" className="section" aria-labelledby="order-heading"><div className="container-site two-column">
      <div><p className="eyebrow mb-5">From our circle to yours</p><h2 id="order-heading">Bring a little<br /><span className="display-accent">colour home.</span></h2><p className="body-copy mt-5">Send a request and the team will call to confirm the details. Payment is arranged with the team on delivery.</p><p className="mt-6 border-t border-black/15 pt-5 text-sm text-[#4e503a]">No payment is collected on this website.</p></div>
      <div className="card form-panel"><FormShell send={sendOrder} submitLabel="Request order" thanks="Your request has reached the team. We will call to confirm price, availability and delivery before payment." disabledReason={reason} onSent={() => { setSelected(""); setQuantity(1); }}>
        <div className="form-row"><div><label className="label" htmlFor="order-name">Name</label><input className="field" id="order-name" name="name" minLength={2} maxLength={100} required autoComplete="name" /></div><div><label className="label" htmlFor="order-phone">Phone</label><input className="field" id="order-phone" name="phone" type="tel" pattern="[+0-9 ()-]{10,20}" title="Enter a phone number with 10 to 20 characters, including country code if needed." maxLength={20} required autoComplete="tel" /></div></div>
        <div className="form-row form-row-quantity"><div><label className="label" htmlFor="order-product">Product</label><select className="field" id="order-product" name="product" required value={selected} onChange={(e) => setSelected(e.target.value)}><option value="" disabled>Choose a product</option>{available.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.size}){p.price_inr > 0 ? `, ₹${p.price_inr}` : ""}</option>)}</select></div><div><label className="label" htmlFor="order-quantity">Quantity</label><input className="field" id="order-quantity" name="quantity" type="number" min={1} max={100} step={1} value={Number.isFinite(quantity) ? quantity : ""} onChange={(e) => setQuantity(e.currentTarget.valueAsNumber)} required /></div></div>
        {product && <div className="order-summary" role="status"><strong>{product.name}</strong><p>{Number.isFinite(quantity) && quantity >= 1 && quantity <= 100 ? `${quantity} × ${product.size}` : "Enter a quantity from 1 to 100"}{product.price_inr > 0 && Number.isFinite(quantity) && quantity >= 1 && quantity <= 100 ? ` · Product total ₹${(product.price_inr * quantity).toLocaleString("en-IN")}` : " · Price confirmed by the team"}</p><p className="mt-1 text-xs">Delivery arrangements and final price are confirmed by phone.</p></div>}
        <div><label className="label" htmlFor="order-delivery">Delivery area or school class</label><input className="field" id="order-delivery" name="delivery_area_or_class" required maxLength={300} placeholder="For example: Dharav High School, Bhankrota, or Class 9B" /></div>
        <FormConsent order />
      </FormShell></div>
    </div></section>
  </>;
}
