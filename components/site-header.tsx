"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const navigation = [
  ["Home", "#top"], ["Services", "#services"], ["Our Process", "#process"],
  ["About", "#about"], ["Contact", "#contact"],
] as const;

export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selectedSection = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 28);
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) dialog.current?.close(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  function showMenu() {
    dialog.current?.showModal();
    setOpen(true);
  }

  function openSection(event: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (!target) return;
    selectedSection.current = target;
    dialog.current?.close();
  }

  return (
    <header className={compact ? "site-header is-compact" : "site-header"}>
      <div className="shell header-inner">
        <a className="brand-link" href="#top" aria-label="AO Enterprises home">
          <Image src="/assets/brand/ao-horizontal-light.png" alt="AO Enterprises" width={1150} height={250} preload />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="button button-outline header-quote" href="#rfq">Request a Quote</a>
        <button type="button" ref={trigger} className="menu-trigger" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={showMenu}><Menu size={24} strokeWidth={1.5} /></button>
      </div>
      <dialog
        id="mobile-navigation"
        ref={dialog}
        className="mobile-menu"
        aria-label="Mobile navigation"
        onClose={() => {
          setOpen(false);
          (selectedSection.current ?? trigger.current)?.focus({ preventScroll: true });
          selectedSection.current = null;
        }}
      >
        <div className="mobile-menu-top">
          <Image src="/assets/brand/ao-horizontal-light.png" alt="AO Enterprises" width={1150} height={250} />
          <button type="button" className="menu-trigger" aria-label="Close menu" autoFocus onClick={() => dialog.current?.close()}><X size={24} strokeWidth={1.5} /></button>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map(([label, href]) => <a key={href} href={href} onClick={openSection}>{label}</a>)}
          <a className="button button-dark mobile-quote" href="#rfq" onClick={openSection}>Request a Quote</a>
        </nav>
      </dialog>
    </header>
  );
}
