import Image from "next/image";
import Link from "next/link";
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
  const steps = [
    { number: "01", title: "Collected with care", text: "Flowers are picked up from partner temples in Jaipur and weighed." },
    { number: "02", title: "Given new purpose", text: "Petals are sorted, sun-dried and ground into gulaal; surplus becomes compost." },
    { number: "03", title: "Made traceable", text: "Each batch can be followed back through a QR code on its pack." },
  ];

  return (
    <>
      <section className="section pb-14 md:pb-20">
        <div className="container-site hero-grid">
          <div className="max-w-[38rem]">
            <p className="eyebrow mb-7">A Jaipur student-led circularity project</p>
            <h1 className="max-w-[11ch]">Flowers deserve a <span className="display-accent">second life.</span></h1>
            <p className="body-copy mt-7 max-w-xl">
              Every offering carries meaning. We help its petals carry on—turning temple flowers into natural gulaal and compost, one thoughtful collection at a time.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-primary">Discover our story <span aria-hidden="true">↗</span></Link>
              <Link href="/shop" className="btn btn-secondary">Explore the shop</Link>
            </div>
            <div className="mt-9 flex items-center gap-3 text-sm text-[#657169]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#c7773c]" aria-hidden="true" />
              <span>Rooted in Bhankrota, Jaipur</span>
            </div>
          </div>
          <figure className="hero-art">
            <Image src="/images/marigold-to-color.webp" alt="Marigold petals beside a small bowl of natural orange pigment" width={1200} height={900} priority sizes="(max-width: 767px) 100vw, 48vw" />
            <span className="floating-note">From an offering, to a new beginning.</span>
            <figcaption className="hero-art-caption">A little care can change where a flower goes next.</figcaption>
          </figure>
        </div>
      </section>

      <section className="flow-line" aria-label="Our circular process">
        <div className="container-site grid gap-3 py-5 sm:grid-cols-3 sm:gap-8">
          <p className="text-sm font-semibold tracking-wide text-[#596960]">A more thoughtful cycle</p>
          <p className="text-sm font-semibold tracking-wide text-[#596960]">Temple flowers <span className="px-2 text-[#c7773c]">→</span> Natural gulaal</p>
          <p className="text-sm font-semibold tracking-wide text-[#596960]">Surplus petals <span className="px-2 text-[#c7773c]">→</span> Compost</p>
        </div>
      </section>

      <section className="section" aria-labelledby="impact-heading">
        <div className="container-site">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div><p className="eyebrow mb-4">Small steps, real meaning</p><h2 id="impact-heading" className="max-w-[14ch]">A little more life in every petal.</h2></div>
            <p className="body-copy max-w-md">Our impact figures are shared transparently—and updated as the work grows.</p>
          </div>
          {impact.sample && <SampleNotice />}
          <ul className="grid overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#21483b] text-white md:grid-cols-3">
            {tiles.map((tile, i) => (
              <li key={tile.label} className={`px-7 py-8 md:px-10 md:py-10 ${i < tiles.length - 1 ? "md:border-r md:border-white/15" : ""}`}>
                <p className="font-serif text-4xl tracking-tight md:text-5xl">{tile.value}</p><p className="mt-3 max-w-[15rem] text-sm text-white/75">{tile.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#7c867f]">The yearly figure is an estimate based on recorded collection days.</p>
        </div>
      </section>

      <section className="section-tight bg-white/60" aria-labelledby="process-heading">
        <div className="container-site">
          <div className="mb-10 max-w-2xl"><p className="eyebrow mb-4">A journey, not an ending</p><h2 id="process-heading">From temple doorstep to something useful again.</h2></div>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => <li key={step.number} className="card p-6 md:p-7"><span className="flow-number" aria-hidden="true">{step.number}</span><h3 className="mt-7">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#657169]">{step.text}</p></li>)}
          </ol>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="/about" className="text-sm font-semibold text-[#21483b] underline decoration-[#c7773c]/60 underline-offset-4 hover:decoration-[#21483b]">Learn how it works <span aria-hidden="true">↗</span></Link>
            <Link href="/trace/sample" className="text-sm font-semibold text-[#21483b] underline decoration-[#c7773c]/60 underline-offset-4 hover:decoration-[#21483b]">See a sample batch trace <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="temples-heading">
        <div className="container-site">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow mb-4">Built with the community</p><h2 id="temples-heading">Our temple partners.</h2><p className="body-copy mt-4 max-w-xl">Every temple is shown here only with permission.</p></div>
            <Link href="/contact" className="btn btn-secondary self-start sm:self-auto">Become a partner <span aria-hidden="true">↗</span></Link>
          </div>
          {temples.sample && <SampleNotice />}
          {temples.data.length === 0 ? (
            <div className="card max-w-2xl p-7"><p className="font-semibold">Our partner temples will be listed here soon.</p><p className="mt-2 text-sm text-[#657169]">If you manage a temple in Jaipur, we would be glad to hear from you.</p></div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {temples.data.map((temple, i) => (
                <li key={temple.id} className="card overflow-hidden p-4">
                  <PhotoPanel src={temple.photo_url} alt={temple.name} ratio="aspect-[16/10]" />
                  <div className="px-2 pb-2 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7c867f]">{temple.area}</p><h3 className="mt-2">{temple.name}</h3>
                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-black/10 pt-4 text-sm"><div><p className="text-xs text-[#7c867f]">Collecting since</p><p className="mt-1 font-medium">{formatDate(temple.collecting_since, false) || "To be confirmed"}</p></div><div className="text-right"><p className="text-xs text-[#7c867f]">Collected</p><p className="mt-1 font-semibold">{formatKg(temple.kg_collected)} kg</p></div></div>
                  </div><span className="sr-only">Partner number {i + 1}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section-tight">
        <div className="container-site">
          <div className="relative overflow-hidden rounded-[1.7rem] bg-[#e9eee7] p-7 sm:p-10 md:p-14">
            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-[#21483b]/10" aria-hidden="true" /><div className="pointer-events-none absolute -right-2 -top-6 h-44 w-44 rounded-full border border-[#21483b]/10" aria-hidden="true" />
            <div className="relative max-w-2xl"><p className="eyebrow mb-5">Credit. Community. Change.</p><h2 className="max-w-[15ch]">A better afterlife starts with a conversation.</h2><p className="body-copy mt-5 max-w-xl">Partner with us, volunteer, or bring a little color home. Every next step helps the cycle keep turning.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className="btn btn-primary">Let’s connect <span aria-hidden="true">↗</span></Link><Link href="/shop" className="btn btn-secondary">Visit the shop</Link></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
