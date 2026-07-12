"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Product = { name: string; kind: string; note: string; price: string };

const rugSwatches = [
  "from-orange-700 via-amber-600 to-indigo-900",
  "from-amber-500 via-orange-600 to-orange-800",
  "from-indigo-900 via-orange-700 to-amber-500",
  "from-orange-800 via-stone-700 to-indigo-900",
  "from-amber-400 via-orange-500 to-stone-800",
  "from-stone-300 via-amber-300 to-orange-400",
];

const djellabaSwatches = [
  "from-indigo-900 via-indigo-800 to-stone-900",
  "from-stone-200 via-amber-200 to-orange-300",
  "from-amber-200 via-stone-200 to-stone-400",
  "from-emerald-800 via-emerald-900 to-stone-900",
  "from-orange-200 via-amber-200 to-stone-300",
  "from-indigo-950 via-indigo-900 to-indigo-700",
];

export default function Catalog({
  variant,
  eyebrow,
  title,
  lede,
  backHome,
  products,
}: {
  variant: "rug" | "djellaba";
  eyebrow: string;
  title: string;
  lede: string;
  backHome: string;
  products: readonly Product[];
}) {
  const { t, dir } = useLanguage();
  const swatches = variant === "rug" ? rugSwatches : djellabaSwatches;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900" dir={dir}>
      <Nav />

      <header className="max-w-6xl mx-auto px-6 pt-6 pb-14">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition">
          <ArrowLeft size={14} className={dir === "rtl" ? "rotate-180" : ""} /> {backHome}
        </Link>
        <div className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase text-orange-800 mt-6">
          <span className="w-6 h-px bg-orange-700 inline-block" />
          {eyebrow}
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl mt-4 max-w-2xl">{title}</h1>
        <p className="text-stone-600 text-lg mt-5 max-w-xl">{lede}</p>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div key={p.name} className="group border border-stone-200 bg-white hover:shadow-lg transition">
              <div className={`h-48 bg-gradient-to-br ${swatches[i % swatches.length]}`} />
              <div className="p-5">
                <div className="text-xs font-mono2 uppercase tracking-wide text-stone-500">{p.kind}</div>
                <h3 className="font-display font-bold text-lg mt-2">{p.name}</h3>
                <p className="text-stone-500 text-sm mt-1">{p.note}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono2 text-orange-800">{p.price}</span>
                  <a
                    href={`/#contact`}
                    className="text-xs font-mono2 border border-stone-900 px-3 py-1.5 group-hover:bg-stone-900 group-hover:text-stone-50 transition"
                  >
                    {t.shop.enquire}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border border-dashed border-stone-300 p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-orange-700" />
            <p className="text-stone-600 text-sm">{t.shop.customNote}</p>
          </div>
          <Link href="/#contact" className="text-sm font-mono2 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-stone-50 transition">
            {t.shop.customCta}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
