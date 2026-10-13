import Image from "next/image";
import Link from "next/link";
import BotanicalMotif from "@/components/BotanicalMotif";
import BatchLookup from "@/components/BatchLookup";
import FlowerJourney from "@/components/FlowerJourney";
import PhotoPanel from "@/components/PhotoPanel";
import SampleNotice from "@/components/SampleNotice";
import { getImpact, getTemples } from "@/lib/data";
import { formatDate, formatKg } from "@/lib/format";

export const revalidate = 60;

const questions = [
  { question: "What happens to the temple flowers?", answer: "We collect and weigh flowers from partner temples. Petals are sorted, sun-dried and ground for gulaal. Surplus flowers go to a compost unit." },
  { question: "How do I place an order?", answer: "Choose a product in the shop and send an order request. The team will call to confirm availability, price and delivery. Payment is by UPI on delivery; no online payment is collected here." },
  { question: "Can my temple or school take part?", answer: "Yes. Use the contact form to tell us your location and how you would like to help. We will discuss collection arrangements with you. A temple is named publicly only after giving permission." },
  { question: "How can I trace a pack?", answer: "Scan the QR code on the packaging, or enter its batch ID below. The batch page shows the recorded source, collection date, flowers used and the people who made it. The sample batch illustrates this without claiming a real origin." },
];

export default async function Home() {
  const [temples, impact] = await Promise.all([getTemples(), getImpact()]);
  const tiles = [
    { value: `${formatKg(impact.data.kgCollected)}`, unit: "kg", label: "Flowers collected" },
    { value: `${formatKg(impact.data.gulaalKg)}`, unit: "kg", label: "Gulaal made" },
    { value: impact.data.projectedKgPerYear === null ? "—" : formatKg(impact.data.projectedKgPerYear), unit: impact.data.projectedKgPerYear === null ? "" : "kg / year", label: "Projected collection" },
  ];
  return <>
    <section className="hero-section">
      <div className="container-site hero-grid">
        <div className="hero-intro">
          <p className="eyebrow mb-7">ReCCCreate · Bhankrota, Jaipur</p>
          <h1 className="hero-title">Temple flowers.<br /><span className="display-accent">Festival colours.</span></h1>
          <p className="body-copy hero-summary mt-7">Collected from Jaipur temples. Sorted by our student team. Remade as natural gulaal and compost.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="btn btn-primary">Explore our gulaal & compost <span aria-hidden="true">↗</span></Link><Link href="#journey-heading" className="btn btn-text">See how it’s made <span aria-hidden="true">↓</span></Link></div>
          <div className="hero-signature"><span className="hero-signature-mark" aria-hidden="true">✳</span><p>A student venture.<br /><span>Rooted in Bhankrota, Jaipur.</span></p></div>
        </div>
        <div className="hero-art-wrap">
          <BotanicalMotif className="hero-botanical" />
          <figure className="hero-art">
            <Image src="/images/marigold-to-color.webp" alt="Illustrative still life of marigold petals, natural orange pigment and a rustic bowl" width={2176} height={1632} priority sizes="(max-width: 767px) 95vw, 48vw" />
            <figcaption className="hero-art-caption"><span>01 — FLOWER TO COLOUR</span><strong>Marigold. Remade.</strong><small>Illustrative artwork · the flower cycle</small></figcaption>
          </figure>
          <div className="heritage-seal" aria-hidden="true"><span>JAIPUR, RAJASTHAN</span><b>पुनः</b><span>GIVEN ANOTHER LIFE</span></div>
          <p className="hero-art-note">FLOWERS → COLOUR → SOIL</p>
        </div>
      </div>
    </section>
    <div className="cycle-ribbon" aria-label="Credit, Community, Change"><div className="container-site cycle-ribbon-inner"><span>Temple flowers</span><span aria-hidden="true">✳</span><span>Student hands</span><span aria-hidden="true">✳</span><span>Natural gulaal</span><span aria-hidden="true">✳</span><span>Flower compost</span></div></div>

    <section className="section story-section" data-reveal><div className="container-site story-grid">
      <div><p className="eyebrow mb-5">The idea, close to home</p><h2>An offering is precious.<br />Even <span className="display-accent">after the prayer.</span></h2></div>
      <div className="story-copy"><p className="body-copy">Every morning, flowers offered at temples have already served a purpose. We collect them while they still have something to give.</p><p className="body-copy mt-4">We are students at Dharav High School in Bhankrota. Our work is practical: weigh the flowers, sort the petals, dry and grind them for gulaal, and send surplus to compost.</p><Link href="/about" className="journey-link mt-6">Meet the people behind it <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <FlowerJourney />

    <section className="section collection-section" data-reveal><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">Two ways to begin again</p><h2>Made for Holi.<br /><span className="display-accent">And for the earth.</span></h2></div><Link href="/shop" className="btn btn-secondary">Visit the shop ↗</Link></div>
      <div className="collection-grid">
        <Link href="/shop?type=gulaal" className="collection-panel collection-colour"><div className="collection-illustration"><div className="colour-specimen"><span className="specimen-number">01</span><div className="pigment pigment-one" /><div className="pigment pigment-two" /><span className="specimen-caption">MARIGOLD & ROSE<br />PETAL COLOURS</span></div><BotanicalMotif className="collection-flower" /><span className="collection-art-label">THE COLOUR COLLECTION</span></div><div className="collection-panel-copy"><div><p className="eyebrow mb-3">01 / The colours</p><h3>Natural gulaal</h3><p>Temple petals, dried and ground for another celebration.</p></div><span className="collection-arrow" aria-hidden="true">↗</span></div></Link>
        <Link href="/shop?type=compost" className="collection-panel collection-soil"><div className="collection-illustration"><BotanicalMotif className="soil-flower" variant="sprout" /><div className="soil-lines" /><span className="collection-art-label">BACK TO THE EARTH</span></div><div className="collection-panel-copy"><div><p className="eyebrow mb-3">02 / The soil</p><h3>Flower compost</h3><p>Surplus blooms find their way back to the growing cycle.</p></div><span className="collection-arrow" aria-hidden="true">↗</span></div></Link>
      </div>
      <p className="art-note mt-4">Botanical illustrations. Product details and availability are in the shop.</p>
    </div></section>

    <section className="section-tight" data-reveal aria-labelledby="impact-heading"><div className="container-site"><div className="impact-panel">
      <BotanicalMotif className="impact-flower" />
      <div className="impact-intro"><p className="eyebrow eyebrow-light mb-5">The collection ledger</p><h2 id="impact-heading">What we’ve <em>collected.</em></h2><p className="impact-copy mt-5">Our progress, from the collection ledger.</p></div>
      {impact.sample && <div className="mt-6"><SampleNotice /></div>}
      <ul className="impact-stats">{tiles.map((tile, i) => <li key={tile.label} className="impact-stat"><span className="impact-index">0{i + 1}</span><p className="impact-value">{tile.value} <small>{tile.unit}</small></p><p className="impact-label">{tile.label}</p></li>)}</ul>
      <p className="impact-footnote">Yearly projection: average daily collection across the full recorded date range × 365. An estimate, not a measured result.</p>
    </div></div></section>

    <section className="section temples-section" data-reveal aria-labelledby="temples-heading"><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">A local circle of care</p><h2 id="temples-heading">Our temple <span className="display-accent">partners.</span></h2><p className="body-copy mt-4 max-w-xl">Partner temples are named only with their permission.</p></div><Link href="/contact" className="btn btn-secondary">Become a partner ↗</Link></div>
      {temples.sample && <SampleNotice />}
      {temples.data.length === 0 ? <div className="card p-7"><h3>Our circle is growing.</h3><p className="body-copy mt-3">Partner temples will be listed here once confirmed. Manage a temple in Jaipur? We would like to hear from you.</p></div> : <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{temples.data.map((temple) => <li key={temple.id} className="temple-card"><PhotoPanel src={temple.photo_url} alt={temple.name} ratio="aspect-[16/10]" /><div className="pt-5"><p className="eyebrow">{temple.area}</p><h3 className="mt-3">{temple.name}</h3><div className="mt-5 flex justify-between gap-4 border-t border-black/15 pt-4 text-sm"><div><p className="text-xs text-[#4e503a]">Collecting since</p><p className="mt-1">{formatDate(temple.collecting_since, false) || "To be confirmed"}</p></div><div className="text-right"><p className="text-xs text-[#4e503a]">Collected</p><p className="mt-1 font-semibold">{formatKg(temple.kg_collected)} kg</p></div></div></div></li>)}</ul>}
    </div></section>

    <section className="section trace-section" data-reveal><div className="container-site trace-grid"><div><p className="eyebrow mb-5">From offering to your hands</p><h2>Trace the flowers<br /><span className="display-accent">in your pack.</span></h2><p className="body-copy mt-5">Follow the source, collection date and makers behind your batch.</p><Link href="/trace/sample" className="journey-link mt-5">Explore a labelled sample ↗</Link></div><BatchLookup /></div></section>

    <section className="section faq-section" data-reveal aria-labelledby="faq-heading"><div className="container-site faq-grid"><div><p className="eyebrow mb-5">A few useful answers</p><h2 id="faq-heading">Good questions.<br /><span className="display-accent">Straight answers.</span></h2></div><div>{questions.map((item, i) => <details className="faq-item" key={item.question}><summary><span className="faq-number">0{i + 1}</span><span>{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

    <section className="section-tight" data-reveal><div className="container-site"><div className="closing-card"><BotanicalMotif className="closing-botanical" /><div className="closing-copy"><p className="eyebrow mb-5">Temples · Schools · Volunteers</p><h2>Help us collect<br /><span className="display-accent">the next basket.</span></h2><p className="body-copy mt-5 max-w-xl">Manage a temple in Jaipur? Want to volunteer with the team? Tell us where you are and how you’d like to help.</p><Link href="/contact" className="btn btn-primary mt-7">Talk to the team ↗</Link></div></div></div></section>
  </>;
}
