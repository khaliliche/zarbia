"use client";

import Catalog from "@/components/Catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function DjellabasPage() {
  const { t } = useLanguage();
  return (
    <Catalog
      variant="djellaba"
      eyebrow={t.djellabasPage.eyebrow}
      title={t.djellabasPage.title}
      lede={t.djellabasPage.lede}
      backHome={t.djellabasPage.backHome}
      products={t.djellabasPage.products}
    />
  );
}
