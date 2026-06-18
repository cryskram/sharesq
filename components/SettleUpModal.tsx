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

  const [settleUp, { loading: settling }] = useMutation(SETTLE_UP);
  const filteredBalances = balances.filter((b) => b.from.id === currentUserId);

  const handleSettle = async () => {
    if (!toUserId || !amount || settling) return;

    try {
      await settleUp({
        variables: {
          groupId,
          toUserId,
          amount: parseFloat(amount.toString()),
          note,
        },
        refetchQueries: [
          {
            query: GET_BALANCES,
            variables: { groupId },
          },
        ],
      });

      onClose();
    } catch (error) {
      console.error(error);
    }
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
          onChange={(e) => {
            const selectedId = e.target.value;
            setToUserId(selectedId);

            const balance = filteredBalances.find(
              (b) => b.to.id === selectedId,
            );

            if (balance) {
              setAmount(balance.amount);
            }
          }}
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
          disabled={settling || !toUserId || amount <= 0}
          className="w-full py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/25 transition-all duration-200 disabled:bg-white/5 disabled:border-white/10 disabled:text-white/40 disabled:cursor-not-allowed disabled:hover:bg-white/5"
        >
          {settling ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Settling...
            </span>
          ) : (
            "Settle Up"
          )}
        </button>
      </div>
    </div>
  );
}
