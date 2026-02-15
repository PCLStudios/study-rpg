"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchAnimeList } from "../lib/api";

export default function Collection() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchAnimeList('').then((res) => {
      if (mounted) setResults(res);
    });
    return () => { mounted = false };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Collection</h1>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.length === 0 && (
              <div className="text-gray-400">No API results (placeholder). Add an API key in lib/api.js later.</div>
            )}
            {results.map((r) => (
              <div key={r.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 glass">
                <div className="font-semibold">{r.title || r.name || 'Untitled'}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
