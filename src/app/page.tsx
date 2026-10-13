import Image from "next/image";
import Link from "next/link";
import FlowerJourney from "@/components/FlowerJourney";
import PhotoPanel from "@/components/PhotoPanel";
import SampleNotice from "@/components/SampleNotice";
import { getImpact, getTemples } from "@/lib/data";
import { formatDate, formatKg } from "@/lib/format";

export const revalidate = 60;

export default async function Home() {
  const [temples, impact] = await Promise.all([getTemples(), getImpact()]);
  const tiles = [
    { value: `${formatKg(impact.data.kgCollected)} kg`, label: "Flowers collected" },
    { value: `${formatKg(impact.data.gulaalKg)} kg`, label: "Gulaal made" },
    {
      value: impact.data.projectedKgPerYear === null ? "—" : `${formatKg(impact.data.projectedKgPerYear)} kg`,
      label: "Projected flowers saved / year",
    },
  ];

  return (
    <>
      <section className="section hero-section">
        <div className="container-site">
          <div className="hero-intro">
            <p className="eyebrow mb-6">A student-led circularity project · Jaipur</p>
            <h1 className="hero-title">What is offered can <span className="display-accent">bloom again.</span></h1>
            <p className="body-copy hero-summary mt-6">
              We help temple-offered flowers begin another chapter—becoming natural gulaal and compost, with care at every step.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/about" className="btn btn-primary">Discover the journey <span aria-hidden="true">↗</span></Link>
              <Link href="/shop" className="btn btn-secondary">Explore the shop</Link>
            </div>
            <p className="hero-location mt-6"><span aria-hidden="true" /> Rooted in Bhankrota, Jaipur</p>
          </div>

          <figure className="hero-art mt-12 md:mt-16">
            <Image
              src="/images/marigold-to-color.webp"
              alt="Editorial artwork showing marigold petals and orange natural pigment beside a rustic bowl"
              width={2176}
              height={1632}
              priority
              sizes="(max-width: 767px) 100vw, 92vw"
            />
            <div className="hero-art-topline" aria-hidden="true">
              <span>FLOWER TO COLOUR</span>
              <span>01 / A NEW CHAPTER</span>
            </div>
            <figcaption className="hero-art-caption">
              <span className="hero-caption-mark" aria-hidden="true">✳</span>
              <span><strong>A second life, in colour.</strong><small>An editorial still life inspired by the cycle.</small></span>
            </figcaption>
          </figure>
          <div className="hero-scroll-cue" aria-hidden="true"><span>FOLLOW THE CYCLE</span><span>↓</span></div>
        </div>
      </section>

      <section className="cycle-ribbon" aria-label="Our circular approach">
        <div className="container-site cycle-ribbon-inner">
          <span className="cycle-ribbon-item"><span>01</span> Offered with meaning</span>
          <span className="cycle-ribbon-separator" aria-hidden="true">✳</span>
          <span className="cycle-ribbon-item"><span>02</span> Collected with care</span>
          <span className="cycle-ribbon-separator" aria-hidden="true">✳</span>
          <span className="cycle-ribbon-item"><span>03</span> Given another purpose</span>
        </div>
      </section>

      <section className="section" aria-labelledby="impact-heading">
        <div className="container-site">
          {impact.sample && <div className="mb-5"><SampleNotice /></div>}
          <div className="impact-panel">
            <div className="impact-intro">
              <p className="eyebrow eyebrow-light mb-4">The work, in numbers</p>
              <h2 id="impact-heading" className="max-w-[13ch]">A little more life in every petal.</h2>
              <p className="impact-copy mt-5">We share our progress openly as the project grows.</p>
            </div>
            <ul className="impact-stats">
              {tiles.map((tile, index) => (
                <li key={tile.label} className="impact-stat">
                  <span className="impact-index">0{index + 1}</span>
                  <p className="impact-value">{tile.value}</p>
                  <p className="impact-label">{tile.label}</p>
                </li>
              ))}
            </ul>
            <p className="impact-footnote">The yearly figure is an estimate based on recorded collection days.</p>
          </div>
        </div>
      </section>

      <FlowerJourney />

      <section className="section" aria-labelledby="temples-heading">
        <div className="container-site">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Built with the community</p>
              <h2 id="temples-heading">Good things grow <span className="display-accent">together.</span></h2>
              <p className="body-copy mt-4 max-w-xl">Every temple is shown here only with permission.</p>
            </div>
            <Link href="/contact" className="btn btn-secondary self-start sm:self-auto">Become a partner <span aria-hidden="true">↗</span></Link>
          </div>
          {temples.sample && <div className="mb-5"><SampleNotice /></div>}
          {temples.data.length === 0 ? (
            <div className="card max-w-2xl p-7">
              <p className="font-semibold">Our partner temples will be listed here soon.</p>
              <p className="mt-2 text-sm text-[#657169]">If you manage a temple in Jaipur, we would be glad to hear from you.</p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {temples.data.map((temple, index) => (
                <li key={temple.id} className="card overflow-hidden p-4">
                  <PhotoPanel src={temple.photo_url} alt={temple.name} ratio="aspect-[16/10]" />
                  <div className="px-2 pb-2 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7c867f]">{temple.area}</p>
                    <h3 className="mt-2">{temple.name}</h3>
                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-black/10 pt-4 text-sm">
                      <div><p className="text-xs text-[#7c867f]">Collecting since</p><p className="mt-1 font-medium">{formatDate(temple.collecting_since, false) || "To be confirmed"}</p></div>
                      <div className="text-right"><p className="text-xs text-[#7c867f]">Collected</p><p className="mt-1 font-semibold">{formatKg(temple.kg_collected)} kg</p></div>
                    </div>
                  </div>
                  <span className="sr-only">Partner number {index + 1}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section-tight">
        <div className="container-site">
          <div className="closing-card">
            <div className="closing-rings" aria-hidden="true" />
            <div className="closing-copy">
              <p className="eyebrow mb-5">Credit · Community · Change</p>
              <h2 className="max-w-[13ch]">A better afterlife starts with a conversation.</h2>
              <p className="body-copy mt-5 max-w-xl">Partner with us, volunteer, or bring a little colour home. Every next step helps the cycle keep turning.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary">Let’s connect <span aria-hidden="true">↗</span></Link>
                <Link href="/shop" className="btn btn-secondary">Visit the shop</Link>
              </div>
            </div>
            <span className="closing-seal" aria-hidden="true">✳</span>
          </div>
        </div>
      </section>
    </>
  );
}
