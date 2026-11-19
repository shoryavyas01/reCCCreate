import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { sheetConfigured } from "@/lib/sheet";

export const metadata: Metadata = { title: "Contact", description: "Talk with the ReCCCreate student team about temple partnerships, rangoli colour, volunteering, and more." };

export default function Contact() {
  return <section className="section"><div className="container-site two-column">
    <div className="contact-intro"><p className="eyebrow mb-5">Start a conversation</p><h1 className="max-w-[9ch]">Good things <span className="display-accent">grow together.</span></h1><p className="body-copy mt-6">Whether you look after a temple, want to buy rangoli colour, or would like to help, we would love to hear from you.</p><div className="mt-8 border-t border-black/10 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#4e503a]">Based in</p><p className="mt-2 font-medium">Bhankrota, Jaipur</p><p className="mt-1 text-sm text-[#4e503a]">A student venture from Dharav High School</p></div><p className="mt-6 max-w-sm text-sm leading-6 text-[#4e503a]">We read every message and reply by email or phone.</p></div>
    <div className="card form-panel"><p className="mb-6 text-sm text-[#4e503a]">A few details will help us get back to you with the right information.</p>
      <ContactForm disabledReason={sheetConfigured ? undefined : "Messages are temporarily unavailable. Please check back once the team opens enquiries."} />
    </div>
  </div></section>;
}
