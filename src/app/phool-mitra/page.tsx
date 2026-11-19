import type { Metadata } from "next";
import PhoolMitraForm from "@/components/PhoolMitraForm";
import { sheetConfigured } from "@/lib/sheet";

export const metadata: Metadata = { title: "Become a Phool Mitra", description: "Collect temple flowers near your home in Jaipur, bring them to a drop-off point, and earn credits for ReCCCreate products." };

const steps = [
  { title: "Sign up", text: "Fill in the form on this page. We will message you on WhatsApp." },
  { title: "Collect", text: "Pick up discarded flowers from a temple near your home." },
  { title: "Drop off and weigh", text: "Bring them to a drop-off point, where they are weighed in front of you." },
  { title: "Earn credits", text: "Every verified kilo earns credits. No weigh-in means no credits." },
  { title: "Redeem", text: "Use credits for our rangoli colour and compost at 57% off the market price." },
];

export default function PhoolMitra() {
  return <section className="section"><div className="container-site two-column">
    <div className="contact-intro"><p className="eyebrow mb-5">Phool Mitra · flower friend</p><h1 className="max-w-[10ch]">Collect flowers <span className="display-accent">near your home.</span></h1><p className="body-copy mt-6">Phool Mitra is our community collection programme. Instead of vans and hired workers, people across Jaipur collect temple flowers in their own neighbourhood, and every verified kilo earns credits.</p>
      <ol className="mt-8 flex flex-col gap-5 border-t border-black/10 pt-6">{steps.map((step, i) => <li key={step.title} className="flex gap-4"><span className="font-display text-2xl leading-none text-[var(--marigold)]" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><p className="font-medium">{step.title}</p><p className="mt-1 text-sm leading-6 text-[#4e503a]">{step.text}</p></div></li>)}</ol>
    </div>
    <div className="card form-panel"><p className="mb-6 text-sm text-[#4e503a]">Sign up in a minute. We coordinate everything over WhatsApp, so please give a number you use there.</p>
      <PhoolMitraForm disabledReason={sheetConfigured ? undefined : "Phool Mitra sign-ups open soon. Please check back in a few days."} />
    </div>
  </div></section>;
}
