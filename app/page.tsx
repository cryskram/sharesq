"use client";

import AddExpenseModal from "@/components/AddExpenseModal";
import CreateGroupModal from "@/components/CreateGroupModal";

import { ACTIVITY_LOGS, GET_MY_BALANCES, ME_QUERY } from "@/lib/queries";

import { useQuery } from "@apollo/client";

import Link from "next/link";

import { useMemo, useState } from "react";

import {
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaClock,
  FaUsers,
} from "react-icons/fa";

export default function HomePage() {
  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);

  const { data: balanceData } = useQuery(GET_MY_BALANCES);

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
      .filter(
        (b: any) => b.from.id === currentUserId && b.to.id !== currentUserId,
      )
      .reduce((sum: number, b: any) => sum + b.amount, 0);
  }, [balances, currentUserId]);

  const totalLent = useMemo(() => {
    return balances
      .filter(
        (b: any) => b.to.id === currentUserId && b.from.id !== currentUserId,
      )
      .reduce((sum: number, b: any) => sum + b.amount, 0);
  }, [balances, currentUserId]);

  const netBalance = totalLent - totalOwed;

  const firstName = meData?.me?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">
              {meLoading ? "..." : firstName}
            </span>
          </h1>
          <p className="mt-3 text-zinc-500">
            Keep track of every expense, balance and settlement.
          </p>
        </div>
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="glass-card border border-red-500/10">
            <div className="flex items-center gap-4">
              <FaArrowCircleUp className="text-red-400" size={32} />
              <div>
                <p className="text-xs tracking-widest text-zinc-500 uppercase">
                  You Owe
                </p>
                <p className="mt-1 text-3xl font-bold text-red-400">
                  ₹{totalOwed.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card border border-green-500/10">
            <div className="flex items-center gap-4">
              <FaArrowCircleDown className="text-green-400" size={32} />
              <div>
                <p className="text-xs tracking-widest text-zinc-500 uppercase">
                  You Lent
                </p>
                <p className="mt-1 text-3xl font-bold text-green-400">
                  ₹{totalLent.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card border border-violet-500/10">
            <div>
              <p className="text-xs tracking-widest text-zinc-500 uppercase">
                Net Balance
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${
                  netBalance >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹{Math.abs(netBalance).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {netBalance >= 0 ? "You're owed money" : "You owe money"}
              </p>
            </div>
          </div>
        </div>

        {meData?.me?.groups?.length === 0 && (
          <div className="glass-card py-16 text-center">
            <h3 className="text-xl font-semibold">No groups yet</h3>

            <p className="mt-2 text-zinc-500">
              Create your first group to start tracking expenses.
            </p>
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-card">
            <div className="mb-5 flex items-center gap-2">
              <FaUsers />

              <h2 className="text-xl font-semibold">Your Groups</h2>
            </div>

            <div className="space-y-3">
              {meData?.me?.groups?.map((group: any) => (
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      href={`/groups/${group.id}`}
                      className="text-lg font-semibold transition-colors hover:text-violet-300"
                    >
                      {group.name}
                    </Link>

                    <p className="mt-1 text-sm text-zinc-500">
                      {group.members?.length || 0} members
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setShowExpenseModal(true);
                    }}
                    className="rounded-xl border border-violet-500/20 bg-violet-500/15 px-4 py-2 text-violet-300 transition-all hover:bg-violet-500/25"
                  >
                    + Expense
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="mb-5 flex items-center gap-2">
              <FaClock />

              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>

            {logData?.activityLogs?.length ? (
              <div className="space-y-3">
                {logData.activityLogs.slice(0, 5).map((log: any) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4"
                  >
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-violet-300">
                        {log.user.name}
                      </span>{" "}
                      {log.message}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No activity yet.</p>
            )}
          </div>
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
    </div>
  );
}
