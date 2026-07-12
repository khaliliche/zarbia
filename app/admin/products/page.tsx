"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("zarbia-admin-unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) loadProducts();
  }, [unlocked]);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
  }

  function checkPasscode() {
    if (passInput === process.env.NEXT_PUBLIC_ADMIN_PASSCODE) {
      sessionStorage.setItem("zarbia-admin-unlocked", "true");
      setUnlocked(true);
    } else {
      alert("Wrong passcode");
    }
  }

  async function handleUpload(productId: string, file: File) {
    setUploading(productId);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(null);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    await supabase.from("product_images").insert({
      product_id: productId,
      image_url: publicUrlData.publicUrl,
      sort_order: 1,
    });

    await loadProducts();
    setUploading(null);
  }

  async function handleDeleteImage(imageId: string) {
    const supabase = createClient();
    await supabase.from("product_images").delete().eq("id", imageId);
    await loadProducts();
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="bg-white p-8 border border-stone-200 w-full max-w-sm">
          <h1 className="font-bold text-xl mb-4">Admin Access</h1>
          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Passcode"
            className="w-full border border-stone-300 px-4 py-3 mb-4"
            onKeyDown={(e) => e.key === "Enter" && checkPasscode()}
          />
          <button
            onClick={checkPasscode}
            className="w-full bg-stone-900 text-white py-3"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <h1 className="font-bold text-2xl mb-8">Manage Product Photos</h1>
      <div className="space-y-6 max-w-3xl">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-stone-200 p-5">
            <h2 className="font-bold">{p.name}</h2>
            <p className="text-sm text-stone-500 mb-3">{p.price} {p.currency}</p>

            <div className="flex flex-wrap gap-3 mb-3">
              {p.product_images?.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} alt="" className="w-24 h-24 object-cover" />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              disabled={uploading === p.id}
              onChange={(e) => e.target.files?.[0] && handleUpload(p.id, e.target.files[0])}
            />
            {uploading === p.id && <span className="text-sm text-stone-500 ml-2">Uploading...</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
