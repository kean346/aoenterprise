"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";

export function MobileNavigation({ links }: { links: readonly (readonly [string, string])[] }) {
  const panel = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);

  function close(restoreFocus = false) {
    if (panel.current) panel.current.open = false;
    if (restoreFocus) toggle.current?.focus();
  }

  return (
    <details
      className="mobile-navigation"
      ref={panel}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close(true);
      }}
    >
      <summary aria-label="Site navigation" ref={toggle}>
        <Menu className="menu-open" size={18} aria-hidden="true" />
        <X className="menu-close" size={18} aria-hidden="true" />
      </summary>
      <nav aria-label="Mobile navigation">
        {links.map(([label, href]) => <a key={label} href={href} onClick={() => close()}>{label}</a>)}
      </nav>
    </details>
  );
}
