"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  size: string;
  color: string;
  quantity: number;
  image_url?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("zarbia-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("zarbia-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuantity(index: number, quantity: number) {
    setItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = Math.max(1, quantity);
      return copy;
    });
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("zarbia-cart");
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
