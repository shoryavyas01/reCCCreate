"use client";

import { useRef, useState } from "react";
import FormConsent from "./FormConsent";
import { contactRoles, contactTopics, contactProducts, contactProductLabel, contactEmail, contactBody, contactDraft, validateContact, type ContactMessage } from "@/lib/contact";

export default function ContactForm({ deliveryEnabled }: { deliveryEnabled: boolean }) {
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ContactMessage | null>(null);
  const busy = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const result = validateContact(Object.fromEntries(new FormData(form)));
    setError(""); setDraft(null);
    if ("error" in result) { setError(result.error); return; }
    if (!deliveryEnabled) {
      setDraft(result.data);
      requestAnimationFrame(() => feedback.current?.focus());
      return;
    }
    busy.current = true; setSending(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data), signal: AbortSignal.timeout(30000) });
      const outcome = await response.json().catch(() => null);
      if (!response.ok || outcome?.ok !== true) throw new Error(outcome?.error || "Your message was not sent. Please try again.");
      setSent(true); setTopic(""); form.reset();
    } catch (problem) {
      setError(problem instanceof Error && problem.name !== "TimeoutError" ? problem.message : "Delivery timed out. It may have reached the team. Contact us by email before submitting again.");
      setDraft(result.data);
    } finally {
      busy.current = false; setSending(false);
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }
  if (sent) return <div ref={feedback} role="status" tabIndex={-1}><h2 className="text-3xl">Message sent.</h2><p className="body-copy mt-4">Thank you for contacting ReCCCreate. The team will reply to your email.</p><button className="btn btn-secondary mt-6" onClick={() => setSent(false)}>Send another message</button></div>;
  return <form className="form-shell flex flex-col gap-5" onSubmit={submit} onChange={() => { setDraft(null); setError(""); }} aria-busy={sending}>
    {!deliveryEnabled && <p className="text-sm leading-6 text-[#4e503a]">Fill in your details to prepare an email to the team. You’ll review and send it from your email app.</p>}
    <fieldset disabled={sending} className="flex min-w-0 flex-col gap-5 border-0 p-0">
      <div className="form-row"><div><label className="label" htmlFor="contact-name">Name</label><input className="field" id="contact-name" name="name" required minLength={2} maxLength={100} autoComplete="name" /></div><div><label className="label" htmlFor="contact-email">Email</label><input className="field" id="contact-email" name="email" type="email" maxLength={254} required autoComplete="email" /></div></div>
      <div><label className="label" htmlFor="contact-phone">Phone (optional)</label><input className="field" id="contact-phone" name="phone" type="tel" maxLength={25} autoComplete="tel" /></div>
      <div className="form-row"><div><label className="label" htmlFor="contact-role">I am a…</label><select className="field" id="contact-role" name="role" required defaultValue=""><option value="" disabled>Choose one</option>{contactRoles.map((role) => <option key={role}>{role}</option>)}</select></div><div><label className="label" htmlFor="contact-topic">What is this about?</label><select className="field" id="contact-topic" name="topic" required value={topic} onChange={(event) => setTopic(event.target.value)}><option value="" disabled>Choose one</option>{contactTopics.map((topic) => <option key={topic}>{topic}</option>)}</select></div></div>
      {topic === "Buying" && <div><label className="label" htmlFor="contact-product">Product</label><select className="field" id="contact-product" name="product" required defaultValue=""><option value="" disabled>Choose a product</option>{contactProducts.map((product) => <option key={product.id} value={product.id}>{contactProductLabel(product.id)}</option>)}</select></div>}
      <div><label className="label" htmlFor="contact-message">Message</label><textarea className="field min-h-40 resize-y" id="contact-message" name="message" rows={6} minLength={10} maxLength={5000} required placeholder="Tell us what you have in mind…" /></div>
      <FormConsent />
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" className="btn btn-primary self-start">{sending ? "Sending…" : deliveryEnabled ? "Send message" : "Prepare email"} </button>
    </fieldset>
    {(draft || error) && <div ref={feedback} tabIndex={-1} role={error ? "alert" : "status"} className="contact-feedback border border-black/15 bg-[#fff5df] p-5">{error && <p className="text-sm text-error">{error}</p>}{draft && <><h3 className="mt-2 text-2xl">Your email draft is ready.</h3><p className="mt-3 text-sm leading-6">Open your email app, review the message and press send there. Your message has not been sent yet.</p><a className="btn btn-primary mt-4" href={contactDraft(draft)}>Open email app </a><details className="mt-5 text-sm"><summary className="cursor-pointer font-semibold">View or copy your message</summary><p className="mt-3 break-all">To: {contactEmail}</p><pre className="mt-3 whitespace-pre-wrap font-sans leading-6">{contactBody(draft)}</pre></details></>}</div>}
    <p className="text-xs leading-6 text-[#4e503a]">Your details are used to respond to your enquiry.</p>
  </form>;
}
