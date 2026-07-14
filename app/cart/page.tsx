"use client";

import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition mb-6">
          <ArrowLeft size={14} /> Continue shopping
        </Link>
        <h1 className="font-display font-bold text-3xl mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-stone-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white border border-stone-200 p-4 flex items-center gap-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-700 to-indigo-900" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-stone-500">{item.size} {item.color && `· ${item.color}`}</p>
                    <p className="text-sm font-mono2 text-orange-800 mt-1">{item.price} {item.currency}</p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(i, parseInt(e.target.value) || 1)}
                    className="w-16 border border-stone-300 px-2 py-1 text-center"
                  />
                  <button onClick={() => removeItem(i)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-stone-300 pt-6">
              <span className="font-bold text-lg">Total: {total} MAD</span>
              <Link href="/checkout" className="bg-orange-700 text-white px-6 py-3 font-mono2 text-sm hover:bg-orange-800 transition">
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
