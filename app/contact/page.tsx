import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "../../components/contact-section";
import { SiteFooter } from "../../components/site-footer";

export const metadata: Metadata = {
  title: "Contact & Request a Quote | AO Enterprises",
  description: "Contact AO Enterprises in Pretoria for bulk stationery, commercial printing and supply contract enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header id="top" className="contact-page-header">
        <div className="shell">
          <Link className="contact-page-brand" href="/" aria-label="AO Enterprises home">
            <Image src="/assets/brand/ao-horizontal-light.png" alt="AO Enterprises" width={1150} height={250} />
          </Link>
          <Link className="text-link" href="/">Home</Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <ContactSection standalone />
      </main>
      <SiteFooter standalone />
    </>
  );
}
