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

  const [addExpense] = useMutation(ADD_EXPENSE);
  const { data: meData } = useQuery(ME_QUERY);

  const group = meData?.me?.groups.find((g: any) => g.id === groupId);
  const members = group?.members || [];
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
        : [...prev, userId]
    );
  };

  const handleAdd = async () => {
    if (!title || !amount || splitWith.length === 0) return;

    await addExpense({
      variables: {
        groupId,
        title,
        amount: parseFloat(amount.toString()),
        notes,
        splitWith,
      },
      refetchQueries: [{ query: EXPENSE_QUERY, variables: { groupId } }],
    });

    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-6 space-y-4 relative">
        <button
          className="absolute top-3 right-3 text-white/60 hover:text-white"
          onClick={onClose}
        >
          <CgClose />
        </button>
        <h1 className="text-xl font-semibold text-white">Add Expense</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none resize-none"
        />

        <div>
          <p className="text-white/80 text-sm mb-2">Split With:</p>
          <ul className="max-h-32 overflow-y-auto space-y-2">
            {group?.members?.map((member: any) => (
              <li
                key={member.id}
                className="flex items-center gap-2 text-white"
              >
                <input
                  type="checkbox"
                  checked={splitWith.includes(member.id)}
                  onChange={() => toggleSplitUser(member.id)}
                />
                <label>{member.name}</label>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseModal;
