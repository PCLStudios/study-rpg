"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getChuts } from "../../lib/sp";

function rarityColor(r) {
  if (r === 'legendary') return 'ring-yellow-400';
  if (r === 'epic') return 'ring-purple-500';
  if (r === 'rare') return 'ring-blue-400';
  return 'ring-gray-500';
}

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [chuts, setChuts] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('inventory');
    setInventory(raw ? JSON.parse(raw) : []);
    setChuts(getChuts());
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Inventory</h1>
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
              <div className="text-xs text-gray-300">Chuts</div>
              <div className="font-bold">{chuts}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {inventory.length === 0 && (
              <div className="text-gray-400">No items yet. Try spinning in the Shop!</div>
            )}
            {inventory.map((item) => (
              <div key={item.id} className={`bg-white/5 p-4 rounded-2xl border border-white/10 glass ring-2 ${rarityColor(item.rarity)} hover:scale-105 hover:-translate-y-1 transform transition-all duration-200`}>
                <div className="w-full rounded-lg mb-3 bg-black/10 h-40 flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full object-contain" />
                </div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-400">Rarity: {item.rarity}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
