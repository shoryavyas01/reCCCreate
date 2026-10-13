"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#e9eee7" />
      <g fill="#cf783b">
        <ellipse cx="20" cy="11" rx="3.3" ry="6" />
        <ellipse cx="20" cy="11" rx="3.3" ry="6" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="11" rx="3.3" ry="6" transform="rotate(120 20 20)" />
        <ellipse cx="20" cy="11" rx="3.3" ry="6" transform="rotate(180 20 20)" />
        <ellipse cx="20" cy="11" rx="3.3" ry="6" transform="rotate(240 20 20)" />
        <ellipse cx="20" cy="11" rx="3.3" ry="6" transform="rotate(300 20 20)" />
      </g>
      <circle cx="20" cy="20" r="3" fill="#21483b" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const linkClass = (href: string) =>
    `nav-link ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "nav-link-active" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f8f7f2]/90 backdrop-blur-xl">
      <nav aria-label="Main" className="container-site flex min-h-[4.6rem] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2.5 text-[#1b2a23] no-underline" onClick={() => setOpen(false)}>
          <BrandMark />
          <span className="flex flex-col leading-none"><span className="text-[1.05rem] font-bold tracking-[-0.055em]">ReCCCreate</span><span className="mt-1 text-[0.58rem] font-semibold tracking-[0.13em] text-[#718078]">CREDIT. COMMUNITY. CHANGE.</span></span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => <li key={link.href}><Link href={link.href} className={linkClass(link.href)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link></li>)}
          <li><Link href="/shop" className="btn btn-primary min-h-10 px-4 py-2 text-xs">Explore the shop <span aria-hidden="true">↗</span></Link></li>
        </ul>
        <button type="button" className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-[#1b2a23] md:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      </nav>
      {open && <div id="mobile-menu" className="border-t border-black/[0.06] bg-[#f8f7f2] md:hidden"><ul className="container-site flex flex-col gap-1 py-3">{links.map((link) => <li key={link.href}><Link href={link.href} className={`${linkClass(link.href)} block rounded-xl px-3 py-3`} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}</Link></li>)}</ul></div>}
    </header>
  );
}
