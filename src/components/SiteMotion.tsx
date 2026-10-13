"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((element) => {
      // Above-the-fold and no-JS content stays visible.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.setAttribute("data-motion", "ready");
        observer.observe(element);
      }
    });
    const showAll = () => {
      if (preference.matches) elements.forEach((el) => el.setAttribute("data-visible", "true"));
    };
    preference.addEventListener("change", showAll);
    return () => { observer.disconnect(); preference.removeEventListener("change", showAll); };
  }, [pathname]);
  return null;
}
