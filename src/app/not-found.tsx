import Link from "next/link";
import BotanicalMotif from "@/components/BotanicalMotif";
export default function NotFound() {
  return <section className="section"><div className="container-site state-page"><BotanicalMotif className="state-flower" /><p className="eyebrow mb-5">404 / Page not found</p><h1>This path hasn’t <span className="display-accent">bloomed yet.</span></h1><p className="body-copy mt-6">This page may have moved or the address may be incorrect. Explore the shop, return home or contact our team for help.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="btn btn-primary">Back to home</Link><Link href="/shop" className="btn btn-secondary">Explore the shop</Link><Link href="/contact" className="btn btn-secondary">Ask the team</Link></div></div></section>;
}
