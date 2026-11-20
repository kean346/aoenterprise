"use client";

import { useEffect } from "react";

export function ServiceLinks() {
  useEffect(() => {
    function selectService(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-service]");
      if (!link) return;
      const dropdown = document.querySelector<HTMLSelectElement>("#rfq-service");
      if (!dropdown || !link.dataset.service) return;
      dropdown.value = link.dataset.service;
      dropdown.dispatchEvent(new Event("change", { bubbles: true }));
    }

    document.addEventListener("click", selectService);
    return () => document.removeEventListener("click", selectService);
  }, []);

  return null;
}
