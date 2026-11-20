import Image from "next/image";
import { ArrowDown, ArrowUpRight, UserRound } from "lucide-react";
import { ContactSection } from "../components/contact-section";
import { GlassFeature } from "../components/glass-feature";
import { PaperHero } from "../components/paper-hero";
import { ScrollFilm } from "../components/scroll-film";
import { SectionMotion } from "../components/section-motion";
import { ServiceLinks } from "../components/service-links";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { services } from "../components/services";

const pillars = [
  { title: "Bulk and contract pricing", copy: "Pricing based on order volumes and recurring supply needs." },
  { title: "Coordinated delivery", copy: "Delivery areas and schedules agreed as part of your quote." },
  { title: "Procurement documentation", copy: "Requirements for company and tender documents reviewed with your brief." },
  { title: "Dedicated account contact", copy: "A point of contact for specifications, orders and ongoing supply." },
];

const directors = [
  { name: "Alwyn van der Merwe", title: "Chief Executive Officer (CEO)" },
  { name: "Sibusiso Junior Oratilwe Mkhatshwa", title: "Chief Operating Officer (COO)" },
  { name: "Kerrigan Adams", title: "Chief Financial Officer (CFO)" },
];

const process = [
  { title: "Share your requirements", copy: "Tell us what you need, including quantities, specifications and any relevant dates." },
  { title: "Receive a tailored quote", copy: "We review your brief, clarify the details and prepare a quote for your consideration." },
  { title: "Confirm your order", copy: "Review the quote and agree on the scope, terms and delivery arrangements." },
  { title: "Supply and fulfilment", copy: "Once confirmed, we coordinate supply in line with the agreed arrangements." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-heading">
          <SiteHeader />
          <PaperHero />
        </section>

        <ScrollFilm />

        <section id="services" className="services-section section-pad" aria-labelledby="services-heading" tabIndex={-1}>
          <div className="services-panel">
            <div className="section-heading services-intro">
              <h2 id="services-heading">Reliable supply.<br />Thoughtfully delivered.</h2>
              <div className="services-aside">
                <p className="section-summary">Bulk stationery, commercial printing and dependable procurement partnerships for South African organisations.</p>
                <a href="#service-details" className="button button-outline">Explore our services</a>
              </div>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article key={service.id} className="service-card">
                  <Image className="service-icon" src={`/assets/services/${service.id}-line-icon.svg`} alt="" width={72} height={72} loading="eager" />
                  <h3><a href={`#service-${service.id}`}>{service.name}</a></h3>
                  <p>{service.copy}</p>
                  <a className="service-action" href="#rfq" data-service={service.id} aria-label={`Enquire about ${service.name}`}>
                    Enquire <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="value-section section-pad" aria-labelledby="value-heading">
          <div className="shell">
            <div className="section-heading">
              <h2 id="value-heading">Why choose AO?</h2>
            </div>
            <ul className="value-grid">
              {pillars.map(({ title, copy }) => <li key={title}><h3>{title}</h3><p>{copy}</p></li>)}
            </ul>
            <div className="documents-strip">
              <h3 id="documents-heading">Company documentation</h3>
              <dl className="documents-list" aria-labelledby="documents-heading">
                <div><dt>CIPC</dt><dd>Registration details pending</dd></div>
                <div><dt>SARS</dt><dd>Tax status details pending</dd></div>
                <div><dt>CSD</dt><dd>Supplier details pending</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section id="service-details" className="service-details section-pad" aria-labelledby="service-details-heading" tabIndex={-1}>
          <div className="shell">
            <div className="section-heading"><h2 id="service-details-heading">What we supply</h2></div>
            <div className="service-detail-list">
              {services.map((service) => (
                <article className="service-detail" id={`service-${service.id}`} key={service.id} tabIndex={-1}>
                  <h3>{service.name}</h3>
                  <div>
                    <p>{service.detail}</p>
                    <ul>{service.offerings.map((offering) => <li key={offering}>{offering}</li>)}</ul>
                    <a className="text-link" href="#rfq" data-service={service.id}>Request a Quote <ArrowUpRight size={14} aria-hidden="true" /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="approach-section section-pad" aria-labelledby="about-heading" tabIndex={-1}>
          <div className="shell">
            <div className="approach-inner">
              <div className="section-heading">
                <h2 id="about-heading">About AO Enterprises</h2>
              </div>
              <div>
                <p className="section-summary">AO Enterprises (Pty) Ltd is based in Pretoria. We bring commercial procurement, bulk supply and fulfilment together for South African organisations, with a focus on efficient ordering and long-term partnerships.</p>
                <a href="#process" className="text-link">See how we work <ArrowDown size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="statements">
              <div><h3>Vision</h3><p>Statement to be provided.</p></div>
              <div><h3>Mission</h3><p>Statement to be provided.</p></div>
            </div>
            <div className="board" aria-labelledby="board-heading">
              <h3 id="board-heading">Board of Directors</h3>
              <ul className="board-grid">
                {directors.map(({ name, title }) => (
                  <li key={name}>
                    <div className="director-portrait" role="img" aria-label={`Headshot for ${name} pending`}>
                      <UserRound size={28} strokeWidth={0.9} aria-hidden="true" />
                    </div>
                    <div>
                      <h4>{name}</h4>
                      <p>{title}</p>
                      <p className="director-bio">Biography to be provided.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="process" className="process-section section-pad" aria-labelledby="process-heading" tabIndex={-1}>
          <div className="shell">
            <div className="section-heading process-intro">
              <div><h2 id="process-heading">From enquiry to fulfilment</h2></div>
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

        <GlassFeature />

        <ContactSection />
      </main>
      <SiteFooter />
      <ServiceLinks />
      <SectionMotion />
    </>
  );
}
