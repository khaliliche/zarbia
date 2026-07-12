"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function CustomOrderPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    product_type: "",
    fabric: "",
    color: "",
    measurements: "",
    budget: "",
    notes: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    let imageUrl: string | null = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("custom-order-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("custom-order-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("custom_orders").insert({
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        country: form.country,
        product_type: form.product_type,
        fabric: form.fabric,
        color: form.color,
        measurements: form.measurements,
        budget: form.budget,
        notes: form.notes,
        inspiration_image_url: imageUrl,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or contact us directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900">
        <Nav />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display font-bold text-3xl mb-4">Request received</h1>
          <p className="text-stone-600">
            Thank you — the workshop will review your custom order and send you a quotation soon,
            usually within 1–2 days.
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
        <h1 className="font-display font-bold text-4xl mb-3">Request a Custom Piece</h1>
        <p className="text-stone-600 mb-10">
          Tell us what you have in mind. The workshop will review your request and send you a
          quotation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-mono2 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">WhatsApp number</label>
            <input
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              placeholder="+212 6..."
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Country</label>
            <input
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Product type *</label>
            <select
              required
              value={form.product_type}
              onChange={(e) => updateField("product_type", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            >
              <option value="">Select...</option>
              <option value="mens-djellaba">Men's Djellaba</option>
              <option value="womens-djellaba">Women's Djellaba</option>
              <option value="rug">Rug</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Upload inspiration image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Fabric preference</label>
            <input
              value={form.fabric}
              onChange={(e) => updateField("fabric", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Color</label>
            <input
              value={form.color}
              onChange={(e) => updateField("color", e.target.value)}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Measurements</label>
            <textarea
              value={form.measurements}
              onChange={(e) => updateField("measurements", e.target.value)}
              rows={3}
              placeholder="Height, chest, sleeve length, rug dimensions, etc."
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Budget</label>
            <input
              value={form.budget}
              onChange={(e) => updateField("budget", e.target.value)}
              placeholder="e.g. 1500-2000 MAD"
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          <div>
            <label className="block text-sm font-mono2 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="w-full border border-stone-300 px-4 py-3 bg-white focus:outline-none focus:border-orange-700"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-700 text-stone-50 px-8 py-3 font-mono2 text-sm hover:bg-orange-800 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}