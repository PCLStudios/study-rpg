"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getChuts, setChuts, getSpins, setSpins } from "../../lib/sp";
import { fetchAnimeList } from "../../lib/api";

export default function Shop() {
  const [chuts, setChutsLocal] = useState(1250);
  const [spins, setSpinsLocal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setChutsLocal(getChuts());
    setSpinsLocal(getSpins());
    setRecent(JSON.parse(localStorage.getItem("inventory") || "[]").slice(0, 6));
    // prefetch a small catalog
    (async () => {
      try {
        const list = await fetchAnimeList('', 1, 8);
        setCatalog(list || []);
      } catch (e) {
        console.warn('catalog fetch failed', e);
      }
    })();
  }, []);

  function updateChuts(n) {
    setChutsLocal(n);
    setChuts(n);
  }
  function updateSpins(n) {
    setSpinsLocal(n);
    setSpins(n);
  }

  const addInfiniteChuts = () => {
    updateChuts(999999);
  };

  const buySpin = () => {
    const cost = 50; // cheaper spin cost
    if (chuts < cost) { setMessage('Not enough Chuts'); return; }
    const next = chuts - cost;
    updateChuts(next);
    updateSpins(spins + 1);
    setMessage('Bought 1 spin');
  };

  const buyCatalogItem = async (item) => {
    // price 5000 chuts
    const price = 5000;
    if (chuts < price) { setMessage('Not enough Chuts for purchase'); return; }
    setLoading(true);
    try {
      // try to fetch image and convert to data URL
      let image = item.coverImage?.large || item.coverImage?.medium || item.coverImage?.extraLarge || item.coverImage?.large || '';
      if (image && image.startsWith('http')) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const reader = new FileReader();
          const data = await new Promise((res2, rej) => {
            reader.onload = () => res2(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
          image = data;
        } catch (e) {
          console.warn('image convert failed', e);
        }
      }

      const title = item.title?.english || item.title?.romaji || item.title?.native || 'Unknown';
      const invRaw = localStorage.getItem('inventory');
      const inv = invRaw ? JSON.parse(invRaw) : [];
      const entry = { id: String(item.id), title, image };
      inv.unshift(entry);
      localStorage.setItem('inventory', JSON.stringify(inv));
      updateChuts(chuts - price);
      setRecent(inv.slice(0,6));
      setMessage(`Purchased ${title}`);
    } catch (e) {
      console.error(e);
      setMessage('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const doSpin = async () => {
    if (spins <= 0) { setMessage('No spins left'); return; }
    setLoading(true);
    try {
      const page = Math.floor(Math.random() * 20) + 1;
      const list = await fetchAnimeList('', page, 20);
      if (!list || list.length === 0) throw new Error('No results');
      const pick = list[Math.floor(Math.random() * list.length)];
      let image = pick.coverImage?.large || pick.coverImage?.medium || pick.coverImage?.extraLarge || '';
      if (image && image.startsWith('http')) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const reader = new FileReader();
          image = await new Promise((res2, rej) => {
            reader.onload = () => res2(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn('image convert failed', e);
        }
      }
      const title = pick.title?.english || pick.title?.romaji || pick.title?.native || 'Unknown';
      const invRaw = localStorage.getItem('inventory');
      const inv = invRaw ? JSON.parse(invRaw) : [];
      const entry = { id: String(pick.id), title, image };
      inv.unshift(entry);
      localStorage.setItem('inventory', JSON.stringify(inv));
      setRecent(inv.slice(0,6));
      updateSpins(spins - 1);
      setMessage(`Unlocked ${title}`);
    } catch (e) {
      console.error(e);
      setMessage('Spin failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Shop</h1>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <div className="text-sm text-gray-400">Chuts</div>
              <div className="font-bold">{chuts} Chuts</div>
              <button onClick={addInfiniteChuts} className="mt-2 px-2 py-1 bg-emerald-600 rounded hover:scale-105 transition">Add Infinite Chuts</button>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 glass mb-6">
            <h2 className="text-lg font-semibold mb-3">Spins: {spins}</h2>
            <div className="flex gap-3 flex-wrap">
              <button onClick={doSpin} disabled={loading || spins<=0} className="px-4 py-2 bg-white text-black rounded-xl">Use Spin</button>
              <button onClick={buySpin} className="px-4 py-2 bg-purple-600 rounded-xl hover:scale-105 transition">Buy 1 Spin (50 Chuts)</button>
            </div>
            {message && <div className="mt-3 text-sm text-gray-300">{message}</div>}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Buy from Catalog (5000 Chuts each)</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {catalog.map((c) => (
                <div key={c.id} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <img src={c.coverImage?.large || c.coverImage?.medium || '/next.svg'} alt={c.title?.romaji} className="w-full rounded-lg mb-2 object-cover h-48" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm truncate">{c.title?.romaji || c.title?.english}</div>
                    <button onClick={() => buyCatalogItem(c)} className="ml-2 px-3 py-1 bg-rose-600 rounded hover:scale-105 transition">Buy 5k</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Unlocks</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((item) => (
                <div key={item.id} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <img src={item.image || '/next.svg'} alt={item.title} className="w-full rounded-lg mb-2 object-cover h-40" />
                  <div className="text-sm truncate">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
