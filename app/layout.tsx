import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { SITE_URL } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aurum — Investment-Grade Gold Bullion",
    template: "%s · Aurum",
  },
  description:
    "Aurum is a premium bullion house dealing in certified refined gold bars and coins, and ethically sourced unrefined gold. Secure delivery, full assay certification, escrow on bulk orders.",
  keywords: [
    "gold bullion",
    "buy gold bars",
    "gold coins",
    "unrefined gold",
    "precious metals dealer",
    "24K gold",
  ],
  openGraph: {
    title: "Aurum — Investment-Grade Gold Bullion",
    description:
      "Certified refined bars & coins and ethically sourced unrefined gold. Secure, insured, escrow-backed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold-gradient focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-charcoal"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
