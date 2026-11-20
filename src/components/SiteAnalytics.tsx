"use client";

import { Analytics } from "@vercel/analytics/next";

const publicPages = new Set(["/", "/about", "/shop", "/team", "/contact", "/phool-mitra", "/privacy", "/terms", "/returns"]);

export default function SiteAnalytics() {
  return <Analytics beforeSend={(event) => {
    const url = new URL(event.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (!publicPages.has(path)) return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  }} />;
}
