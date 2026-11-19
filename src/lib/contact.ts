import { postForm } from "./postForm";

/* Contact form: shared field rules plus the browser-side sender. */

export const roles = ["Temple", "Buyer", "School", "Recycling unit or NGO", "Volunteer", "Other"] as const;
export const topics = ["Buying", "Partnering", "Collecting from my temple", "Volunteering", "Other"] as const;

export type ContactMessage = { name: string; email: string; phone: string; role: string; topic: string; message: string };

export function validateContact(input: Record<string, unknown>): { data: ContactMessage } | { error: string } {
  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string).trim() : "");
  const data = {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    role: text("i_am_a"),
    topic: text("about"),
    message: text("message"),
  };
  if (data.name.length < 2 || data.name.length > 100) return { error: "Please enter your name." };
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "Please enter a valid email address." };
  if (data.phone.length > 30) return { error: "Please check your phone number." };
  if (!roles.includes(data.role as (typeof roles)[number])) return { error: "Please choose what describes you." };
  if (!topics.includes(data.topic as (typeof topics)[number])) return { error: "Please choose what your message is about." };
  if (data.message.length < 10 || data.message.length > 5000) return { error: "Please write a message of at least 10 characters." };
  return { data };
}

export async function sendContact(form: HTMLFormElement): Promise<void> {
  await postForm("/api/contact", form, "Your message was not sent. Please try again.");
}
