import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteMotion from "@/components/SiteMotion";
import { siteUrl, isPreview, socialImage } from "@/lib/site";
import SiteAnalytics from "@/components/SiteAnalytics";
import SiteStructuredData from "@/components/SiteStructuredData";
import "./globals.css";

const montserrat = localFont({
  src: "../../public/fonts/montserrat-latin-wght-normal.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});
const dmSerifDisplay = localFont({
  src: [
    { path: "../../public/fonts/dm-serif-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/dm-serif-display-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-dm-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ReCCCreate — Rangoli colour & flower compost in Jaipur", template: "%s | ReCCCreate" },
  description: "A student venture at Dharav High School, Bhankrota, Jaipur, turning temple flowers into rangoli colour and flower compost. Credit. Community. Change.",
  applicationName: "ReCCCreate",
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
  openGraph: { title: "ReCCCreate — A second life for temple flowers", description: "Temple flowers remade as rangoli colour and compost by students at Dharav High School, Bhankrota, Jaipur.", url: siteUrl, siteName: "ReCCCreate", locale: "en_IN", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "ReCCCreate — A second life for temple flowers", description: "Credit. Community. Change. From Dharav High School, Bhankrota, Jaipur.", images: [socialImage.url] },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${dmSerifDisplay.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <SiteStructuredData />
        <SiteMotion />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {process.env.VERCEL_ENV === "production" && <SiteAnalytics />}
      </body>
    </html>
  );
}
