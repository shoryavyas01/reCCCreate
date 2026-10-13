import type { Metadata } from "next";
import MarigoldStem from "@/components/MarigoldStem";
import PhotoPanel from "@/components/PhotoPanel";

export const metadata: Metadata = { title: "About Us" };

// Add each person's role and photo (put files in public/team and set `photo`).
const team: { name: string; role: string; photo?: string }[] = [
  { name: "Aryaman", role: "Role to be added" },
  { name: "Shubhi", role: "Role to be added" },
  { name: "Paridhi", role: "Role to be added" },
  { name: "Kushagra", role: "Role to be added" },
];

const steps: { title: string; caption: string; photo?: string }[] = [
  { title: "Collection", caption: "Flowers picked up from temples each morning and weighed." },
  {
    title: "Recycling",
    caption: "Petals sorted, sun-dried and ground into gulaal; surplus goes to a compost unit.",
  },
  { title: "Eco-friendly packaging", caption: "Paper pouches with a QR code that traces each batch." },
  { title: "Selling", caption: "At school and to the community." },
];

export default function About() {
  return (
    <div className="container-site pt-6">
      <MarigoldStem>
        <section className="section" data-stem-node aria-labelledby="story-heading">
          <h1 id="story-heading">Our story</h1>
          <p className="mt-6 max-w-2xl text-xl">
            We are students of Dharav High School, Bhankrota. We started ReCCCreate for our TGELF project and found a
            huge gap: tonnes of temple flowers wasted every day. Through selling gulaal, we promote recycling and
            eco-friendly practices.
          </p>
          <p className="mt-6 font-extrabold uppercase tracking-[0.08em] text-green">
            CCC stands for Credit. Community. Change.
          </p>
        </section>

        <section className="section pt-0 md:pt-0" data-stem-node aria-labelledby="team-heading">
          <h2 id="team-heading" className="mb-8">
            Team
          </h2>
          <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.name} className="card flex flex-col gap-3 p-4">
                <PhotoPanel src={m.photo} alt={m.name} ratio="aspect-square" />
                <div>
                  <h3>{m.name}</h3>
                  <p className="text-[15px]">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="section pt-0 md:pt-0" data-stem-node aria-labelledby="process-heading">
          <h2 id="process-heading" className="mb-8">
            Our process
          </h2>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="card flex flex-col gap-3 p-4">
                <PhotoPanel src={s.photo} alt={s.title} />
                <div>
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-green">Step {i + 1}</p>
                  <h3>{s.title}</h3>
                  <p className="mt-1 text-[15px]">{s.caption}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </MarigoldStem>
    </div>
  );
}
