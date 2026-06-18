"use client";

import { ADD_EXPENSE, EXPENSE_QUERY, ME_QUERY } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

interface AddExpenseModalProps {
  groupId: string;
  onClose: () => void;
}

const AddExpenseModal = ({ groupId, onClose }: AddExpenseModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [splitWith, setSplitWith] = useState<string[]>([]);

  const [addExpense, { loading }] = useMutation(ADD_EXPENSE);

  const { data: meData } = useQuery(ME_QUERY);

  const group = meData?.me?.groups.find((g: any) => g.id === groupId);

  const currentUserId = meData?.me?.id;

  useEffect(() => {
    if (currentUserId) {
      setSplitWith([currentUserId]);
    }
  }, [currentUserId]);

  const toggleSplitUser = (userId: string) => {
    setSplitWith((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAdd = async () => {
    if (!title.trim() || !amount || splitWith.length === 0 || loading) return;

    try {
      await addExpense({
        variables: {
          groupId,
          title,
          amount: Number(amount),
          notes,
          splitWith,
        },
        refetchQueries: [
          {
            query: EXPENSE_QUERY,
            variables: {
              groupId,
            },
          },
        ],
      });

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      {" "}
      <div className="glass-card relative w-full max-w-xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03] transition-all hover:border-white/[0.12]"
        >
          <CgClose />
        </button>
        <div className="mb-6">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">
            Expenses
          </p>

          <h1 className="mt-2 text-3xl font-bold">Add Expense</h1>

          <p className="mt-2 text-zinc-500">
            Record a shared expense and split it with your group.
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Dinner, Munnar Trip, Rental..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-dark"
          />

          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
              ₹
            </span>

            <input
              type="number"
              placeholder="Amount"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="input-dark pl-8"
            />
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input-dark resize-none"
          />

          <div>
            <p className="mb-3 text-sm text-zinc-400">Split With</p>

            <div className="flex flex-wrap gap-2">
              {group?.members?.map((member: any) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleSplitUser(member.id)}
                  className={`rounded-xl border px-4 py-2 transition-all duration-200 ${
                    splitWith.includes(member.id)
                      ? "border-violet-500/30 bg-violet-500/15 text-violet-300"
                      : "border-white/[0.05] bg-white/[0.02] text-white"
                  } `}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={
              loading || !title.trim() || amount <= 0 || splitWith.length === 0
            }
            className="w-full rounded-2xl bg-violet-500 py-3 font-medium text-white transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-500"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding Expense...
              </span>
            ) : (
              "Add Expense"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
