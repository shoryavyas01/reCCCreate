import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { team } from "@/lib/team";

export const metadata = pageMetadata('Our story & process', 'Meet the five Dharav High School students behind ReCCCreate and see how Jaipur temple flowers become rangoli colour and compost.', '/about');

const steps = [
  {
    stage: "Collect",
    title: "Begin with the flowers.",
    caption: "Flowers offered at partner temples in Jaipur are collected and weighed. We separate the petals from wrappers, thread and other materials before processing.",
    photo: "flower-collection",
    alt: "Flowers being gathered into a sack beside collection tubs",
    position: "50% 64%",
  },
  {
    stage: "Prepare",
    title: "Dry the petals. Grind the colour.",
    caption: "Sorted petals are sun-dried, then ground into a fine powder to form the base of our rangoli colours. Surplus flowers are directed to compost.",
    photo: "ground-petals",
    alt: "Yellow and orange flower powder in bowls and spread on a work surface",
    position: "50% 52%",
  },
  {
    stage: "Package",
    title: "Pack with care.",
    caption: "The colour is packed in labelled paper pouches, with ingredients and directions for use. Every pouch brings recovered flower petals back into the community.",
    photo: "labelled-pouches",
    alt: "ReCCCreate paper pouches showing the front label, product details and QR code",
    position: "50% 70%",
  },
  {
    stage: "Create",
    title: "A new use for every shade.",
    caption: "The finished colours return to the community for rangoli and decoration. Flowers that began as an offering become something to create with again.",
    photo: "rangoli-colour",
    alt: "Orange ReCCCreate rangoli colour and paper pouches arranged beside marigold petals",
    position: "50% 100%",
  },
];

export default function About() {
  return (
    <>
      <section className="section pb-12"><div className="container-site">
        <p className="eyebrow mb-6">Our story</p>
        <div className="page-intro">
          <h1 className="max-w-[10ch]">A small idea, with <span className="display-accent">room to grow.</span></h1>
          <p className="body-copy">We are students of Dharav High School in Bhankrota, Jaipur. ReCCCreate began as our TGELF project—and became a way to make something thoughtful from flowers offered at temples.</p>
        </div>
        <div className="mt-12 rounded-sm bg-[#173e36] p-7 text-white sm:p-10 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/55">Our name is our promise</p>
          <p className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">Credit. Community. Change.</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">A better cycle begins with respect: for the flowers, for the people who offer them, and for the community that gives them a next chapter.</p>
        </div>
      </div></section>

      <section id="process" className="section process-section" aria-labelledby="how-heading"><div className="container-site">
        <div className="two-column process-intro">
          <div><p className="eyebrow mb-4">The process</p><h2 id="how-heading">From temple flowers<br />to <span className="display-accent">rangoli colour.</span></h2></div>
          <p className="body-copy">Collection, preparation, packaging and a new use. A closer look at the work that gives offered flowers another purpose.</p>
        </div>
        <ol className="process-gallery">
          {steps.map((step) => (
            <li key={step.photo} className="process-card">
              <figure>
                <div className="process-photo">
                  <Image src={`/images/process/${step.photo}.webp`} alt={step.alt} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectPosition: step.position }} />
                </div>
                <figcaption className="process-caption">
                  <p className="eyebrow">{step.stage}</p>
                  <h3>{step.title}</h3>
                  <p className="body-copy">{step.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <div className="process-closing">
          <p>Made for rangoli and decorative use. Explore the colours, or help us collect the next basket of flowers.</p>
          <div className="process-actions">
            <Link href="/shop?type=rangoli" className="btn btn-primary">Explore the colours</Link>
            <Link href="/phool-mitra" className="btn btn-secondary">Join a collection</Link>
          </div>
        </div>
      </div></section>

      <section className="section" aria-labelledby="team-heading"><div className="container-site">
        <div className="two-column">
          <div><p className="eyebrow mb-4">The people behind the petals</p><h2 id="team-heading">A student team, learning by doing.</h2></div>
          <p className="body-copy">We are building ReCCCreate together at Dharav High School, Bhankrota, Jaipur. Our work spans temple collections, processing, packaging and sharing products with the community.</p>
        </div>
        <ul className="team-grid">
          {team.map((member) => (
            <li key={member.photo} className="card team-card">
              <div className="team-portrait">
                <Image src={`/images/team/${member.photo}.webp`} alt={`Portrait of ${member.name}`} fill sizes="(max-width: 480px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw" />
              </div>
              <div className="team-caption">
                <h3>{member.name}</h3>
                <p>Student team</p>
              </div>
            </li>
          ))}
        </ul>
      </div></section>

      <section className="section-tight"><div className="container-site"><div className="flex flex-col gap-5 rounded-sm border border-black/[0.08] bg-[#c4c394] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div><p className="eyebrow mb-3">Be part of the next chapter</p><h3 className="text-2xl">Good things grow together.</h3></div>
        <Link href="/contact" className="btn btn-primary self-start sm:self-auto">Talk with us <span aria-hidden="true">↗</span></Link>
      </div></div></section>
    </>
  );
}
