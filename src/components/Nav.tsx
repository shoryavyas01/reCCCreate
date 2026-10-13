"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, [open]);
  const linkClass = (href: string) =>
    `nav-link ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "nav-link-active" : ""}`;

  return (
    <header className="site-header" ref={header}>
      <nav aria-label="Main" className="site-nav container-site">
        <Link href="/" className="brand-lockup" aria-label="ReCCCreate home" onClick={() => setOpen(false)}>
          <BrandLogo />
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
          ref={menuButton}
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
