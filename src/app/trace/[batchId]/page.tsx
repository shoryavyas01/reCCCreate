import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SampleNotice from "@/components/SampleNotice";
import { getBatch } from "@/lib/data";
import { formatDate, formatKg } from "@/lib/format";

export const metadata: Metadata = { title: "Trace your pack", description: "Follow the story and origin of a ReCCCreate product batch." };
export const revalidate = 60;

export default async function Trace({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const { data: batch, sample } = await getBatch(batchId);
  if (!batch) notFound();
  const rows = [
    { label: "Product", value: batch.product ? `${batch.product.name} (${batch.product.size})` : "ReCCCreate product" },
    // A temple that has not agreed to be named is not shown by name.
    { label: "Temple", value: batch.temple ? `${batch.temple.name}, ${batch.temple.area}` : "A partner temple in Jaipur" },
    { label: "Flowers collected on", value: formatDate(batch.collected_on) },
    { label: "Flowers used", value: `${formatKg(Number(batch.kg_flowers_used))} kg` },
    { label: "Made by", value: batch.made_by || "The ReCCCreate team" },
  ];

  return <section className="section"><div className="container-site max-w-3xl">
    <p className="eyebrow mb-4">A story worth following</p>
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><h1 className="max-w-[11ch]">Where your pack <span className="display-accent">began.</span></h1><p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7c867f]">Batch {batch.id}</p></div>
    <p className="body-copy mb-8 max-w-2xl">The flowers in this pack were offered at a temple, collected by our team and given a second life.</p>
    {sample && <SampleNotice />}
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-[#e0c497]">
      <div className="flex items-center gap-4 border-b border-black/10 px-5 py-5 sm:px-7"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8eee8] text-[#21483b]" aria-hidden="true">✳</span><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7c867f]">Traceability</p><p className="mt-1 font-semibold">A little more meaning in every pack.</p></div></div>
      <dl className="divide-y divide-black/10 px-5 sm:px-7">{rows.map((row) => <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[.8fr_1.2fr] sm:gap-5"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7c867f]">{row.label}</dt><dd className="text-sm font-medium text-[#283b31]">{row.value}</dd></div>)}</dl>
    </div>
    <div className="mt-8 flex flex-wrap gap-3"><Link href="/about" className="btn btn-primary">Read our story <span aria-hidden="true">↗</span></Link><Link href="/shop" className="btn btn-secondary">Explore the shop</Link></div>
  </div></section>;
}
