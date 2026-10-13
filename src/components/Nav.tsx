"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact Us" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `border-b-[3px] py-1 font-extrabold uppercase tracking-[0.08em] text-[15px] text-ink transition-colors hover:border-gold-dark ${
      pathname === href ? "border-gold-dark" : "border-transparent"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-gold shadow-soft">
      <nav aria-label="Main" className="container-site flex min-h-16 items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-[0.04em] text-ink"
          onClick={() => setOpen(false)}
        >
          ReCCCreate
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={linkClass(l.href)}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-xl border-2 border-ink px-4 py-2 text-[15px] font-extrabold uppercase tracking-[0.08em] text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="container-site flex flex-col gap-1 pb-4 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${linkClass(l.href)} inline-block py-2`}
                aria-current={pathname === l.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
