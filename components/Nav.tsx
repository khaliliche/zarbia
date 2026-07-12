"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { locales } from "@/lib/i18n/translations";

export default function Nav() {
  const { t, locale, setLocale } = useLanguage();

  return (
    <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-7">
      <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight">
        <LogoMark className="w-6 h-7" />
        Zarbia
      </Link>
      <div className="hidden md:flex gap-8 text-sm text-stone-600">
        <Link href="/rugs" className="hover:text-stone-900 transition">{t.nav.rugs}</Link>
        <Link href="/djellabas" className="hover:text-stone-900 transition">{t.nav.djellabas}</Link>
        <Link href="/#about" className="hover:text-stone-900 transition">{t.nav.about}</Link>
        <Link href="/#workshops" className="hover:text-stone-900 transition">{t.nav.workshops}</Link>
        <Link href="/#contact" className="hover:text-stone-900 transition">{t.nav.contact}</Link>
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
          href="/rugs"
          className="hidden sm:inline text-sm font-mono2 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-stone-50 transition"
        >
          {t.nav.cta}
        </Link>
      </div>
    </nav>
  );
}
