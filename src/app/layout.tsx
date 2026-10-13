import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Montserrat } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const socialImage = siteUrl ? "/images/marigold-to-color.webp" : undefined;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "ReCCCreate — A second life for temple flowers",
    template: "%s | ReCCCreate",
  },
  description:
    "A student-led circularity project in Jaipur, turning temple-offered flowers into natural gulaal and compost. Credit. Community. Change.",
  applicationName: "ReCCCreate",
  openGraph: {
    title: "ReCCCreate — A second life for temple flowers",
    description:
      "From temple offerings to something useful again. A student-led circularity project in Jaipur.",
    type: "website",
    images: socialImage ? [{ url: socialImage, width: 1200, height: 900, alt: "Marigold petals and natural pigment" }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "ReCCCreate — A second life for temple flowers",
    description: "Credit. Community. Change. A Jaipur student venture giving flowers a second life.",
    images: socialImage ? [socialImage] : undefined,
  },
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
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
