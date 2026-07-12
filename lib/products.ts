import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}