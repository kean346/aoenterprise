import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./tide.css";

const description = "AO Enterprises supplies bulk stationery, commercial printing and long-term procurement support from Pretoria, Gauteng.";

export const metadata: Metadata = {
  title: "AO Enterprises | Stationery, Print & Procurement",
  description,
  openGraph: { title: "AO Enterprises | Stationery, Print & Procurement", description, type: "website", locale: "en_ZA" },
  icons: { icon: "/assets/brand/ao-emblem-gold.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en-ZA"><body>{children}</body></html>;
}
