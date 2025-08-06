import { SETTLE_UP, GET_BALANCES } from "@/lib/queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

export default function SettleUpModal({
  groupId,
  balances,
  currentUserId,
  onClose,
}: {
  groupId: string;
  balances: any[];
  currentUserId: string;
  onClose: () => void;
}) {
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const [settleUp] = useMutation(SETTLE_UP);

  const filteredBalances = balances.filter((b) => b.from.id === currentUserId);

  const handleSettle = async () => {
    if (!toUserId || !amount) return;

    await settleUp({
      variables: {
        groupId,
        toUserId,
        amount: parseFloat(amount.toString()),
        note,
      },
      refetchQueries: [{ query: GET_BALANCES, variables: { groupId } }],
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
        <h1 className="text-xl font-semibold text-white mb-2">Settle Up</h1>

        <select
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 text-white rounded-lg"
        >
          <option className="bg-black" value="">
            Select user
          </option>
          {filteredBalances.map((b: any, i) => (
            <option className="bg-black" key={i} value={b.to.id}>
              {b.to.name} (you owe ₹{b.amount.toFixed(2)})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none"
        />

        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none resize-none"
        />

        <button
          onClick={handleSettle}
          className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition duration-150"
        >
          Settle
        </button>
      </div>
    </div>
  );
}
