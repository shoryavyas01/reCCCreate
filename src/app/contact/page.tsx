import type { Metadata } from "next";
import FormShell from "@/components/FormShell";

export const metadata: Metadata = { title: "Contact Us" };

const roles = ["Temple", "Buyer", "School", "Recycling unit or NGO", "Volunteer", "Other"];
const topics = ["Buying", "Partnering", "Collecting from my temple", "Volunteering", "Other"];

export default function Contact() {
  return (
    <section className="section">
      <div className="container-site grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h1>Contact Us</h1>
          <p className="mt-5">
            Whether you look after a temple, want to buy gulaal, or would like to help, we would love to hear from you.
            We read every message and reply by email.
          </p>
        </div>

        <FormShell
          subject="New message from the ReCCCreate website"
          submitLabel="Send message"
          thanks="Your message has reached the ReCCCreate team. We will get back to you soon."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input className="field" id="name" name="name" required autoComplete="name" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input className="field" id="email" name="email" type="email" required autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input className="field" id="phone" name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="role">I am a…</label>
              <select className="field" id="role" name="i_am_a" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="topic">What is this about?</label>
              <select className="field" id="topic" name="about" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {topics.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="message">Message</label>
            <textarea className="field" id="message" name="message" rows={6} required />
          </div>
        </FormShell>
      </div>
    </section>
  );
}
