import type { Metadata } from "next";
import FormShell from "@/components/FormShell";
import PhotoPanel from "@/components/PhotoPanel";
import SampleNotice from "@/components/SampleNotice";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Shop" };
export const revalidate = 60;

export default async function Shop() {
  const { data: products, sample } = await getProducts();
  const available = products.filter((p) => p.in_stock);

  return (
    <>
      <section className="section">
        <div className="container-site">
          <h1>Shop</h1>
          <p className="mt-5 max-w-2xl">
            Natural gulaal and compost made from flowers offered at Jaipur temples. Every pack carries a QR code
            showing the temple and date its flowers came from.
          </p>

          <div className="mt-10">
            {sample && <SampleNotice />}
            {products.length === 0 ? (
              <p className="card max-w-xl">Our first products will be listed here soon.</p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <li key={p.id} className="card flex flex-col gap-4">
                    <PhotoPanel src={p.photo_url} alt={p.name} ratio="aspect-square" />
                    <div>
                      <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-green">{p.type}</p>
                      <h3>{p.name}</h3>
                    </div>
                    <p className="text-[15px]">
                      <span className="font-extrabold">Ingredients:</span> {p.ingredients || "To be added"}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-3">
                      <p>
                        <span className="text-2xl font-extrabold">
                          {p.price_inr > 0 ? `₹${p.price_inr}` : "Price to come"}
                        </span>
                        <span className="block text-[15px]">{p.size}</span>
                      </p>
                      {p.in_stock ? (
                        <a href="#order" className="btn btn-primary">Order</a>
                      ) : (
                        <span className="rounded-xl border-2 border-ink/50 px-3 py-2 text-[15px] font-extrabold">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section id="order" className="section scroll-mt-16 bg-white/50" aria-labelledby="order-heading">
        <div className="container-site grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="order-heading">Place an order</h2>
            <p className="mt-4">
              Tell us what you would like and where to bring it. We will confirm by phone. You pay by UPI when your
              order is delivered.
            </p>
          </div>

          <FormShell
            subject="New order from the ReCCCreate website"
            submitLabel="Send order"
            thanks="We have your order and will call you to confirm it. You pay by UPI on delivery."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Name</label>
                <input className="field" id="name" name="name" required autoComplete="name" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input className="field" id="phone" name="phone" type="tel" required autoComplete="tel" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
              <div>
                <label className="label" htmlFor="product">Product</label>
                <select className="field" id="product" name="product" required defaultValue="">
                  <option value="" disabled>Choose a product</option>
                  {available.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.size})`}>
                      {p.name} ({p.size}){p.price_inr > 0 ? `, ₹${p.price_inr}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="quantity">Quantity</label>
                <input className="field" id="quantity" name="quantity" type="number" min={1} max={100} defaultValue={1} required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="delivery">Delivery area or school class</label>
              <input className="field" id="delivery" name="delivery_area_or_class" required placeholder="For example: Bhankrota, or Class 9B" />
            </div>
            <input type="hidden" name="payment" value="UPI on delivery" />
            <p className="text-[15px]">Payment: by UPI on delivery.</p>
          </FormShell>
        </div>
      </section>
    </>
  );
}
