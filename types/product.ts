export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type ProductImage = {
  id: string
  product_id: string
  image_url: string
  sort_order: number
}

export type Product = {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  price: number
  currency: string
  sizes: string[]
  colors: string[]
  stock: number
  estimated_delivery: string | null
  is_new_arrival: boolean
  product_images?: ProductImage[]
}

export type CustomOrder = {
  name: string
  email: string
  whatsapp: string
  country: string
  product_type: string
  inspiration_image_url: string | null
  fabric: string
  color: string
  measurements: string
  budget: string
  notes: string
}