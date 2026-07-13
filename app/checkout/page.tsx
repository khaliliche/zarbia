"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart/CartContext";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "", address: "", city: "", country: "Morocco", payment_method: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    const supabase = createClient();

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          address: form.address,
          city: form.city,
          country: form.country,
          payment_method: form.payment_method,
          total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display font-bold text-3xl mb-4">Order received</h1>
          <p className="text-stone-600">
            Thank you — the workshop will contact you shortly to confirm your order and payment details.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-8">Checkout</h1>

        {items.length === 0 ? (
          <p className="text-stone-500">Your cart is empty.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-stone-200 p-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity} {item.currency}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>{total} MAD</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono2 mb-1">Full Name *</label>
              <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">WhatsApp number *</label>
              <input required value={form.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value)} placeholder="+212 6..." className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">Delivery Address *</label>
              <textarea required value={form.address} onChange={(e) => updateField("address", e.target.value)} rows={3} className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">City</label>
              <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">Country</label>
              <input value={form.country} onChange={(e) => updateField("country", e.target.value)} className="w-full border border-stone-300 px-4 py-3 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-mono2 mb-1">Preferred Payment Method *</label>
              <select required value={form.payment_method} onChange={(e) => updateField("payment_method", e.target.value)} className="w-full border border-stone-300 px-4 py-3 bg-white">
                <option value="cod">Cash on Delivery</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              <p className="text-xs text-stone-500 mt-1">The workshop will confirm final payment details with you directly.</p>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" disabled={submitting} className="bg-orange-700 text-white px-8 py-3 font-mono2 text-sm hover:bg-orange-800 transition disabled:opacity-50">
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
