import { postForm } from "./postForm";
import { normalisePhone } from "./phoolMitra";
import type { Product } from "./types";

/* Shop order request: field rules plus the browser-side sender.
   The product, price and total come from our own product list, never from the browser. */

export type OrderRequest = {
  name: string;
  phone: string;
  product: string;
  size: string;
  quantity: string;
  price: string;
  total: string;
  delivery: string;
  payment: string;
};

export function validateOrder(input: Record<string, unknown>, products: Product[]): { data: OrderRequest } | { error: string } {
  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string).trim() : "");
  const name = text("name");
  const rawPhone = text("phone");
  const delivery = text("delivery_area_or_class");
  const quantity = Number(text("quantity"));
  const product = products.find((p) => p.id === text("product") && p.in_stock);

  if (name.length < 2 || name.length > 100) return { error: "Please enter your name." };
  // Indian mobiles are tidied to +91 XXXXX XXXXX; other numbers are kept as typed.
  const phone = normalisePhone(rawPhone) ?? (/^[+0-9 ()-]{10,20}$/.test(rawPhone) ? rawPhone : null);
  if (!phone) return { error: "Please enter a phone number we can call." };
  if (!product) return { error: "Please choose a product that is in stock." };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return { error: "Please enter a quantity from 1 to 100." };
  if (delivery.length < 2 || delivery.length > 300) return { error: "Please enter your delivery area or school class." };

  const priced = product.price_inr > 0;
  return {
    data: {
      name,
      phone,
      product: product.name,
      size: product.size,
      quantity: String(quantity),
      price: priced ? String(product.price_inr) : "To be confirmed",
      total: priced ? String(product.price_inr * quantity) : "To be confirmed",
      delivery,
      payment: "UPI on delivery",
    },
  };
}

export async function sendOrder(form: HTMLFormElement): Promise<void> {
  await postForm("/api/order", form, "Your order request was not sent. Please try again.");
}
