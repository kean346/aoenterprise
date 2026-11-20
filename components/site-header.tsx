import Image from "next/image";

export const navigation = [
  ["Services", "#services"],
  ["Our Process", "#process"],
  ["About", "#about"],
  ["Contact", "/contact/"],
] as const;

export function SiteHeader() {
  return (
    <header className="hero-rail">
      <a className="hero-brand" href="#top" aria-label="AO Enterprises home">
        <Image src="/assets/brand/ao-horizontal-light.png" alt="AO Enterprises" width={1150} height={250} />
      </a>
      <nav className="hero-nav" aria-label="Main navigation">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="hero-message">
        <h1 id="hero-heading">Reliable bulk supply.<br />Print and fulfilment.</h1>
        <p>Stationery, commercial printing and supply contracts for South African businesses and institutions.</p>
        <a className="button button-dark hero-quote" href="#rfq">Request a Quote</a>
      </div>
    </header>
  );
}
