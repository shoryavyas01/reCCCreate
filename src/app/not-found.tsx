import Link from "next/link";
import BotanicalMotif from "@/components/BotanicalMotif";
import BatchLookup from "@/components/BatchLookup";

export default function NotFound() {
  return <section className="section"><div className="container-site state-page"><BotanicalMotif className="state-flower" /><p className="eyebrow mb-5">404 / A missing petal</p><h1>This path hasn’t <span className="display-accent">bloomed yet.</span></h1><p className="body-copy mt-6">We couldn’t find that page or batch. If you scanned a pack, check the printed batch ID and try it below. Its record may not have been added yet.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="btn btn-primary">Back to home ↗</Link><Link href="/contact" className="btn btn-secondary">Ask the team</Link></div><div className="mt-10 max-w-xl"><BatchLookup /></div></div></section>;
}
