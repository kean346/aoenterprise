import type { Metadata } from "next";
import { ContactSection } from "../../components/contact-section";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Contact & Request a Quote | AO Enterprises",
  description: "Contact AO Enterprises in Pretoria for bulk stationery, commercial printing and supply contract enquiries.",
};

export default function ContactPage() {
  return (
    <div id="top" className="contact-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <ContactSection standalone />
      </main>
      <SiteFooter standalone />
    </div>
  );
}
