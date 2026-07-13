"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import Fringe from "@/components/Fringe";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { locales } from "@/lib/i18n/translations";

export default function Nav() {
  const { t, locale, setLocale } = useLanguage();

  const navLink = "relative py-1 hover:text-stone-900 transition after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-orange-700 after:transition-all hover:after:w-full";

  return (
    <nav className="sticky top-0 z-50 bg-stone-100/85 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight group">
          <LogoMark className="w-6 h-7 transition-transform duration-500 group-hover:rotate-90" />
          Zarbia
        </Link>
        <div className="hidden md:flex gap-8 text-sm text-stone-600">
          <Link href="/rugs" className={navLink}>{t.nav.rugs}</Link>
          <Link href="/djellabas" className={navLink}>{t.nav.djellabas}</Link>
          <Link href="/#about" className={navLink}>{t.nav.about}</Link>
          <Link href="/#workshops" className={navLink}>{t.nav.workshops}</Link>
          <Link href="/#contact" className={navLink}>{t.nav.contact}</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex border border-stone-300 rounded-full overflow-hidden text-xs font-mono2">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`px-3 py-1.5 transition ${
                  locale === l.code ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
         <Link
            href="/custom-order"
            className="hidden sm:inline text-sm font-mono2 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-stone-50 transition"
          >
            {t.nav.cta}
          </Link>
        </div>
      </div>
      <div className="text-orange-700"><Fringe /></div>
    </nav>
  );
} 