"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchAnimeList } from "../../lib/api";
import { getChuts } from "../../lib/sp";

export default function Collection() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [chuts, setChuts] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchAnimeList(query).then((res) => {
      if (mounted) setResults(res);
    }).catch(()=>{});
    if (typeof window !== 'undefined') setChuts(getChuts());
    return () => { mounted = false };
  }, [query]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Collection</h1>
            <div className="flex items-center gap-4">
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search anime" className="bg-white/5 px-4 py-2 rounded-xl text-black" />
              <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                <div className="text-xs text-gray-300">Chuts</div>
                <div className="font-bold">{chuts}</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.length === 0 && (
              <div className="text-gray-400">No results. Try searching.</div>
            )}
            {results.map((r) => (
              <div key={r.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 glass hover:scale-105 hover:-translate-y-1 transform transition-all duration-200">
                <div className="w-full rounded-lg mb-3 bg-black/10 overflow-hidden" style={{paddingBottom: '75%', position: 'relative'}}>
                  <img src={r.coverImage?.large || r.coverImage?.medium} alt={r.title?.romaji} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="font-semibold">{r.title?.english || r.title?.romaji || r.title?.native}</div>
                <div className="text-sm text-gray-400">{r.genres?.slice(0,3).join(', ')}</div>
                {r.averageScore ? <div className="text-sm text-yellow-300 mt-1">{r.averageScore}%</div> : null}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
