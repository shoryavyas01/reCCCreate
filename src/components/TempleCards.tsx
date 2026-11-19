import Image from "next/image";
import type { TempleWithTotal } from "@/lib/types";
import { formatDate, formatKg } from "@/lib/format";

export default function TempleCards({ temples }: { temples: TempleWithTotal[] }) {
  return <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{temples.map((temple) => <li key={temple.id} className="temple-card">
    {temple.photo_url ? <div className="relative aspect-[16/10] overflow-hidden"><Image src={temple.photo_url} alt={temple.photo_kind === "illustration" ? "AI-generated illustration of a flower-adorned Shiva shrine" : `Shrine at ${temple.name}, Jaipur`} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" /></div> : <div className="temple-wordmark aspect-[16/10]" aria-label="Shiv Mandir, Rangoli Road"><span lang="hi">शिव</span><small>RANGOLI ROAD · JAIPUR</small><p>Temple photograph to follow</p></div>}
    {temple.photo_source && <a href={temple.photo_source} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-[#4e503a] underline underline-offset-2">{temple.photo_credit}</a>}
    {!temple.photo_source && temple.photo_credit && <p className="mt-2 text-xs text-[#4e503a]">{temple.photo_credit}</p>}
    <div className="pt-5"><p className="eyebrow">{temple.area}</p><h3 className="mt-3">{temple.name}</h3>
    {(temple.collecting_since || temple.kg_collected !== null) && <div className="mt-5 flex justify-between gap-4 border-t border-black/15 pt-4 text-sm">{temple.collecting_since && <p>Collecting since {formatDate(temple.collecting_since, false)}</p>}{temple.kg_collected !== null && <p>{formatKg(temple.kg_collected)} kg collected</p>}</div>}
    <a className="journey-link mt-5" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${temple.name} ${temple.area}`)}`} target="_blank" rel="noopener noreferrer">Find the temple ↗</a></div>
  </li>)}</ul>;
}
