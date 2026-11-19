"use client";

import FormShell from "./FormShell";
import { roles, sendContact, topics } from "@/lib/contact";

export default function ContactForm({ disabledReason }: { disabledReason?: string }) {
  return <FormShell send={sendContact} disabledReason={disabledReason} subject="New message from the ReCCCreate website" submitLabel="Send message" thanks="Your message has reached the ReCCCreate team. We will get back to you soon.">
    <div className="form-row"><div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" /></div><div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" maxLength={254} required autoComplete="email" /></div></div>
    <div><label className="label" htmlFor="phone">Phone <span className="font-normal text-[#5d614b]">(optional)</span></label><input className="field" id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" /></div>
    <div className="form-row"><div><label className="label" htmlFor="role">I am a…</label><select className="field" id="role" name="i_am_a" required defaultValue=""><option value="" disabled>Choose one</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></div><div><label className="label" htmlFor="topic">What is this about?</label><select className="field" id="topic" name="about" required defaultValue=""><option value="" disabled>Choose one</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></div></div>
    <div><label className="label" htmlFor="message">Message</label><textarea className="field min-h-40 resize-y" id="message" name="message" rows={6} minLength={10} maxLength={5000} required placeholder="Tell us a little about what you have in mind…" /></div>
  </FormShell>;
}
