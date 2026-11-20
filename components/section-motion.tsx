"use client";

import { useEffect } from "react";

export function SectionMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.hasAttribute("data-ambient")) {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        } else if (entry.isIntersecting) {
          entry.target.classList.add("has-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.2 });

    for (const element of document.querySelectorAll("[data-reveal], [data-ambient]")) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return null;
}
