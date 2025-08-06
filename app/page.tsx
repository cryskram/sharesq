"use client";

import AddExpenseModal from "@/components/AddExpenseModal";
import CreateGroupModal from "@/components/CreateGroupModal";
import { ME_QUERY, ACTIVITY_LOGS, GET_MY_BALANCES } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaUsers,
  FaClock,
} from "react-icons/fa";

export default function HomePage() {
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: balanceData, loading: balanceLoading } =
    useQuery(GET_MY_BALANCES);
  const { data: logData } = useQuery(ACTIVITY_LOGS, {
    variables: {
      groupId: meData?.me?.groups?.[0]?.id || "",
    },
    skip: !meData?.me?.groups?.length,
  });

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const currentUserId = meData?.me?.id;
  const balances = balanceData?.myBalances || [];

  const totalOwed = useMemo(() => {
    return balances
      .filter((b: any) => b.from.id === currentUserId)
      .reduce((sum: number, b: any) => sum + b.amount, 0);
  }, [balances, currentUserId]);

  const totalLent = useMemo(() => {
    return balances
      .filter((b: any) => b.to.id === currentUserId)
      .reduce((sum: number, b: any) => sum + b.amount, 0);
  }, [balances, currentUserId]);

  return (
    <main className="relative min-h-screen px-4 pt-28 pb-20 overflow-hidden text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-semibold text-white/90">
          {meLoading
            ? "Loading..."
            : `Welcome, ${meData?.me?.name?.split(" ")[0] || "there"} 👋`}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-card border-l-4 border-red-500 hover:shadow-red-400/30 hover:scale-[1.015] transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaArrowCircleUp className="text-red-400" size={32} />
              <div>
                <p className="text-sm text-neutral-300">You Owe</p>
                <p className="text-xl font-bold text-red-400">
                  ₹{totalOwed.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card border-l-4 border-green-500 hover:shadow-green-400/30 hover:scale-[1.015] transition-all duration-300">
            <div className="flex items-center gap-4">
              <FaArrowCircleDown className="text-green-400" size={32} />
              <div>
                <p className="text-sm text-neutral-300">You Lent</p>
                <p className="text-xl font-bold text-green-400">
                  ₹{totalLent.toFixed(2)}
                </p>
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
            {meData?.me?.groups?.map((group: any) => (
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
          {logData?.activityLogs?.length ? (
            <ul className="space-y-2 text-neutral-300">
              {logData.activityLogs.slice(0, 4).map((log: any) => (
                <li
                  key={log.id}
                  className="bg-white/5 px-3 py-2 rounded-md text-sm"
                >
                  <span className="text-white font-medium">
                    {log.user.name}
                  </span>{" "}
                  {log.message}
                  <span className="block text-xs text-white/40">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">No activity yet.</p>
          )}
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
