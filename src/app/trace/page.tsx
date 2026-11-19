import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BatchLookup from "@/components/BatchLookup";
import TempleCards from "@/components/TempleCards";
import { productTraces } from "@/lib/traces";
import { getTemples } from "@/lib/data";

export const metadata: Metadata = { title: "Traceability", description: "Explore every ReCCCreate product, its recorded batch details, our temples and our student team." };
export const revalidate = 60;
export default async function Traceability() {
  const { data: temples } = await getTemples();
  return <><section className="section"><div className="container-site">
    <p className="eyebrow mb-5">Every product has a story</p><div className="page-intro"><h1>Follow the <span className="display-accent">flower.</span></h1><p className="body-copy">From temple offerings to rangoli colour and compost. Explore the details on each product’s packaging and meet the people behind the work.</p></div>
    <div className="mt-10 max-w-2xl"><BatchLookup /></div>
    <ul className="mt-12 grid gap-6 md:grid-cols-3">{productTraces.map((record) => <li key={record.id} className="card overflow-hidden"><div className="relative aspect-[4/3] bg-[#ecd4a9]"><Image src={record.product.photo_url!} alt={record.product.name} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-contain" /></div><div className="p-6"><p className="eyebrow">{record.kind}{record.batch ? ` · ${record.batch}` : ""}</p><h2 className="mt-3 text-3xl">{record.product.name}</h2><Link href={`/trace/${record.id}`} className="journey-link mt-5">Explore the journey ↗</Link></div></li>)}</ul>
  </div></section><section className="section"><div className="container-site"><p className="eyebrow mb-4">Our collection circle</p><h2 className="mb-8">Temples of <span className="display-accent">Jaipur.</span></h2><TempleCards temples={temples} /><p className="mt-6 text-sm text-[#4e503a]">Temple names describe our collection circle. A temple is linked to an individual batch only when its collection record is available.</p></div></section></>;
}
