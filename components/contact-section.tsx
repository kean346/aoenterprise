import { QuoteForm } from "./quote-form";

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";

  return (
    <section id="contact" className="contact-section section-pad" aria-labelledby="contact-heading" tabIndex={-1}>
      <div className="shell contact-inner">
        <div className="section-heading">
          <Heading id="contact-heading">Contact and quote requests</Heading>
          <p className="section-summary">Share your quantities, print specifications or tender documents to prepare a quote request.</p>
          <dl className="contact-details">
            <div><dt>Office</dt><dd>Pretoria, Gauteng, South Africa</dd></div>
            <div><dt>Email</dt><dd>To be provided</dd></div>
            <div><dt>Phone</dt><dd>To be provided</dd></div>
          </dl>
        </div>
        <div id="rfq" className="contact-form" tabIndex={-1}>
          <QuoteForm standalone={standalone} />
        </div>
      </div>
    </section>
  );
}
