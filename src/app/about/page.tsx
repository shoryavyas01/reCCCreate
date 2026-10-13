import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our story",
  description: "Meet the students behind ReCCCreate and discover how temple flowers find a second life in Jaipur.",
};

const team = ["Aryaman", "Shubhi", "Paridhi", "Kushagra"];
const steps = [
  { title: "Collection", caption: "Flowers are picked up from partner temples each morning and weighed.", symbol: "01" },
  { title: "A new purpose", caption: "Petals are sorted, sun-dried and ground into gulaal; surplus goes to a compost unit.", symbol: "02" },
  { title: "Thoughtful packaging", caption: "Paper pouches carry a QR code that traces the story of each batch.", symbol: "03" },
  { title: "Shared locally", caption: "Our products are shared at school and with the community.", symbol: "04" },
];

export default function About() {
  return (
    <>
      <section className="section pb-12"><div className="container-site">
        <p className="eyebrow mb-6">Our story</p>
        <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr] md:items-end">
          <h1 className="max-w-[10ch]">A small idea, with <span className="display-accent">room to grow.</span></h1>
          <p className="body-copy max-w-xl md:pb-2">We are students of Dharav High School in Bhankrota, Jaipur. ReCCCreate began as our TGELF project—and became a way to make something thoughtful from flowers offered at temples.</p>
        </div>
        <div className="mt-12 rounded-sm bg-[#173e36] p-7 text-white sm:p-10 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">Our name is our promise</p>
          <p className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">Credit. Community. Change.</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">A better cycle begins with respect: for the flowers, for the people who offer them, and for the community that gives them a next chapter.</p>
        </div>
      </div></section>

      <section className="section-tight bg-[#d6b88a]" aria-labelledby="how-heading"><div className="container-site">
        <div className="mb-9 max-w-2xl"><p className="eyebrow mb-4">The process</p><h2 id="how-heading">A little care at every step.</h2></div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <li key={step.symbol} className="card p-4"><div className="process-visual mb-5"><span className="font-serif text-4xl italic text-[#b66f3d]">{step.symbol}</span></div><h3>{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#657169]">{step.caption}</p></li>)}</ol>
        <div className="mt-7 flex items-center gap-3 text-sm text-[#657169]"><span className="h-2 w-2 rounded-full bg-[#c7773c]" aria-hidden="true" /><span>Each batch can be traced from the QR code on its pack.</span></div>
      </div></section>

      <section className="section" aria-labelledby="team-heading"><div className="container-site grid gap-10 md:grid-cols-[.75fr_1.25fr]">
        <div><p className="eyebrow mb-4">The people behind the petals</p><h2 id="team-heading">A student team, learning by doing.</h2><p className="body-copy mt-5">We are building ReCCCreate together at Dharav High School. Our work spans temple collections, processing, packaging and sharing products with the community.</p></div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">{team.map((name, index) => <li key={name} className="card team-card"><span className="team-monogram" aria-hidden="true">{name.slice(0, 1)}</span><p className="mt-5 font-semibold">{name}</p><p className="mt-1 text-xs text-[#657169]">Student team</p><span className="mt-5 block text-[0.65rem] font-semibold tracking-[0.14em] text-[#a1aaa3]">0{index + 1}</span></li>)}</ul>
      </div></section>

      <section className="section-tight"><div className="container-site"><div className="flex flex-col gap-5 rounded-sm border border-black/[0.08] bg-[#c4c394] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div><p className="eyebrow mb-3">Be part of the next chapter</p><h3 className="text-2xl">Good things grow together.</h3></div>
        <Link href="/contact" className="btn btn-primary self-start sm:self-auto">Talk with us <span aria-hidden="true">↗</span></Link>
      </div></div></section>
    </>
  );
}
