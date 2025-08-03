"use client";

import { ME_QUERY } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaUsers,
  FaClock,
  FaPlusCircle,
} from "react-icons/fa";

export default function HomePage() {
  const { data, loading } = useQuery(ME_QUERY);
  const [showModal, setShowModal] = useState(false);

  const totalOwed = 420;
  const totalLent = 820;

  return (
    <main className="relative min-h-screen px-4 pt-28 pb-20 overflow-hidden text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2a0845] via-[#6441a5] to-[#ff6f61]" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-orange-400/20 blur-2xl rounded-full" />

      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-semibold text-white/90">
          {loading
            ? "Loading..."
            : `Welcome, ${data?.me?.name?.split(" ")[0] || "there"} 👋`}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card border-l-4 border-red-500 hover:shadow-red-400/30 hover:scale-[1.015] transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaArrowCircleUp className="text-red-400" size={32} />
              <div>
                <p className="text-sm text-neutral-300">You Owe</p>
                <p className="text-xl font-bold text-red-400">₹{totalOwed}</p>
              </div>
            </div>
          </div>

          <div className="glass-card border-l-4 border-green-500 hover:shadow-green-400/30 hover:scale-[1.015] transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaArrowCircleDown className="text-green-400" size={32} />
              <div>
                <p className="text-sm text-neutral-300">You Lent</p>
                <p className="text-xl font-bold text-green-400">₹{totalLent}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card hover:shadow-white/20 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers size={20} />
            <h2 className="text-lg font-medium">Your Groups</h2>
          </div>
          <ul className="space-y-2">
            {data?.me?.groups?.map((group: any) => (
              <li
                key={group.id}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card hover:shadow-white/20 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <FaClock size={20} />
            <h2 className="text-lg font-medium">Recent Activity</h2>
          </div>
          <ul className="space-y-2 text-neutral-300">
            <li className="bg-white/5 px-3 py-2 rounded-md">You paid ₹300</li>
            <li className="bg-white/5 px-3 py-2 rounded-md">
              Ashwin settled ₹150
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-full p-4 shadow-xl transition-all"
      >
        <span className="text-2xl font-bold">
          <FaPlusCircle />
        </span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 p-6 rounded-2xl max-w-sm w-full text-white border border-white/20 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
