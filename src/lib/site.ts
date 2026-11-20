import type { Metadata } from "next";

const fallbackOrigin = "https://recccreate.in";
function publicOrigin() {
  try {
    const candidate = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackOrigin);
    if (candidate.protocol !== "https:" || candidate.hostname === "localhost" || candidate.hostname === "127.0.0.1") return fallbackOrigin;
    return candidate.origin;
  } catch { return fallbackOrigin; }
}
export const siteUrl = publicOrigin();
export const isPreview = process.env.VERCEL_ENV === "preview";
export const siteName = "ReCCCreate";
export const policyUpdated = "20 November 2026";
export const socialImage = { url: "/social/recccreate-share.png", width: 1200, height: 630, alt: "ReCCCreate: temple flowers remade as rangoli colour and compost in Jaipur" };
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: `${title} | ${siteName}` }, description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteName}`, description, url: new URL(path, siteUrl), siteName, locale: "en_IN", type: "website", images: [socialImage] },
    twitter: { card: "summary_large_image", title: `${title} | ${siteName}`, description, images: [socialImage.url] },
  };
}
