import type { MetadataRoute } from "next";
import { siteUrl, isPreview } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: isPreview ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, sitemap: `${siteUrl}/sitemap.xml` };
}
