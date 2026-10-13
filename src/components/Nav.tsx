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
    <svg viewBox="0 0 40 40" className="brand-mark" aria-hidden="true">
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
    <header className="site-header">
      <nav aria-label="Main" className="site-nav container-site">
        <Link href="/" className="brand-lockup" onClick={() => setOpen(false)}>
          <BrandMark />
          <span>
            <span className="brand-name">ReCCCreate</span>
            <span className="brand-tagline">CREDIT · COMMUNITY · CHANGE</span>
          </span>
        </Link>
        <ul className="nav-links hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass(link.href)} aria-current={pathname === link.href ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
          <li><Link href="/shop" className="btn btn-primary nav-cta">Explore the shop <span aria-hidden="true">↗</span></Link></li>
        </ul>
        <button
          type="button"
          className="menu-button md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      <div id="mobile-menu" className="mobile-menu container-site md:hidden" hidden={!open}>
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${linkClass(link.href)} block rounded-xl px-3 py-3`}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="px-2 pb-1 pt-2"><Link href="/shop" className="btn btn-primary w-full" onClick={() => setOpen(false)}>Explore the shop <span aria-hidden="true">↗</span></Link></li>
        </ul>
      </div>
    </header>
  );
}
