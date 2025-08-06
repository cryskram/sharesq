"use client";

import { ADD_EXPENSE, EXPENSE_QUERY } from "@/lib/queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

const AddExpenseModal = ({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const [addExpense] = useMutation(ADD_EXPENSE);

  const handleAdd = async () => {
    if (!title || !amount) return;
    await addExpense({
      variables: {
        groupId,
        title,
        amount: parseFloat(amount.toString()),
        notes,
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
          className="w-full px-4 py-2 rounded-lg bg-white/10  text-white placeholder:text-white/40 outline-none resize-none"
        />

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
