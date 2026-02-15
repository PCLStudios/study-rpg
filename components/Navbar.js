"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#1A1A22] p-4 flex justify-center gap-10 sticky top-0 z-50">
      <Link href="/" className="text-white hover:text-purple-400 transition">Home</Link>
      <Link href="/shop" className="text-white hover:text-purple-400 transition">Shop</Link>
      <Link href="/collection" className="text-white hover:text-purple-400 transition">Collection</Link>
      <Link href="/inventory" className="text-white hover:text-purple-400 transition">Inventory</Link>
    </nav>
  );
}
