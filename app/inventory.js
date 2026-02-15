"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('inventory');
    setInventory(raw ? JSON.parse(raw) : []);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Inventory</h1>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {inventory.length === 0 && (
              <div className="text-gray-400">No items yet. Try spinning in the Shop!</div>
            )}
            {inventory.map((item) => (
              <div key={item.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 glass">
                <img src={item.image} alt={item.title} className="w-full rounded-lg mb-3" />
                <div className="font-semibold">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
