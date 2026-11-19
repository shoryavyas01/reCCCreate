import { pageMetadata } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import { contactEmail } from "@/lib/contact";
import { sheetConfigured } from "@/lib/sheet";
import { projectLocation } from "@/lib/team";

export const metadata = pageMetadata('Contact our team', 'Contact ReCCCreate at Dharav High School, Bhankrota, Jaipur, about rangoli colours, flower compost, temple partnerships, volunteering or order support.', '/contact');
export default function Contact() {
  const deliveryEnabled = sheetConfigured;
  return <section className="section"><div className="container-site two-column">
    <div className="contact-intro"><p className="eyebrow mb-5">Start a conversation</p><h1 className="max-w-[9ch]">Good things <span className="display-accent">grow together.</span></h1><p className="body-copy mt-6">Whether you look after a temple, want to buy rangoli colour, or would like to help, we would love to hear from you.</p><div className="mt-8 border-t border-black/10 pt-5"><p className="eyebrow">Find our team</p><p className="mt-3 font-medium">{projectLocation}</p><a href={`mailto:${contactEmail}`} className="journey-link mt-5 break-all">{contactEmail} </a></div><p className="mt-6 max-w-sm text-sm leading-6 text-[#4e503a]">Contact us about products, temple collections, school partnerships or volunteering.</p></div>
    <div className="card form-panel"><ContactForm deliveryEnabled={deliveryEnabled} /></div>
  </div></section>;
}
