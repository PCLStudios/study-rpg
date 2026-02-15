"use client";
import Navbar from "../components/Navbar";

export default function Quiz() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f14] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Quiz (Placeholder)</h1>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 glass">
            <div className="flex gap-3 mb-4">
              <button className="px-4 py-2 rounded-xl bg-white text-black">Upload Notes</button>
              <button className="px-4 py-2 rounded-xl bg-gray-700">Paste Drive Link</button>
              <button className="px-4 py-2 rounded-xl bg-gray-700">Start AI Chat</button>
            </div>

            <div className="mt-6">
              <div className="bg-black/40 p-6 rounded-lg">
                <p className="text-gray-300">Quiz UI will appear here. For now there's a chat-like area to interact with the AI to generate questions.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
