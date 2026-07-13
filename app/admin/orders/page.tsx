"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomOrder } from "@/types/product";

type OrderRow = CustomOrder & { id: string; status: string; created_at: string };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const supabase = createClient();
    const { data } = await supabase.from("custom_orders").select("*").order("created_at", { ascending: false });
    setOrders((data as OrderRow[]) || []);
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("custom_orders").update({ status }).eq("id", id);
    loadOrders();
  }

  return (
    <div>
      <h1 className="font-bold text-2xl mb-6">Custom Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 && <p className="text-stone-500">No custom orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-stone-200 p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-bold">{o.name}</h2>
                <p className="text-sm text-stone-500">{o.email} · {o.whatsapp || "no whatsapp"} · {o.country || "no country"}</p>
              </div>
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
            </div>
            <div className="mt-3 text-sm text-stone-600 grid sm:grid-cols-2 gap-2">
              <p><strong>Product:</strong> {o.product_type}</p>
              <p><strong>Fabric:</strong> {o.fabric || "—"}</p>
              <p><strong>Color:</strong> {o.color || "—"}</p>
              <p><strong>Budget:</strong> {o.budget || "—"}</p>
              <p className="sm:col-span-2"><strong>Measurements:</strong> {o.measurements || "—"}</p>
              <p className="sm:col-span-2"><strong>Notes:</strong> {o.notes || "—"}</p>
              {o.inspiration_image_url && (
                <a href={o.inspiration_image_url} target="_blank" className="text-orange-700 underline sm:col-span-2">
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
