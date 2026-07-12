"use client";

import Catalog from "@/components/Catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RugsPage() {
  const { t } = useLanguage();
  return (
    <Catalog
      variant="rug"
      eyebrow={t.rugsPage.eyebrow}
      title={t.rugsPage.title}
      lede={t.rugsPage.lede}
      backHome={t.rugsPage.backHome}
      products={t.rugsPage.products}
    />
  );
}
