import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CartProvider } from "@/lib/cart/CartContext";

export const metadata: Metadata = {
  title: "Zarbia — Handwoven Rugs & Djellabas",
  description: "Handmade zarbia rugs and djellabas from a working atelier in Oulmes, Morocco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
