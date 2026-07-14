import type { Metadata } from "next";
import {
  Fraunces,
  Work_Sans,
  IBM_Plex_Mono,
  Cairo,
} from "next/font/google";

import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CartProvider } from "@/lib/cart/CartContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zarbia — Handwoven Rugs & Djellabas",
  description:
    "Handmade zarbia rugs and djellabas from a working atelier in Oulmes, Morocco.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} ${mono.variable} ${cairo.variable}`}
    >
      <body>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}