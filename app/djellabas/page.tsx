"use client";

import { useEffect, useState } from "react";
import Catalog from "@/components/Catalog";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProducts } from "@/lib/products";
import { Product } from "@/types/product";

export default function DjellabasPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts(["mens-djellabas", "womens-djellabas"]).then(setProducts);
  }, []);

  return (
    <Catalog
      variant="djellaba"
      eyebrow={t.djellabasPage.eyebrow}
      title={t.djellabasPage.title}
      lede={t.djellabasPage.lede}
      backHome={t.djellabasPage.backHome}
      products={products}
    />
  );
}
