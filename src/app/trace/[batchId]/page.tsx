import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getBatch } from "@/lib/data";
import { findProductTrace } from "@/lib/traces";
import { team, projectLocation } from "@/lib/team";
import { formatDate, formatKg } from "@/lib/format";

export const metadata: Metadata = { title: "Trace your pack", description: "Product details, recorded batch information and the ReCCCreate student team." };
export const revalidate = 60;
export default async function Trace({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  if (batchId.toLowerCase() === "sample") redirect("/trace");
  const { data: batch } = await getBatch(batchId);
  const record = findProductTrace(batchId);
  if (!batch && !record) notFound();
  const rows = [
    { label: "Product", value: batch?.product ? `${batch.product.name} (${batch.product.size})` : record?.product.name || "ReCCCreate product" },
    { label: "Batch ID", value: batch?.id || record?.batch || "Not recorded for this product" },
    { label: "Source temple", value: batch?.temple ? `${batch.temple.name}, ${batch.temple.area}` : "Not linked to this batch yet" },
    { label: "Flowers collected on", value: batch?.collected_on ? formatDate(batch.collected_on) : "Not recorded" },
    { label: "Flowers used", value: batch?.kg_flowers_used != null ? `${formatKg(Number(batch.kg_flowers_used))} kg` : "Not recorded" },
    ...(record ? [{ label: "Ingredients", value: record.product.ingredients || "Ask the team for details" }, { label: "Manufactured", value: record.manufactured || "Not recorded" }, { label: "Best before", value: record.bestBefore || "Not recorded" }, ...(record.product.details?.pack?.filter((item) => !["Batch", "Manufactured", "Best before"].includes(item.label)) ?? [])] : []),
    ...(batch?.made_by ? [{ label: "Recorded makers", value: batch.made_by }] : []),
    { label: "Student venture", value: projectLocation },
  ];
  return <section className="section"><div className="container-site max-w-4xl">
    <p className="eyebrow mb-5">{batch ? "Batch record" : record!.kind}</p><h1 className="max-w-[14ch]">A second life. <span className="display-accent">A story to follow.</span></h1>
    {record && <div className="trace-product mt-10"><div className="relative aspect-[4/3] bg-[#ecd4a9]"><Image src={record.product.photo_url!} alt={record.product.name} fill sizes="(max-width: 767px) 100vw, 35vw" className="object-contain" /></div><div><h2 className="text-3xl">{record.product.name}</h2><p className="body-copy mt-4">{record.product.type === "compost" ? "Collected temple flowers return to the soil as compost, beginning another growing cycle." : "Collected petals are sorted, dried and ground, then packed as rangoli colour for decoration and celebrations."}</p><p className="mt-4 text-sm leading-6 text-[#4e503a]">{record.batch ? "Packaging details are transcribed from the product label. Collection records will complete the link from temple to batch." : "This page follows the product journey. Batch-specific collection and manufacturing details have not been recorded yet."}</p></div></div>}
    <div className="trace-panel mt-8 overflow-hidden border border-black/10 bg-[#e0c497]"><dl className="trace-details divide-y divide-black/10 px-5 sm:px-7">{rows.map((row) => <div key={row.label} className="trace-details-row"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[#4e503a]">{row.label}</dt><dd className="text-sm font-medium text-[#283b31]">{row.value}</dd></div>)}</dl></div>
    <div className="mt-12"><p className="eyebrow mb-4">The people behind the project</p><h2 className="text-3xl">Our student team.</h2><ul className="trace-team mt-6">{team.map((member) => <li key={member.photo}><Image src={`/images/team/${member.photo}.webp`} alt={member.name} width={80} height={96} className="object-cover" /><span>{member.name}</span></li>)}</ul></div>
    <div className="mt-10 flex flex-wrap gap-3"><Link href="/trace" className="btn btn-primary">All product journeys ↗</Link><Link href="/about#process" className="btn btn-secondary">See our process</Link><Link href="/contact" className="btn btn-secondary">Ask about this pack</Link></div>
  </div></section>;
}
