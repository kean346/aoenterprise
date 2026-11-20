import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { GlassFeature } from "../components/glass-feature";
import { PaperHero } from "../components/paper-hero";
import { QuoteForm } from "../components/quote-form";
import { SectionMotion } from "../components/section-motion";
import { ScrollFilm } from "../components/scroll-film";
import { ServiceLinks } from "../components/service-links";
import { services } from "../components/services";
import { SiteHeader } from "../components/site-header";

const process = [
  { title: "Share your requirements", copy: "Tell us what you need, including quantities, specifications and any relevant dates." },
  { title: "Receive a tailored quote", copy: "We review your brief, clarify the details and prepare a quote for your consideration." },
  { title: "Confirm your order", copy: "Review the quote and agree on the scope, terms and delivery arrangements." },
  { title: "Supply & fulfilment", copy: "Once confirmed, we coordinate supply in line with the agreed arrangements." },
];

const footerNav = [
  ["Home", "#top"], ["Services", "#services"], ["Our Process", "#process"],
  ["About", "#about"], ["Contact", "#contact"],
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-heading" tabIndex={-1}>
          <div className="shell hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-enter">Procurement · Print · Supply</p>
              <h1 id="hero-heading" className="hero-enter">
                <span>Reliable supply.</span>
                <span>Thoughtfully delivered.</span>
              </h1>
              <p className="hero-summary hero-enter">Bulk stationery, commercial printing and dependable procurement partnerships for South African organisations.</p>
              <div className="hero-actions hero-enter">
                <a className="button button-dark" href="#rfq">Request a Quote <ArrowUpRight size={16} aria-hidden="true" /></a>
                <a className="text-link" href="#services">Explore our services <ArrowDown size={15} aria-hidden="true" /></a>
              </div>
              <nav className="hero-nav" aria-label="Explore AO Enterprises">
                {footerNav.slice(1).map(([label, href]) => <a key={href} href={href}>{label}</a>)}
              </nav>
            </div>
            <PaperHero />
          </div>
        </section>

        <div className="scope-strip">
          <ul className="shell" aria-label="Our areas of supply">
            {services.map((service) => <li className="eyebrow" key={service.id}>{service.ticker}</li>)}
          </ul>
        </div>

        <ScrollFilm />

        <section id="services" className="services-section section-pad" aria-labelledby="services-heading" tabIndex={-1}>
          <div className="shell">
            <div className="services-panel">
              <div className="section-heading services-intro">
                <div>
                  <p className="eyebrow">What we specialise in</p>
                  <h2 id="services-heading">Three disciplines.<br />One dependable partner.</h2>
                </div>
                <div className="services-aside">
                  <p className="section-summary">From one bulk order to an ongoing supply arrangement, AO helps you source what your organisation needs.</p>
                  <a href="#rfq" className="button button-outline">Request a Quote <ArrowUpRight size={15} aria-hidden="true" /></a>
                </div>
              </div>
              <div className="service-grid">
                {services.map((service, index) => (
                  <article key={service.id} className="service-card" data-reveal>
                    <a href="#rfq" data-service={service.id} aria-labelledby={"service-title-" + service.id + " service-action-" + service.id}>
                      <div className="service-body">
                        <div className="service-meta"><span className="eyebrow" aria-hidden="true">0{index + 1}</span></div>
                        <div className="service-art">
                          <Image className="service-icon" src={"/assets/services/" + service.id + "-line-icon.svg"} alt="" width={72} height={72} />
                          <div className={"service-image service-image-" + service.id}>
                            <Image src={"/assets/services/" + service.id + "-demo.webp"} alt={service.imageAlt} width={service.imageWidth} height={284} sizes="(max-width: 700px) 80vw, 29vw" />
                          </div>
                        </div>
                        <h3 id={"service-title-" + service.id}>{service.name}</h3>
                        <p>{service.copy}</p>
                        <span className="service-action" id={"service-action-" + service.id}>Enquire <ArrowUpRight size={16} aria-hidden="true" /></span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="approach-section section-pad" aria-labelledby="about-heading" tabIndex={-1}>
          <div className="shell approach-inner">
            <div className="section-heading">
              <p className="eyebrow with-rule">About AO</p>
              <h2 id="about-heading">Procurement should feel straightforward.</h2>
            </div>
            <div>
              <p className="section-summary">Based in Pretoria, AO Enterprises helps organisations source stationery, arrange commercial printing and plan recurring orders. We start with your specifications, quantities and purchasing cycle, then quote for what you need.</p>
              <a href="#process" className="text-link">See how we work <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <GlassFeature />

        <section id="process" className="process-section section-pad" aria-labelledby="process-heading" tabIndex={-1}>
          <div className="shell">
            <div className="section-heading process-intro">
              <div>
                <p className="eyebrow with-rule">Our process</p>
                <h2 id="process-heading">From enquiry<br />to fulfilment.</h2>
              </div>
              <p className="section-summary">It starts with a brief. We work through the details with you before you confirm an order.</p>
            </div>
            <ol className="process-grid" data-reveal>
              {process.map(({ title, copy }, index) => <li key={title}>
                <span className="process-number" aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>)}
            </ol>
          </div>
        </section>

        <section className="documents-section" aria-labelledby="documents-heading">
          <div className="shell documents-inner">
            <div>
              <p className="eyebrow with-rule">For procurement teams</p>
              <h2 id="documents-heading">Company documentation</h2>
            </div>
            <dl className="documents-list">
              <div><dt>CIPC</dt><dd>Registration details pending</dd></div>
              <div><dt>SARS</dt><dd>Details pending verification</dd></div>
              <div><dt>CSD</dt><dd>Supplier details pending</dd></div>
            </dl>
          </div>
        </section>

        <section id="contact" className="contact-section section-pad" aria-labelledby="contact-heading" tabIndex={-1}>
          <div className="shell contact-inner">
            <div className="section-heading">
              <p className="eyebrow with-rule">Contact</p>
              <h2 id="contact-heading">Tell us what you<br /> need to source.</h2>
              <p className="section-summary">Share your quantities, print specifications or recurring supply needs to prepare a quote request.</p>
              <a href="#rfq" className="text-link">Go to quote form <ArrowDown size={15} aria-hidden="true" /></a>
              <p className="contact-location"><MapPin size={16} aria-hidden="true" /> Pretoria, Gauteng, South Africa</p>
            </div>
            <div id="rfq" className="contact-form" tabIndex={-1}><QuoteForm /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer-main">
            <a href="#top" className="footer-brand" aria-label="Back to home">
              <Image src="/assets/brand/ao-horizontal-dark.png" width={1150} height={250} alt="AO Enterprises" />
            </a>
            <div>
              <h2 className="eyebrow">Services</h2>
              <ul>{services.map((service) => <li key={service.id}><a href="#rfq" data-service={service.id}>{service.name}</a></li>)}</ul>
            </div>
            <nav aria-label="Footer navigation">
              <h2 className="eyebrow">Explore</h2>
              <ul>{footerNav.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            </nav>
            <div>
              <h2 className="eyebrow">Office</h2>
              <address>Pretoria, Gauteng<br />South Africa</address>
              <p>Email and phone to be confirmed.</p>
            </div>
          </div>
          <div className="footer-base">
            <p>© {new Date().getUTCFullYear()} AO Enterprises (Pty) Ltd</p>
            <a href="#top" className="text-link">Back to top <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </footer>
      <ServiceLinks />
      <SectionMotion />
    </>
  );
}
