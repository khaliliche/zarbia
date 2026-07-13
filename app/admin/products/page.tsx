"use client";

import { useEffect, useState } from "react";
import { Upload, X, LogOut, ImageOff, Diamond } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import LogoMark from "@/components/LogoMark";

export default function AdminProductsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
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
      setPassError(false);
    } else {
      setPassError(true);
    }
  }

  function signOut() {
    sessionStorage.removeItem("zarbia-admin-unlocked");
    setUnlocked(false);
    setPassInput("");
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

  const totalImages = products.reduce((sum, p) => sum + (p.product_images?.length || 0), 0);

  if (!unlocked) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-indigo-950 text-stone-50 overflow-hidden">
        <div className="wool-grain absolute inset-0" />
        <div className="diamond-field absolute inset-0 text-indigo-800 opacity-20" />
        <div className="relative bg-stone-900/80 backdrop-blur border border-indigo-800 w-full max-w-sm mx-6 p-8">
          <div className="flex justify-center mb-6">
            <LogoMark className="w-8 h-9" />
          </div>
          <div className="text-center mb-6">
            <div className="text-xs font-mono2 tracking-widest uppercase text-amber-500">Atelier Studio</div>
            <h1 className="font-display font-bold text-2xl mt-2">Workshop Access</h1>
            <p className="text-stone-400 text-sm mt-2">Enter the passcode to manage product photos.</p>
          </div>
          <input
            type="password"
            value={passInput}
            onChange={(e) => {
              setPassInput(e.target.value);
              setPassError(false);
            }}
            placeholder="Passcode"
            autoFocus
            className={`w-full bg-stone-950/60 border px-4 py-3 mb-2 font-mono2 text-sm text-stone-50 placeholder-stone-500 focus:outline-none transition ${
              passError ? "border-red-500" : "border-indigo-800 focus:border-amber-500"
            }`}
            onKeyDown={(e) => e.key === "Enter" && checkPasscode()}
          />
          {passError && <p className="text-red-400 text-xs font-mono2 mb-4">Wrong passcode — try again.</p>}
          <button
            onClick={checkPasscode}
            className={`w-full bg-amber-500 text-stone-900 font-mono2 text-sm py-3 hover:bg-amber-400 active:scale-[0.98] transition ${passError ? "" : "mt-2"}`}
          >
            Enter the workshop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Studio header */}
      <div className="relative bg-indigo-950 text-stone-50 wool-grain">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <LogoMark className="w-7 h-8" />
            <div>
              <div className="text-xs font-mono2 tracking-widest uppercase text-amber-500">Atelier Studio</div>
              <h1 className="font-display font-bold text-2xl">Product Photos</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-6 text-sm font-mono2">
              <div>
                <div className="text-xl font-display font-bold">{products.length}</div>
                <div className="text-stone-400 text-xs uppercase tracking-wide">Products</div>
              </div>
              <div>
                <div className="text-xl font-display font-bold">{totalImages}</div>
                <div className="text-stone-400 text-xs uppercase tracking-wide">Photos</div>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs font-mono2 border border-stone-700 px-3 py-2 text-stone-300 hover:border-red-500 hover:text-red-400 transition"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
        <div className="text-amber-500/60"><div className="fringe" /></div>
      </div>

      {/* Product ledger */}
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
        {products.length === 0 ? (
          <div className="border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
            <Diamond size={20} className="mx-auto mb-3 text-orange-700" />
            No products yet — add some in Supabase, then their photos will show up here.
          </div>
        ) : (
          <div className="space-y-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-stone-200">
                <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-stone-100">
                  <div>
                    <h2 className="font-display font-bold text-lg">{p.name}</h2>
                    <p className="text-sm font-mono2 text-orange-800">{p.price} {p.currency}</p>
                  </div>
                  <span className="text-xs font-mono2 uppercase tracking-wide text-stone-400">
                    {p.product_images?.length || 0} photo{p.product_images?.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap gap-3 mb-5">
                    {p.product_images && p.product_images.length > 0 ? (
                      p.product_images.map((img) => (
                        <div key={img.id} className="group relative w-24 h-24 border border-stone-200">
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            aria-label="Delete photo"
                            className="absolute -top-2 -right-2 bg-stone-900 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-stone-400 italic">
                        <ImageOff size={16} /> No photos yet
                      </div>
                    )}
                  </div>

                  <label
                    className={`flex items-center justify-center gap-2 border border-dashed px-4 py-3 text-sm font-mono2 cursor-pointer transition w-full sm:w-auto sm:inline-flex ${
                      uploading === p.id
                        ? "border-stone-300 text-stone-400 cursor-wait"
                        : "border-stone-300 text-stone-600 hover:border-orange-700 hover:text-orange-800"
                    }`}
                  >
                    <Upload size={15} />
                    {uploading === p.id ? "Uploading..." : "Add a photo"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading === p.id}
                      onChange={(e) => e.target.files?.[0] && handleUpload(p.id, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}