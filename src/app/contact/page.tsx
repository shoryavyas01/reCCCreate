import type { Metadata } from "next";
import FormShell from "@/components/FormShell";

export const metadata: Metadata = { title: "Contact", description: "Talk with the ReCCCreate student team about temple partnerships, gulaal, volunteering, and more." };
const roles = ["Temple", "Buyer", "School", "Recycling unit or NGO", "Volunteer", "Other"];
const topics = ["Buying", "Partnering", "Collecting from my temple", "Volunteering", "Other"];

export default function Contact() {
  return <section className="section"><div className="container-site grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
    <div className="md:sticky md:top-28 md:self-start"><p className="eyebrow mb-5">Start a conversation</p><h1 className="max-w-[9ch]">Good things <span className="display-accent">grow together.</span></h1><p className="body-copy mt-6">Whether you look after a temple, want to buy gulaal, or would like to help, we would love to hear from you.</p><div className="mt-8 border-t border-black/10 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7c867f]">Based in</p><p className="mt-2 font-medium">Bhankrota, Jaipur</p><p className="mt-1 text-sm text-[#657169]">A student venture from Dharav High School</p></div><p className="mt-6 max-w-sm text-sm leading-6 text-[#657169]">We read every message and reply by email.</p></div>
    <div className="card p-5 sm:p-8 md:p-9"><p className="mb-6 text-sm text-[#657169]">A few details will help us get back to you with the right information.</p>
      <FormShell subject="New message from the ReCCCreate website" submitLabel="Send message" thanks="Your message has reached the ReCCCreate team. We will get back to you soon.">
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" /></div><div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" maxLength={254} required autoComplete="email" /></div></div>
        <div><label className="label" htmlFor="phone">Phone <span className="font-normal text-[#87928a]">(optional)</span></label><input className="field" id="phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label className="label" htmlFor="role">I am a…</label><select className="field" id="role" name="i_am_a" required defaultValue=""><option value="" disabled>Choose one</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></div><div><label className="label" htmlFor="topic">What is this about?</label><select className="field" id="topic" name="about" required defaultValue=""><option value="" disabled>Choose one</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</select></div></div>
        <div><label className="label" htmlFor="message">Message</label><textarea className="field min-h-40 resize-y" id="message" name="message" rows={6} minLength={10} maxLength={5000} required placeholder="Tell us a little about what you have in mind…" /></div>
      </FormShell>
    </div>
  </div></section>;
}
