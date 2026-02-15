"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSP, setSP } from "../lib/sp";

function sampleAnime() {
  const id = Math.floor(Math.random() * 100000).toString();
  return {
    id,
    title: `Anime #${id}`,
    image: `https://picsum.photos/seed/${id}/300/420`
  };
}

export default function Shop() {
  const [sp, setSpState] = useState(1250);
  const [spins, setSpins] = useState(0);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    setSpState(getSP());
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('spins');
      setSpins(s ? parseInt(s, 10) : 0);
    }
  }, []);

  function updateSP(next) {
    setSP(next);
    setSpState(next);
  }

  function buySpins(pack = 1) {
    const cost = 500 * pack; // sample cost
    if (sp < cost) return alert('Not enough SP');
    updateSP(sp - cost);
    const next = spins + 5 * pack;
    setSpins(next);
    localStorage.setItem('spins', String(next));
  }

  function spinOnce() {
    if (spins <= 0) return alert('No spins available');
    setRolling(true);
    setTimeout(() => {
      const anime = sampleAnime();
      const invRaw = localStorage.getItem('inventory');
      const inv = invRaw ? JSON.parse(invRaw) : [];
      // avoid duplicates by id
      if (!inv.find((i) => i.id === anime.id)) inv.unshift(anime);
      localStorage.setItem('inventory', JSON.stringify(inv));
      const next = spins - 1;
      setSpins(next);
      localStorage.setItem('spins', String(next));
      setRolling(false);
      alert(`Unlocked: ${anime.title}`);
    }, 800);
  }

  function spendForSpin() {
    const cost = 100;
    if (sp < cost) return alert('Not enough SP');
    updateSP(sp - cost);
    const next = spins + 1;
    setSpins(next);
    localStorage.setItem('spins', String(next));
  }

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Shop</h1>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <div className="text-sm text-gray-400">Study Points</div>
              <div className="font-bold">{sp} SP</div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 glass">
            <h2 className="text-lg font-semibold mb-3">Spins: {spins}</h2>
            <div className="flex gap-3 flex-wrap">
              <button onClick={spinOnce} disabled={rolling || spins<=0} className="px-4 py-2 bg-white text-black rounded-xl">Use Spin</button>
              <button onClick={() => buySpins(1)} className="px-4 py-2 bg-purple-600 rounded-xl">Buy 5 Spins (500 SP)</button>
              <button onClick={spendForSpin} className="px-4 py-2 bg-blue-600 rounded-xl">Spend 100 SP for 1 Spin</button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Recent Unlocks</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(JSON.parse(localStorage.getItem('inventory') || '[]')).slice(0,6).map((item) => (
                <div key={item.id} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <img src={item.image} alt="art" className="w-full rounded-lg mb-2" />
                  <div className="text-sm">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
