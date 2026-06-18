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
          amount: Number(amount),
          note,
        },
        refetchQueries: [
          {
            query: GET_BALANCES,
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
            Payments
          </p>

          <h1 className="mt-2 text-3xl font-bold">Settle Up</h1>

          <p className="mt-2 text-zinc-500">
            Record a payment and update balances.
          </p>
        </div>

        <div className="space-y-4">
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
            className="input-dark appearance-none"
          >
            <option value="" className="bg-[#111113]">
              Select a user
            </option>

            {filteredBalances.map((b: any, i) => (
              <option key={i} value={b.to.id} className="bg-[#111113]">
                {b.to.name} (₹
                {b.amount.toFixed(2)})
              </option>
            ))}
          </select>

          {toUserId && (
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="text-sm text-zinc-400">Outstanding Balance</p>

              <p className="mt-1 text-2xl font-bold text-violet-300">
                ₹{amount.toFixed(2)}
              </p>
            </div>
          )}

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
            placeholder="Optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="input-dark resize-none"
          />

          <button
            onClick={handleSettle}
            disabled={settling || !toUserId || amount <= 0}
            className="w-full rounded-2xl border border-green-500/20 bg-green-500/15 py-3 font-medium text-green-300 transition-all hover:bg-green-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {settling ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Settling...
              </span>
            ) : (
              "💸 Settle Up"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
