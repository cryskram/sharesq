"use client";

import AddExpenseModal from "@/components/AddExpenseModal";
import CreateGroupModal from "@/components/CreateGroupModal";
import { ME_QUERY } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaUsers,
  FaClock,
} from "react-icons/fa";

export default function HomePage() {
  const { data, loading } = useQuery(ME_QUERY);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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
            {data?.me?.groups.map((group: any) => (
              <li
                key={group.id}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md transition-all flex justify-between items-center"
              >
                <Link href={`/groups/${group.id}`}>{group.name}</Link>
                <button
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setShowExpenseModal(true);
                  }}
                  className="text-sm text-white px-2 py-2 rounded-md bg-white/20 hover:bg-white/30 transition-all duration-150"
                >
                  + Expense
                </button>
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

      <CreateGroupModal />

      {showExpenseModal && selectedGroupId && (
        <AddExpenseModal
          groupId={selectedGroupId}
          onClose={() => {
            setSelectedGroupId(null);
            setShowExpenseModal(false);
          }}
        />
      )}
    </main>
  );
}
