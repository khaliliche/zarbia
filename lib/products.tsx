import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export async function getProducts(categorySlugs?: string | string[]): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (categorySlugs) {
    const slugs = Array.isArray(categorySlugs) ? categorySlugs : [categorySlugs];
    const { data: categories } = await supabase
      .from("categories")
      .select("id")
      .in("slug", slugs);

    if (categories && categories.length > 0) {
      const ids = categories.map((c) => c.id);
      query = query.in("category_id", ids);
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}
