"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product, Category } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category_id: "", price: "", description: "",
    sizes: "", colors: "", stock: "", estimated_delivery: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((prods as Product[]) || []);
    setCategories((cats as Category[]) || []);
  }

  function slugify(text: string) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
  }

  async function handleCreateProduct() {
    if (!newProduct.name || !newProduct.category_id || !newProduct.price) {
      alert("Name, category, and price are required");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      name: newProduct.name,
      slug: slugify(newProduct.name),
      category_id: newProduct.category_id,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      sizes: newProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: newProduct.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(newProduct.stock) || 0,
      estimated_delivery: newProduct.estimated_delivery,
    });
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    setNewProduct({ name: "", category_id: "", price: "", description: "", sizes: "", colors: "", stock: "", estimated_delivery: "" });
    setShowNewForm(false);
    loadData();
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  async function handleStockChange(id: string, stock: number) {
    const supabase = createClient();
    await supabase.from("products").update({ stock }).eq("id", id);
    loadData();
  }

  async function handleUpload(productId: string, file: File) {
    setUploading(productId);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(null);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    await supabase.from("product_images").insert({ product_id: productId, image_url: publicUrlData.publicUrl, sort_order: 1 });
    await loadData();
    setUploading(null);
  }

  async function handleDeleteImage(imageId: string) {
    const supabase = createClient();
    await supabase.from("product_images").delete().eq("id", imageId);
    loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-2xl">Products</h1>
        <button onClick={() => setShowNewForm(!showNewForm)} className="bg-orange-700 text-white px-4 py-2 text-sm">
          {showNewForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showNewForm && (
        <div className="bg-white border border-stone-200 p-5 mb-6 grid sm:grid-cols-2 gap-3">
          <input placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <select value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })} className="border border-stone-300 px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Price (MAD)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <input placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <input placeholder="Sizes (comma separated)" value={newProduct.sizes} onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <input placeholder="Colors (comma separated)" value={newProduct.colors} onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <input placeholder="Estimated delivery" value={newProduct.estimated_delivery} onChange={(e) => setNewProduct({ ...newProduct, estimated_delivery: e.target.value })} className="border border-stone-300 px-3 py-2" />
          <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border border-stone-300 px-3 py-2 sm:col-span-2" rows={2} />
          <button onClick={handleCreateProduct} className="bg-stone-900 text-white py-2 sm:col-span-2">Create Product</button>
        </div>
      )}

      <div className="space-y-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-stone-500">{p.price} {p.currency} · {p.description}</p>
              </div>
              <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 text-sm border border-red-300 px-3 py-1">
                Delete
              </button>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <label className="text-sm">Stock:</label>
              <input
                type="number"
                defaultValue={p.stock}
                onBlur={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                className="border border-stone-300 px-2 py-1 w-20 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-3 mb-3">
              {p.product_images?.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} alt="" className="w-24 h-24 object-cover" />
                  <button onClick={() => handleDeleteImage(img.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs">×</button>
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
