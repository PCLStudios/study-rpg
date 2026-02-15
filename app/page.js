"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getSP } from "../lib/sp";

export default function Home() {
  const [sp, setSp] = useState(1250);
  const [displaySp, setDisplaySp] = useState(0);

  useEffect(() => {
    setSp(getSP());
  }, []);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 25;
      if (start >= sp) { start = sp; clearInterval(interval); }
      setDisplaySp(start);
    }, 15);
    return () => clearInterval(interval);
  }, [sp]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight">Study RPG</h1>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
              <span className="text-gray-400 text-sm">Study Points</span>
              <div className="text-xl font-bold">{displaySp} SP</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-blue-500/20 p-10 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-4xl font-semibold mb-4">Ready to Level Up?</h2>
            <p className="text-gray-400 mb-8 max-w-xl">
              Turn your study sessions into rewards. Earn points, spin for anime, and build your collection.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded-2xl font-medium hover:scale-105 transition-transform duration-200">
              Start Quiz
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <GlassCard title="Shop">Spend your SP on spins and boosts.</GlassCard>
            <GlassCard title="Collection">Track all unlocked anime.</GlassCard>
            <GlassCard title="Inventory">Manage boosts and special items.</GlassCard>
          </div>
        </div>
      </main>
    </>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{children}</p>
    </div>
  );
}
