import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about", "/shop", "/phool-mitra", "/contact", "/privacy", "/terms", "/returns"].map((path) => ({ url: new URL(path, siteUrl).href }));
}
