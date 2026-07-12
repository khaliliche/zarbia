"use client";

import LogoMark from "@/components/LogoMark";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap justify-between items-center gap-4 text-sm text-stone-500">
      <div className="flex items-center gap-2 font-display font-bold text-stone-700">
        <LogoMark className="w-5 h-6" />
        Zarbia
      </div>
      <div>© {new Date().getFullYear()} — {t.footer}</div>
    </footer>
  );
}
