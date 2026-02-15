"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { getSP, setSP } from "../lib/sp";
import { fetchAnimeList } from "../lib/api";
import Roulette from "../components/Roulette";

function rarityForRandom() {
  const r = Math.random() * 100;
  if (r <= 5) return 'legendary';
  if (r <= 20) return 'epic';
  if (r <= 50) return 'rare';
  return 'common';
}

function rarityColor(r) {
  if (r === 'legendary') return 'bg-yellow-400';
  if (r === 'epic') return 'bg-purple-500';
  if (r === 'rare') return 'bg-blue-400';
  return 'bg-gray-400';
}

export default function Shop() {
  const [sp, setSpState] = useState(1250);
  const [spins, setSpins] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setSpState(getSP());
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('spins');
      setSpins(s ? parseInt(s, 10) : 0);
      setRecent(JSON.parse(localStorage.getItem('inventory') || '[]').slice(0,6));
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

  const rouletteRef = useRef();

  async function handleResultFromWheel({ index, sector }) {
    try {
      // fetch a page and pick an anime
      const page = Math.floor(Math.random() * 40) + 1;
      const list = await fetchAnimeList('', page, 20);
      if (!list || list.length === 0) throw new Error('No results');
      // bias selection slightly by popularity
      list.sort((a,b)=> (b.popularity||0) - (a.popularity||0));
      const pick = list[Math.floor(Math.random() * list.length)];
      const anime = {
        id: String(pick.id),
        title: (pick.title?.english || pick.title?.romaji || pick.title?.native || 'Unknown'),
        image: pick.coverImage?.large || pick.coverImage?.medium || '/next.svg',
        rarity: sector.toLowerCase(),
      };

      // attempt to fetch image and convert to data URL for reliable persistence
      try {
        if (anime.image && anime.image.startsWith('http')) {
          const resp = await fetch(anime.image);
          const blob = await resp.blob();
          const reader = new FileReader();
          const dataUrl = await new Promise((res, rej) => {
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(blob);
          });
          anime.image = dataUrl;
        }
      } catch (err) {
        console.warn('image fetch failed', err);
      }

      const invRaw = localStorage.getItem('inventory');
      const inv = invRaw ? JSON.parse(invRaw) : [];
      if (!inv.find((i) => i.id === anime.id)) inv.unshift(anime);
      localStorage.setItem('inventory', JSON.stringify(inv));
      setRecent(inv.slice(0,6));

      const next = spins - 1;
      setSpins(next);
      localStorage.setItem('spins', String(next));
      // confetti
      runConfetti();
      alert(`Unlocked: ${anime.title} (${anime.rarity})`);
    } catch (err) {
      console.error(err);
      alert('Spin failed. Try again.');
    } finally {
      setRolling(false);
    }
  }

  function spinOnce() {
    if (spins <= 0) return alert('No spins available');
    setRolling(true);
    // start roulette animation then handle result
    rouletteRef.current?.spin(handleResultFromWheel);
  }

  function spendForSpin() {
    const cost = 200;
    if (sp < cost) return alert('Not enough SP');
    updateSP(sp - cost);
    const next = spins + 1;
    setSpins(next);
    localStorage.setItem('spins', String(next));
  }

  // Small confetti effect
  function runConfetti() {
    if (typeof document === 'undefined') return;
    const root = document.createElement('div');
    root.className = 'fixed inset-0 pointer-events-none z-50';
    for (let i=0;i<40;i++){
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = `${Math.random()*100}%`;
      el.style.top = `${Math.random()*20}%`;
      el.style.width = '8px'; el.style.height = '14px';
      el.style.background = ['#f59e0b','#8b5cf6','#06b6d4','#ec4899'][Math.floor(Math.random()*4)];
      el.style.opacity = '0.95';
      el.style.transform = `rotate(${Math.random()*360}deg)`;
      el.style.borderRadius = '2px';
      el.style.transition = 'transform 1.6s linear, top 1.6s linear, opacity 1.6s linear';
      root.appendChild(el);
      requestAnimationFrame(()=>{
        el.style.top = `${80 + Math.random()*20}%`;
        el.style.transform = `translateY(200px) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
    }
    document.body.appendChild(root);
    setTimeout(()=>root.remove(),1800);
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
              <button onClick={spendForSpin} className="px-4 py-2 bg-blue-600 rounded-xl">Spend 200 SP for 1 Spin</button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Roulette ref={rouletteRef} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Recent Unlocks</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((item) => (
                <div key={item.id} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <img src={item.image} alt="art" className="w-full rounded-lg mb-2" />
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{item.title}</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${rarityColor(item.rarity)}`}>{item.rarity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
