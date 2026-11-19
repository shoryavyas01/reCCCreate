import Image from "next/image";
import Link from "next/link";
import BotanicalMotif from "@/components/BotanicalMotif";
import BatchLookup from "@/components/BatchLookup";
import FlowerJourney from "@/components/FlowerJourney";
import TempleCards from "@/components/TempleCards";
import { getTemples } from "@/lib/data";
import { publishedImpact } from "@/lib/impact";
import { formatDate, formatKg } from "@/lib/format";

export const revalidate = 60;

const questions = [
  { question: "What happens to the temple flowers?", answer: "We collect and weigh flowers from partner temples. Petals are sorted, sun-dried and ground for rangoli colour. Surplus flowers go to a compost unit." },
  { question: "How do I place an order?", answer: "Choose a product in the shop and send an order request. The team will call to confirm availability, price and delivery. Payment is by UPI on delivery; no online payment is collected here." },
  { question: "Can my temple or school take part?", answer: "Yes. Use the contact form to tell us your location and how you would like to help. We will discuss collection arrangements with you. A temple is named publicly only after giving permission." },
  { question: "How can I trace a pack?", answer: "Scan the QR code on the packaging, or enter its batch ID below. Explore product ingredients, packaging details, batch information and our student team. Source temples, collection dates and flower weights appear when recorded for a batch." },
];

export default async function Home() {
  const temples = await getTemples();
  const tiles = [
    { value: formatKg(publishedImpact.flowersRecycledKg), unit: "kg", label: "Flowers collected & recycled" },
    { value: publishedImpact.rangoliPackets.toLocaleString("en-IN"), unit: "packets", label: "Rangoli colour made" },
  ];
  return <>
    <section className="hero-section">
      <div className="container-site hero-grid">
        <div className="hero-intro">
          <p className="eyebrow mb-7">ReCCCreate · Dharav High School, Bhankrota, Jaipur</p>
          <h1 className="hero-title">Temple flowers.<br /><span className="display-accent">Rangoli colours.</span></h1>
          <p className="body-copy hero-summary mt-7">Collected from Jaipur temples. Sorted by our student team. Remade as rangoli colour and compost.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="btn btn-primary">Explore our rangoli colours & compost <span aria-hidden="true">↗</span></Link><Link href="#journey-heading" className="btn btn-text">See how it’s made <span aria-hidden="true">↓</span></Link></div>
          <div className="hero-signature"><span className="hero-signature-mark" aria-hidden="true">✳</span><p>A student venture.<br /><span>Rooted in Dharav High School, Bhankrota.</span></p></div>
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
    <div className="cycle-ribbon" aria-label="Credit, Community, Change"><div className="container-site cycle-ribbon-inner"><span>Temple flowers</span><span aria-hidden="true">✳</span><span>Student hands</span><span aria-hidden="true">✳</span><span>Rangoli colour</span><span aria-hidden="true">✳</span><span>Flower compost</span></div></div>

    <section className="section story-section" data-reveal><div className="container-site story-grid">
      <div><p className="eyebrow mb-5">The idea, close to home</p><h2>An offering is precious.<br />Even <span className="display-accent">after the prayer.</span></h2></div>
      <div className="story-copy"><p className="body-copy">Every morning, flowers offered at temples have already served a purpose. We collect them while they still have something to give.</p><p className="body-copy mt-4">We are students at Dharav High School in Bhankrota. Our work is practical: weigh the flowers, sort the petals, dry and grind them for rangoli colour, and send surplus to compost.</p><Link href="/about" className="journey-link mt-6">Meet the people behind it <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <FlowerJourney />

    <section className="section collection-section" data-reveal><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">Two ways to begin again</p><h2>Made for rangoli.<br /><span className="display-accent">And for the earth.</span></h2></div><Link href="/shop" className="btn btn-secondary">Visit the shop ↗</Link></div>
      <div className="collection-grid">
        <Link href="/shop?type=rangoli" className="collection-panel collection-colour"><div className="collection-product-image"><Image src="/images/products/kesar-kyari-front.webp" alt="Kesar Kyari rangoli colour — front of pouch" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div className="collection-panel-copy"><div><p className="eyebrow mb-3">The colours</p><h3>Rangoli colours</h3><p>Kesar Kyari and Sunheri Subah. Flower-based colours for patterns, decoration and celebrations.</p></div></div></Link>
        <Link href="/shop?type=compost" className="collection-panel collection-soil"><div className="collection-product-image"><Image src="/images/products/temple-bloom.webp" alt="Temple Bloom temple flower compost pouch" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div className="collection-panel-copy"><div><p className="eyebrow mb-3">The soil</p><h3>Temple Bloom</h3><p>Temple flower compost that returns surplus blooms to the growing cycle.</p></div></div></Link>
      </div>
      <p className="art-note mt-4">Rangoli colour and temple flower compost. Product details and availability are in the shop.</p>
    </div></section>

    <section className="section-tight" data-reveal aria-labelledby="impact-heading"><div className="container-site"><div className="impact-panel">
      <BotanicalMotif className="impact-flower" />
      <div className="impact-intro"><p className="eyebrow eyebrow-light mb-5">Our progress</p><h2 id="impact-heading">Collected.<br /><em>Made useful again.</em></h2><p className="impact-copy mt-5">Temple flowers recycled and rangoli colour packed by our student team.</p></div>
      <ul className="impact-stats">{tiles.map((tile, i) => <li key={tile.label} className="impact-stat"><span className="impact-index">0{i + 1}</span><p className="impact-value">{tile.value} <small>{tile.unit}</small></p><p className="impact-label">{tile.label}</p></li>)}</ul>
      <p className="impact-footnote">Project totals updated {formatDate(publishedImpact.updatedOn)}.</p>
    </div></div></section>

    <section className="section temples-section" data-reveal aria-labelledby="temples-heading"><div className="container-site">
      <div className="section-heading"><div><p className="eyebrow mb-4">A local circle of care</p><h2 id="temples-heading">Our temple <span className="display-accent">partners.</span></h2><p className="body-copy mt-4 max-w-xl">The Jaipur temples connected with our flower collection journey.</p></div><Link href="/contact" className="btn btn-secondary">Become a partner ↗</Link></div>
      <TempleCards temples={temples.data} />
    </div></section>

    <section className="section trace-section" data-reveal><div className="container-site trace-grid"><div><p className="eyebrow mb-5">From offering to your hands</p><h2>Trace the flowers<br /><span className="display-accent">in your pack.</span></h2><p className="body-copy mt-5">Explore our products, recorded batch details and the student team behind the work.</p><Link href="/trace" className="journey-link mt-5">Trace our products ↗</Link></div><BatchLookup /></div></section>

    <section className="section faq-section" data-reveal aria-labelledby="faq-heading"><div className="container-site faq-grid"><div><p className="eyebrow mb-5">A few useful answers</p><h2 id="faq-heading">Good questions.<br /><span className="display-accent">Straight answers.</span></h2></div><div>{questions.map((item, i) => <details className="faq-item" key={item.question}><summary><span className="faq-number">0{i + 1}</span><span>{item.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

    <section className="section-tight" data-reveal><div className="container-site"><div className="closing-card"><BotanicalMotif className="closing-botanical" /><div className="closing-copy"><p className="eyebrow mb-5">Temples · Schools · Volunteers</p><h2>Help us collect<br /><span className="display-accent">the next basket.</span></h2><p className="body-copy mt-5 max-w-xl">Manage a temple in Jaipur? Want to volunteer with the team? Tell us where you are and how you’d like to help.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/phool-mitra" className="btn btn-primary">Become a Phool Mitra ↗</Link><Link href="/contact" className="btn btn-secondary">Talk to the team ↗</Link></div></div></div></div></section>
  </>;
}
