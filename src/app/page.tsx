import Link from "next/link";
import PhotoPanel from "@/components/PhotoPanel";
import SampleNotice from "@/components/SampleNotice";
import { getImpact, getTemples } from "@/lib/data";
import { formatDate, formatKg } from "@/lib/format";

export const revalidate = 60;

/* Add `src` and `credit` once the team has its own photos,
   or illustrative ones from Unsplash or Pexels with the photographer credited. */
const heroPhotos: { alt: string; src?: string; credit?: string }[] = [
  { alt: "Flowers offered at a temple" },
  { alt: "Marigold garlands at a flower stall" },
  { alt: "Offered flowers floating in a river" },
];

export default async function Home() {
  const [temples, impact] = await Promise.all([getTemples(), getImpact()]);

  const tiles = [
    { value: `${formatKg(impact.data.kgCollected)} kg`, label: "Flowers collected so far" },
    { value: `${formatKg(impact.data.gulaalKg)} kg`, label: "Gulaal made so far" },
    {
      value: impact.data.projectedKgPerYear === null ? "Coming soon" : `${formatKg(impact.data.projectedKgPerYear)} kg`,
      label: "Projected flowers saved a year",
      note: "Estimate based on our pilot, October 2026.",
    },
  ];

  return (
    <>
      <section className="section">
        <div className="container-site">
          <h1>The Flower Story</h1>
          <p className="mt-5 max-w-2xl text-xl">
            Every day, flowers offered in faith end up in drains, rivers and landfill.
          </p>

          <div className="mt-10 rounded-xl bg-green p-6 text-white md:p-10">
            <p className="text-[40px] font-extrabold leading-tight md:text-[64px]">About 8 million tonnes</p>
            <p className="mt-2 max-w-2xl text-xl">
              of floral waste is dumped into India&rsquo;s rivers and water bodies every year.
            </p>
            <p className="mt-4 max-w-2xl text-[15px]">
              This figure covers floral waste in general, not only flowers from temples. Source: research by Pradip
              Kumar Maity in the <cite>International Journal for Research in Applied Science &amp; Engineering Technology</cite>,
              as reported by the South China Morning Post.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {heroPhotos.map((p) => (
              <PhotoPanel key={p.alt} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50" aria-labelledby="temples-heading">
        <div className="container-site">
          <h2 id="temples-heading">Temples we collect from</h2>
          <p className="mb-8 mt-3 max-w-2xl">Each temple is listed here with its permission.</p>
          {temples.sample && <SampleNotice />}
          {temples.data.length === 0 ? (
            <p className="card max-w-xl">Our partner temples will be listed here soon.</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {temples.data.map((t) => (
                <li key={t.id} className="card flex flex-col gap-4">
                  <PhotoPanel src={t.photo_url} alt={t.name} />
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.area}</p>
                  </div>
                  <dl className="mt-auto grid grid-cols-2 gap-3 text-[15px]">
                    <div>
                      <dt className="font-extrabold">Collecting since</dt>
                      <dd>{formatDate(t.collecting_since, false) || "To be confirmed"}</dd>
                    </div>
                    <div>
                      <dt className="font-extrabold">Collected so far</dt>
                      <dd>{formatKg(t.kg_collected)} kg</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="impact-heading">
        <div className="container-site">
          <h2 id="impact-heading" className="mb-8">
            What our work can save in a year
          </h2>
          {impact.sample && <SampleNotice />}
          <ul className="grid gap-6 md:grid-cols-3">
            {tiles.map((t) => (
              <li key={t.label} className="rounded-xl bg-green p-6 text-white">
                <p className="text-[40px] font-extrabold leading-tight">{t.value}</p>
                <p className="mt-1 text-lg">{t.label}</p>
                {t.note && <p className="mt-3 text-[15px]">{t.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0 md:pt-0">
        <div className="container-site">
          <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <h2 className="max-w-md">Help us give flowers a second life</h2>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Buy our gulaal
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Partner with us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
