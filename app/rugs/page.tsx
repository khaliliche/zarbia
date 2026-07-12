"use client";

import { useEffect, useState } from "react";
import Catalog from "@/components/Catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProducts } from "@/lib/products";
import { Product } from "@/types/product";

export default function RugsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts("rugs").then(setProducts);
  }, []);

  return (
    <Catalog
      variant="rug"
      eyebrow={t.rugsPage.eyebrow}
      title={t.rugsPage.title}
      lede={t.rugsPage.lede}
      backHome={t.rugsPage.backHome}
      products={products}
    />
  );
}
