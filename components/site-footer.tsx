import Image from "next/image";
import { navigation } from "./site-header";
import { services } from "./services";

export function SiteFooter({ standalone = false }: { standalone?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <a href={standalone ? "/" : "#top"} className="footer-brand" aria-label="AO Enterprises home">
            <Image src="/assets/brand/ao-horizontal-light.png" width={1150} height={250} alt="AO Enterprises" />
          </a>
          <div>
            <h2 className="eyebrow">Services</h2>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <a href={`${standalone ? "/" : ""}#service-${service.id}`}>{service.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer navigation">
            <h2 className="eyebrow">Explore</h2>
            <ul>
              <li><a href={standalone ? "/" : "#top"}>Home</a></li>
              {navigation.map(([label, href]) => (
                <li key={href}><a href={standalone && href.startsWith("#") ? `/${href}` : href}>{label}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="eyebrow">Office</h2>
            <address>Pretoria, Gauteng<br />South Africa</address>
            <p>Email and phone to be confirmed.</p>
          </div>
        </div>
        <div className="footer-base">
          <p>© {new Date().getUTCFullYear()} AO Enterprises (Pty) Ltd</p>
          <a href="#top" className="text-link">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
