"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomOrder } from "@/types/product";
import { Trash2, Plus, X } from "lucide-react";

type OrderRow = CustomOrder & { id: string; status: string; created_at: string };

const emptyForm = {
  name: "",
  email: "",
  whatsapp: "",
  country: "",
  product_type: "",
  fabric: "",
  color: "",
  budget: "",
  measurements: "",
  notes: "",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const supabase = createClient();
    const { data } = await supabase
      .from("custom_orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as OrderRow[]) || []);
  }

  async function updateStatus(id: string, status: string) {
  const supabase = createClient();
  await supabase.from("custom_orders").update({ status }).eq("id", id);

  if (["confirmed", "quoted", "closed"].includes(status)) {
    const order = orders.find((o) => o.id === id);
    if (order) {
      fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          name: order.name,
          email: order.email,
          whatsapp: order.whatsapp,
          status
        }),
      }).catch((err) => console.error("Notify failed:", err));
    }
  }

  loadOrders();
}

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order permanently?")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("custom_orders").delete().eq("id", id);
    if (error) alert("Delete failed: " + error.message);
    await loadOrders();
    setDeletingId(null);
  }

  async function addOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.product_type) {
      alert("Name and product type are required.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("custom_orders").insert({
      ...form,
      status: "new",
    });
    setSaving(false);
    if (error) {
      alert("Could not add order: " + error.message);
      return;
    }
    setForm(emptyForm);
    setShowForm(false);
    loadOrders();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-bold text-2xl">Custom Orders</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-stone-900 text-white text-sm px-4 py-2 hover:bg-stone-700 transition"
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "Cancel" : "Add order manually"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addOrder}
          className="bg-white border border-stone-200 p-5 mb-6 grid sm:grid-cols-2 gap-3"
        >
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Product type * (e.g. mens-djellaba, rug)"
            value={form.product_type}
            onChange={(e) => setForm({ ...form, product_type: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Fabric"
            value={form.fabric}
            onChange={(e) => setForm({ ...form, fabric: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm"
            placeholder="Budget"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
          <input
            className="border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
            placeholder="Measurements"
            value={form.measurements}
            onChange={(e) => setForm({ ...form, measurements: e.target.value })}
          />
          <textarea
            className="border border-stone-300 px-3 py-2 text-sm sm:col-span-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 bg-orange-700 text-white text-sm py-2 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save order"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {orders.length === 0 && <p className="text-stone-500">No custom orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-stone-200 p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold">{o.name}</h2>
                <p className="text-sm text-stone-500">
                  {o.email} · {o.whatsapp || "no whatsapp"} · {o.country || "no country"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border border-stone-300 px-3 py-1 text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="quoted">Quoted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  onClick={() => deleteOrder(o.id)}
                  disabled={deletingId === o.id}
                  aria-label="Delete order"
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 text-sm text-stone-600 grid sm:grid-cols-2 gap-2">
              <p><strong>Product:</strong> {o.product_type}</p>
              <p><strong>Fabric:</strong> {o.fabric || "—"}</p>
              <p><strong>Color:</strong> {o.color || "—"}</p>
              <p><strong>Budget:</strong> {o.budget || "—"}</p>
              <p className="sm:col-span-2"><strong>Measurements:</strong> {o.measurements || "—"}</p>
              <p className="sm:col-span-2"><strong>Notes:</strong> {o.notes || "—"}</p>
              {o.inspiration_image_url && (
                <a
                  href={o.inspiration_image_url}
                  target="_blank"
                  className="text-orange-700 underline sm:col-span-2"
                >
                  View inspiration image
                </a>
              )}  
            </div>
            <p className="text-xs text-stone-400 mt-3">{new Date(o.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}