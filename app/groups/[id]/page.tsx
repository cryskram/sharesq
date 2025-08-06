"use client";

import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import {
  ACTIVITY_LOGS,
  EXPENSE_QUERY,
  GET_BALANCES,
  ME_QUERY,
} from "@/lib/queries";
import { useState } from "react";
import SettleUpModal from "@/components/SettleUpModal";

export default function GroupDetailsPage() {
  const { id: groupId } = useParams();

  const [showSettleModal, setShowSettleModal] = useState(false);

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: expenseData } = useQuery(EXPENSE_QUERY, {
    variables: { groupId },
  });
  const { data: balanceData } = useQuery(GET_BALANCES, {
    variables: { groupId },
  });

  const group = meData?.me?.groups.find((g: any) => g.id === groupId);
  const expenses = expenseData?.expenses || [];
  const balances = balanceData?.balances || [];
  const currentUserId = meData?.me?.id;

  const { data: logData } = useQuery(ACTIVITY_LOGS, {
    variables: { groupId },
  });

  if (meLoading || !meData?.me?.id) {
    return <div className="text-white p-10">Loading group...</div>;
  }

  return (
    <div className="bg-black">
      <div className="min-h-screen px-4 pt-28 pb-20 text-white max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold">{group?.name}</h1>

        <div className="glass-card space-y-2">
          <h2 className="text-xl font-semibold mb-2">Simplified Balances</h2>
          {balances.length === 0 ? (
            <p className="text-neutral-400 text-sm">No balances yet.</p>
          ) : (
            <ul className="space-y-2">
              {balances.map((b: any, idx: number) => (
                <li key={idx} className="text-sm text-white/90">
                  <span className="font-medium">{b.from.name}</span> owes{" "}
                  <span className="font-medium">{b.to.name}</span> ₹
                  {b.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setShowSettleModal(true)}
          className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 text-green-300 font-medium px-4 py-2 rounded-lg backdrop-blur transition-all duration-200"
        >
          💸 Settle Up
        </button>

        {showSettleModal && (
          <SettleUpModal
            groupId={groupId as string}
            balances={balances}
            currentUserId={currentUserId}
            onClose={() => setShowSettleModal(false)}
          />
        )}

        <div className="glass-card space-y-2">
          <h2 className="text-xl font-semibold mb-2">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-neutral-400 text-sm">No expenses yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((e: any) => (
                <li
                  key={e.id}
                  className="bg-white/5 px-3 py-2 rounded-md text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-sm text-white/70">
                        Paid by {e.paidBy.name}
                      </p>
                    </div>
                    <p className="font-bold text-green-400">₹{e.amount}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-2">Group Members</h2>
          <ul className="flex flex-wrap gap-3 text-white/80 text-sm">
            {group?.members?.map((member: any) => (
              <li
                key={member.id}
                className="bg-white/10 px-3 py-1 rounded-full"
              >
                {member.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-2">Group Activity</h2>
          {logData?.activityLogs?.length === 0 ? (
            <p className="text-neutral-400 text-sm">No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {logData?.activityLogs?.map((log: any) => (
                <li key={log.id} className="text-sm text-white/80">
                  <span className="font-medium text-white">
                    {log.user.name}
                  </span>
                  : {log.message}
                  <span className="block text-xs text-white/40">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
