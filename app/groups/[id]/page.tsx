"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import {
  ACTIVITY_LOGS,
  DELETE_EXPENSE,
  EXPENSE_QUERY,
  GET_BALANCES,
  ME_QUERY,
} from "@/lib/queries";
import { useState } from "react";
import SettleUpModal from "@/components/SettleUpModal";
import { FaArrowRightLong } from "react-icons/fa6";

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

  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    refetchQueries: [
      {
        query: EXPENSE_QUERY,
        variables: { groupId },
      },
      {
        query: GET_BALANCES,
        variables: { groupId },
      },
      {
        query: ACTIVITY_LOGS,
        variables: { groupId },
      },
    ],
  });

  const group = meData?.me?.groups.find((g: any) => g.id === groupId);
  const expenses = expenseData?.expenses || [];
  const balances = balanceData?.balances || [];
  const currentUserId = meData?.me?.id;

  const { data: logData } = useQuery(ACTIVITY_LOGS, {
    variables: { groupId },
  });

  if (meLoading || !meData?.me?.id) {
    return <div className="p-10 text-white">Loading group...</div>;
  }

  return (
    <div className="min-h-screen px-6 pt-28 pb-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="glass-card">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">
            Group
          </p>

          <h1 className="mt-2 text-4xl font-bold">{group?.name}</h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
            <span>{group?.members?.length || 0} members</span>

            {group?.inviteCode && <span>Invite: {group.inviteCode}</span>}
          </div>
        </div>

        <div className="glass-card">
          <h2 className="mb-2 text-xl font-semibold">Simplified Balances</h2>
          {balances.length === 0 ? (
            <p className="text-sm text-neutral-400">No balances yet.</p>
          ) : (
            <ul className="space-y-2">
              {balances.map((b: any, idx: number) => (
                <li
                  key={idx}
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">
                        {b.from.id === currentUserId ? "You" : b.from.name}
                      </span>

                      <span className="text-zinc-500">
                        <FaArrowRightLong />
                      </span>

                      <span className="font-medium text-violet-300">
                        {b.to.id === currentUserId ? "You" : b.to.name}
                      </span>
                    </div>

                    <span className="font-bold text-green-400">
                      ₹{b.amount.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => setShowSettleModal(true)}
          className="w-full rounded-2xl border border-violet-500/20 bg-violet-500/15 py-3 font-medium text-violet-300 transition-all hover:bg-violet-500/25"
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
          <h2 className="mb-2 text-xl font-semibold">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-sm text-neutral-400">No expenses yet.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((e: any) => (
                <li
                  key={e.id}
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-sm text-white/70">
                        Paid by {e.paidBy.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold text-green-400">₹{e.amount}</p>
                      {e.paidBy.id === currentUserId && (
                        <button
                          onClick={async () => {
                            if (confirm(`Delete "${e.title}"?`)) {
                              await deleteExpense({
                                variables: {
                                  expenseId: e.id,
                                },
                              });
                            }
                          }}
                          className="danger-button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card">
          <h2 className="mb-2 text-xl font-semibold">Group Members</h2>
          <ul className="flex flex-wrap gap-3 text-sm text-white/80">
            {group?.members?.map((member: any) => (
              <li className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 font-semibold">
                  {member.name?.[0]}
                </div>
                <span>{member.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card">
          <h2 className="mb-2 text-xl font-semibold">Group Activity</h2>
          {logData?.activityLogs?.length === 0 ? (
            <p className="text-sm text-neutral-400">No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {logData?.activityLogs?.map((log: any) => (
                <li
                  key={log.id}
                  className="border-l border-violet-500/20 py-2 pl-4"
                >
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
