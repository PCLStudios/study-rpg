"use client";
import { useEffect, useState, useRef } from "react";
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
  const [shopResetAt, setShopResetAt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [purchaseAnim, setPurchaseAnim] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    mountedRef.current = true;
    setChutsLocal(getChuts());
    setSpinsLocal(getSpins());
    setRecent(JSON.parse(localStorage.getItem("inventory") || "[]").slice(0, 6));

    const stored = localStorage.getItem('shop_reset');
    let resetAt = stored ? parseInt(stored, 10) : 0;
    if (!resetAt || resetAt <= Date.now()) {
      resetAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('shop_reset', String(resetAt));
    }
    setShopResetAt(resetAt);
    setTimeLeft(Math.max(0, resetAt - Date.now()));

    fetchNewCatalog();

    const t = setInterval(() => {
      const left = Math.max(0, (resetAt - Date.now()));
      setTimeLeft(left);
      if (left <= 0) {
        // reset shop
        resetShop();
      }
    }, 1000);

    return () => { mountedRef.current = false; clearInterval(t); };
  }, []);

  async function fetchNewCatalog() {
    try {
      const list = await fetchAnimeList('', 1, 8);
      // normalize items
      const items = (list || []).map(i => ({ id: String(i.id), title: i.title?.english || i.title?.romaji || i.title?.native || 'Unknown', image: i.coverImage?.large || i.coverImage?.medium || '', averageScore: i.averageScore || null }));
      setCatalog(items);
    } catch (e) {
      console.warn('catalog fetch failed', e);
      setCatalog([]);
    }
  }

  function updateChuts(n) {
    setChutsLocal(n);
    setChuts(n);
  }
  function updateSpins(n) {
    setSpinsLocal(n);
    setSpins(n);
  }

  const addInfiniteChuts = () => updateChuts(999999);

  const buySpin = () => {
    const cost = 50;
    if (chuts < cost) { setMessage('Not enough Chuts'); return; }
    updateChuts(chuts - cost);
    updateSpins(spins + 1);
    setMessage('Bought 1 spin');
  };

  function starsFromScore(score) {
    if (!score) return null;
    const stars = Math.round(score / 20);
    return stars;
  }

  const resetShop = async () => {
    const next = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('shop_reset', String(next));
    setShopResetAt(next);
    await fetchNewCatalog();
  };

  const replaceSlot = async (idx) => {
    try {
      // try a random page and pick one not currently in catalog
      for (let attempts = 0; attempts < 6; attempts++) {
        const page = Math.floor(Math.random() * 40) + 1;
        const list = await fetchAnimeList('', page, 6);
        if (!list || list.length === 0) continue;
        const pick = list[Math.floor(Math.random() * list.length)];
        const candidate = { id: String(pick.id), title: pick.title?.english || pick.title?.romaji || pick.title?.native || 'Unknown', image: pick.coverImage?.large || pick.coverImage?.medium || '', averageScore: pick.averageScore || null };
        if (!catalog.find(c => c.id === candidate.id)) {
          const next = [...catalog];
          next[idx] = candidate;
          setCatalog(next);
          return;
        }
      }
    } catch (e) { console.warn('replace failed', e); }
  };

  const buyCatalogItem = async (item, idx) => {
    const price = 5000;
    if (loading) return;
    if (chuts < price) { setMessage('Not enough Chuts for purchase'); return; }
    setLoading(true);
    try {
      // convert image to data URL if remote
      let image = item.image || '';
      if (image && image.startsWith('http')) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const reader = new FileReader();
          image = await new Promise((res2, rej) => { reader.onload = () => res2(reader.result); reader.onerror = rej; reader.readAsDataURL(blob); });
        } catch (e) { console.warn('image convert failed', e); }
      }

      const title = item.title || 'Unknown';
      const invRaw = localStorage.getItem('inventory');
      const inv = invRaw ? JSON.parse(invRaw) : [];
      const entry = { id: String(item.id), title, image };
      inv.unshift(entry);
      localStorage.setItem('inventory', JSON.stringify(inv));
      updateChuts(chuts - price);
      setRecent(inv.slice(0,6));

      // trigger purchase animation
      setPurchaseAnim({ title, image });
      setTimeout(() => setPurchaseAnim(null), 1800);

      // remove and replace the bought item in catalog
      const copy = [...catalog];
      copy.splice(idx, 1);
      setCatalog(copy);
      replaceSlot(idx);
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
      let image = pick.coverImage?.large || pick.coverImage?.medium || '';
      if (image && image.startsWith('http')) {
        try {
          const res = await fetch(image);
          const blob = await res.blob();
          const reader = new FileReader();
          image = await new Promise((res2, rej) => { reader.onload = () => res2(reader.result); reader.onerror = rej; reader.readAsDataURL(blob); });
        } catch (e) { console.warn('image convert failed', e); }
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

  function formatTime(ms) {
    const s = Math.floor(ms/1000);
    const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); const sec = s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

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
            <div className="mt-2 text-sm text-gray-300">Shop resets in: {formatTime(timeLeft)}</div>
            {message && <div className="mt-3 text-sm text-gray-300">{message}</div>}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Buy from Catalog (5000 Chuts each)</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {catalog.map((c, idx) => (
                <div key={c.id + String(idx)} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <div className="w-full rounded-lg mb-2 bg-black/10 overflow-hidden" style={{paddingBottom: '75%', position: 'relative'}}>
                    <img src={c.image || '/next.svg'} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm truncate max-w-[70%]">{c.title}</div>
                    <div className="flex items-center gap-2">
                      {c.averageScore ? (
                        <div className="text-yellow-300 text-sm">{c.averageScore}% rating</div>
                      ) : null}
                      <button disabled={loading || chuts < 5000} onClick={() => buyCatalogItem(c, idx)} className="ml-2 px-3 py-1 rounded text-white bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-400 shadow-lg hover:scale-105 transition">
                        Buy 5k
                      </button>
                    </div>
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
                  <div className="w-full rounded-lg mb-2 bg-black/10 overflow-hidden" style={{paddingBottom: '75%', position: 'relative'}}>
                    <img src={item.image || '/next.svg'} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="text-sm truncate">{item.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* purchase animation */}
          {purchaseAnim && (
            <div className="fixed right-6 bottom-6 z-50 pointer-events-none">
              <div className="w-64 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl animate-pulse">
                <div className="flex gap-3 items-center">
                  <img src={purchaseAnim.image || '/next.svg'} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <div className="font-semibold">{purchaseAnim.title}</div>
                    <div className="text-sm text-gray-300">Added to inventory</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
