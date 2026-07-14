"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem("zarbia-admin-unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  function checkPasscode() {
    if (passInput === process.env.NEXT_PUBLIC_ADMIN_PASSCODE) {
      sessionStorage.setItem("zarbia-admin-unlocked", "true");
      setUnlocked(true);
    } else {
      alert("Wrong passcode");
    }
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
          <button onClick={checkPasscode} className="w-full bg-stone-900 text-white py-3">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="bg-stone-900 text-white px-6 py-4 flex items-center gap-6">
        <span className="font-bold">Zarbia Admin</span>
        <Link href="/admin/products" className={`text-sm ${pathname === "/admin/products" ? "text-amber-400" : "text-stone-300"}`}>
          Products
        </Link>
        <Link href="/admin/orders" className={`text-sm ${pathname === "/admin/orders" ? "text-amber-400" : "text-stone-300"}`}>
          Custom Orders
        </Link>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}
