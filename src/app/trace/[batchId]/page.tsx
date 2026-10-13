import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SampleNotice from "@/components/SampleNotice";
import { getBatch } from "@/lib/data";
import { formatDate, formatKg } from "@/lib/format";

export const metadata: Metadata = { title: "Trace your pack" };
export const revalidate = 60;

export default async function Trace({ params }: PageProps<"/trace/[batchId]">) {
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

  return (
    <section className="section">
      <div className="container-site max-w-2xl">
        <p className="text-[15px] font-extrabold uppercase tracking-[0.08em] text-green">Batch {batch.id}</p>
        <h1 className="mt-2">Where your pack came from</h1>
        <p className="mb-8 mt-5">
          The flowers in this pack were offered at a temple, collected by our team and given a second life.
        </p>
        {sample && <SampleNotice />}
        <dl className="overflow-hidden rounded-xl bg-green text-white">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 border-b border-white/25 px-6 py-4 last:border-0 sm:grid-cols-[1fr_1.5fr]">
              <dt className="text-[15px] font-extrabold uppercase tracking-[0.08em]">{r.label}</dt>
              <dd className="text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/about" className="btn btn-primary">Read our story</Link>
          <Link href="/shop" className="btn btn-secondary">Buy again</Link>
        </div>
      </div>
    </section>
  );
}
