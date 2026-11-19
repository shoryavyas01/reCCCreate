import { catalogueProducts } from "./catalogue";

export const contactEmail = "recccreate@gmail.com";
export const contactRoles = ["Temple", "Buyer", "School", "Recycling unit or NGO", "Volunteer", "Other"];
export const contactTopics = ["Buying", "Partnering", "Collecting from my temple", "Volunteering", "Other"];
export const contactProducts = catalogueProducts.map((product) => ({ id: product.traceId!, name: product.name, price: product.price_inr }));
export function contactProductLabel(id: string) {
  const product = contactProducts.find((item) => item.id === id);
  return product ? `${product.name} (MRP ₹${product.price})` : "";
}
export type ContactMessage = { name: string; email: string; phone: string; role: string; topic: string; product: string; message: string };
export function validateContact(input: unknown): { data: ContactMessage } | { error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Please check your contact details." };
  const raw = input as Record<string, unknown>;
  if (raw.botcheck) return { error: "Your message could not be submitted." };
  const read = (key: string) => typeof raw[key] === "string" ? raw[key].trim() : "";
  const data = { name: read("name"), email: read("email"), phone: read("phone"), role: read("role") || read("i_am_a"), topic: read("topic") || read("about"), message: read("message") };
  const product = data.topic === "Buying" ? read("product") : "";
  if (data.name.length < 2 || data.name.length > 100) return { error: "Enter a name between 2 and 100 characters." };
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "Enter a valid email address." };
  if (data.phone && !/^[+0-9 ()-]{7,25}$/.test(data.phone)) return { error: "Check your phone number, or leave it blank." };
  if (!contactRoles.includes(data.role) || !contactTopics.includes(data.topic)) return { error: "Choose your role and enquiry topic." };
  if (data.topic === "Buying" && !contactProducts.some((item) => item.id === product)) return { error: "Choose the product you would like to buy." };
  if (data.message.length < 10 || data.message.length > 5000) return { error: "Write a message between 10 and 5,000 characters." };
  return { data: { ...data, product } };
}
export function contactBody(data: ContactMessage) {
  return `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nRole: ${data.role}\nTopic: ${data.topic}${data.product ? `\nProduct: ${contactProductLabel(data.product)}` : ""}\n\n${data.message}`;
}
export function contactDraft(data: ContactMessage) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(`ReCCCreate enquiry: ${data.topic}`)}&body=${encodeURIComponent(contactBody(data))}`;
}
