import { siteUrl } from "@/lib/site";
import { contactEmail } from "@/lib/contact";
export default function SiteStructuredData() {
  const data = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#project`, name: "ReCCCreate", url: siteUrl, email: contactEmail, description: "Student-led temple flower recycling project at Dharav High School, Bhankrota, Jaipur.", logo: `${siteUrl}/brand/recccreate-logo.png`, address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressRegion: "Rajasthan", addressCountry: "IN" } },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "ReCCCreate", url: siteUrl, inLanguage: "en-IN", publisher: { "@id": `${siteUrl}/#project` } },
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}
