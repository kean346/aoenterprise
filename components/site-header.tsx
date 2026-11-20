import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { MobileNavigation } from "./mobile-navigation";

export const navigation = [
  ["Services", "#services"],
  ["Our Process", "#process"],
  ["About", "#about"],
  ["Contact", "/contact/"],
] as const;

export function SiteHeader({ home = false }: { home?: boolean }) {
  const start = home ? "#top" : "/";
  const links = [
    ["Home", start],
    ...navigation.map(([label, href]) => [label, !home && href.startsWith("#") ? `/${href}` : href] as const),
  ] as const;

  return (
    <header className={home ? "site-header home-header" : "site-header"}>
      <Link href={start} className="site-mark" aria-label="AO Enterprises home" prefetch={false}>
        <Image className="mark-light" src="/assets/brand/ao-horizontal-light.png" alt="" width={1150} height={250} loading="eager" />
        <Image className="mark-dark" src="/assets/brand/ao-horizontal-dark.png" alt="" width={1150} height={250} />
      </Link>
      <nav className="primary-links" aria-label="Main navigation">
        {links.map(([label, href], index) => (
          <Link key={label} href={href} prefetch={false} aria-current={home ? index === 0 ? "page" : undefined : label === "Contact" ? "page" : undefined} style={{ "--link": index } as CSSProperties}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <MobileNavigation links={links} />
        <a className="tide-button header-quote" href="#rfq">Request a Quote <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </header>
  );
}
