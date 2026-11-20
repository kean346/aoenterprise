"use client";

import { useEffect } from "react";

export function SectionMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("has-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.2 });

    for (const element of document.querySelectorAll("[data-reveal]")) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return null;
}
