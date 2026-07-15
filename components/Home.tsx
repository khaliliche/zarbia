"use client";

import { Scissors, Sparkles, ShoppingBag, Quote, ArrowRight, MapPin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Fringe from "@/components/Fringe";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import  {getProducts }from "@/lib/products";
import { Product } from "@/types/product";

const swatches = [
  "from-orange-700 via-amber-600 to-indigo-900",
  "from-indigo-900 via-indigo-800 to-stone-900",
  "from-amber-500 via-orange-600 to-orange-800",
  "from-stone-200 via-amber-200 to-orange-300",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase text-orange-800">
      <span className="w-6 h-px bg-orange-700 inline-block" />
      {children}
    </div>
  );
}

export default function Home() {
  const { t, locale, dir } = useLanguage();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const fontClass = locale === "ar" ? "font-arabic" : "font-body";

  useEffect(() => {
    getProducts().then((data) => setRealProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className={`min-h-screen bg-stone-100 text-stone-900 ${fontClass}`} dir={dir}>
      <Nav />

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 pt-6 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionLabel>{t.hero.eyebrow}</SectionLabel>
          <h1 className="rise-in font-display font-bold text-5xl md:text-6xl leading-[1.05] mt-5">
            {t.hero.title1}
            <span className="italic font-medium text-orange-700">{t.hero.titleEm}</span>
            {t.hero.title2}
          </h1>
          <p className="mt-6 text-stone-600 text-lg max-w-md">{t.hero.lede}</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#shop" className="inline-flex items-center gap-2 bg-orange-700 text-stone-50 px-6 py-3 font-mono2 text-sm hover:bg-orange-800 active:scale-95 transition">
              <ShoppingBag size={16} /> {t.hero.ctaShop}
            </a>
            <a href="#workshops" className="inline-flex items-center gap-2 border border-stone-900 px-6 py-3 font-mono2 text-sm hover:bg-stone-900 hover:text-stone-50 active:scale-95 transition">
              <Scissors size={16} /> {t.hero.ctaWorkshop}
            </a>
          </div>
          <div className="flex gap-8 mt-12 text-sm">
            <div><div className="font-display font-bold text-2xl">16</div><div className="text-stone-500">{t.hero.stat1}</div></div>
            <div><div className="font-display font-bold text-2xl">100%</div><div className="text-stone-500">{t.hero.stat3}</div></div>
          </div>
        </div>
        <div className="relative h-[420px] hidden md:block">
          <div className="wool-grain absolute top-0 right-0 w-64 h-80 bg-gradient-to-br from-orange-700 via-amber-600 to-indigo-900 shadow-xl rotate-3" />
          <div className="wool-grain absolute bottom-0 left-0 w-56 h-72 bg-gradient-to-br from-indigo-900 via-indigo-800 to-stone-900 shadow-xl -rotate-6" />
          <div className="wool-grain absolute top-24 left-16 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg rotate-12" />
          <div className="absolute -bottom-2 left-0 w-56 text-stone-900/70 rotate-[-6deg]"><Fringe /></div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2">
            <SectionLabel>{t.about.eyebrow}</SectionLabel>
            <h2 className="font-display font-bold text-3xl mt-4">{t.about.title}</h2>
          </div>
          <div className="md:col-span-3 text-stone-600 space-y-4 text-[1.05rem] leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <SectionLabel>{t.shop.eyebrow}</SectionLabel>
            <h2 className="font-display font-bold text-3xl mt-4">{t.shop.title}</h2>
          </div>
          <div className="flex gap-5">
            <Link href="/rugs" className="text-sm font-mono2 inline-flex items-center gap-1 text-orange-800 hover:text-orange-900">
              {t.shop.seeAllRugs} <ArrowRight size={14} className={dir === "rtl" ? "rotate-180" : ""} />
            </Link>
            <Link href="/djellabas" className="text-sm font-mono2 inline-flex items-center gap-1 text-orange-800 hover:text-orange-900">
              {t.shop.seeAllDjellabas} <ArrowRight size={14} className={dir === "rtl" ? "rotate-180" : ""} />
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {realProducts.length === 0 ? (
            <p className="text-stone-500 text-sm col-span-full">No products yet, add some in Supabase.</p>
          ) : (
            realProducts.map((p, i) => (
              <div key={p.id} className="group border border-stone-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="overflow-hidden">
                  {p.product_images && p.product_images.length > 0 ? (
                    <img src={p.product_images[0].image_url} alt={p.name} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className={`wool-grain h-44 bg-gradient-to-br ${swatches[i % swatches.length]} transition-transform duration-500 group-hover:scale-110`} />
                  )}
                </div>
                <div className="text-orange-700/40 group-hover:text-orange-700 transition-colors"><Fringe /></div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mt-2">{p.name}</h3>
                  <p className="text-stone-500 text-sm mt-1">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-mono2 text-orange-800">{p.price} {p.currency}</span>
                    <a href="/custom-order" className="text-xs font-mono2 border border-stone-900 px-3 py-1.5 group-hover:bg-stone-900 group-hover:text-stone-50 transition">
                      {t.shop.enquire}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 border border-dashed border-stone-300 p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-orange-700" />
            <p className="text-stone-600 text-sm">{t.shop.customNote}</p>
          </div>
          <a href="#contact" className="text-sm font-mono2 border border-stone-900 px-4 py-2 hover:bg-stone-900 hover:text-stone-50 transition">
            {t.shop.customCta}
          </a>
        </div>
      </section>

      {/* WORKSHOPS */}
      <section id="workshops" className="relative bg-indigo-950 text-stone-50 wool-grain">
        <div className="text-amber-500/70"><Fringe /></div>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase text-amber-400">
              <span className="w-6 h-px bg-amber-400 inline-block" /> {t.workshops.eyebrow}
            </div>
            <h2 className="font-display font-bold text-3xl mt-4">{t.workshops.title}</h2>
            <p className="text-stone-300 mt-4 max-w-md">{t.workshops.lede}</p>
            <a href="#contact" className="mt-6 inline-flex items-center gap-2 bg-amber-500 text-stone-900 px-6 py-3 font-mono2 text-sm hover:bg-amber-400 transition">
              {t.workshops.cta} <ArrowRight size={16} className={dir === "rtl" ? "rotate-180" : ""} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border border-indigo-800 p-5">
              <div className="font-display text-2xl font-bold">6</div>
              <div className="text-stone-400 mt-1">{t.workshops.k1}</div>
            </div>
            <div className="border border-indigo-800 p-5">
              <div className="font-display text-2xl font-bold">2</div>
              <div className="text-stone-400 mt-1">{t.workshops.k2}</div>
            </div>
            <div className="border border-indigo-800 p-5">
              <div className="font-display text-2xl font-bold">0</div>
              <div className="text-stone-400 mt-1">{t.workshops.k3}</div>
            </div>
            <div className="border border-indigo-800 p-5">
              <div className="font-display text-2xl font-bold">3</div>
              <div className="text-stone-400 mt-1">{t.workshops.k4}</div>
            </div>
          </div>
        </div>
        <div className="text-amber-500/70"><Fringe flip /></div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SectionLabel>{t.testimonialsLabel}</SectionLabel>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {t.testimonials.map((tm) => (
            <div key={tm.name} className="relative bg-white border border-stone-200 p-6 overflow-hidden">
              <Quote size={20} className="text-orange-700 mb-3" />
              <span className="absolute -right-2 -bottom-4 font-display font-bold text-8xl text-stone-100 select-none leading-none">”</span>
              <p className="relative text-stone-600 text-[0.95rem] leading-relaxed">{tm.quote}</p>
              <div className="relative mt-4 text-sm font-mono2 text-stone-500">{tm.name} · {tm.place}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative bg-stone-900 text-stone-50 wool-grain">
        <div className="text-orange-800/70"><Fringe /></div>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display font-bold text-3xl">{t.contact.title}</h2>
            <p className="text-stone-400 mt-4 max-w-sm">{t.contact.lede}</p>
            <div className="mt-8 space-y-3 text-sm text-stone-400">
              <div className="flex items-center gap-2"><MapPin size={16} /> {t.contact.address}</div>
              <div className="flex items-center gap-2"><Mail size={16} /> hello@warpandwool.example</div>
            </div>
          </div>
          <div className="bg-stone-800 border border-stone-700/60 p-8">
            {joined ? (
              <p className="text-amber-400 font-mono2 text-sm">{t.contact.thanks}</p>
            ) : (
              <>
                <label className="text-sm text-stone-300">{t.contact.emailLabel}</label>
                <div className="flex gap-3 mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.placeholder}
                    className="flex-1 bg-stone-900 border border-stone-700 px-4 py-3 text-sm text-stone-50 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => email && setJoined(true)}
                    className="bg-amber-500 text-stone-900 px-5 py-3 font-mono2 text-sm hover:bg-amber-400 active:scale-95 transition"
                  >
                    {t.contact.button}
                  </button>
                </div>
                <p className="text-stone-500 text-xs mt-3">{t.contact.note}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}