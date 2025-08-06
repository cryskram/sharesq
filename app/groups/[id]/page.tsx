"use client";

import AddExpenseModal from "@/components/AddExpenseModal";
import { EXPENSE_QUERY } from "@/lib/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";

const GroupDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const { data, loading } = useQuery(EXPENSE_QUERY, {
    variables: {
      groupId: id,
    },
  });
  return (
    <main className="relative min-h-screen px-4 pt-28 pb-20 text-white">
      <h1 className="text-3xl font-semibold mb-6">Group Details</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="space-y-4">
            {data.expenses.map((exp: any) => (
              <div
                key={exp.id}
                className="glass-card p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-sm text-neutral-400">
                    {exp.paidBy.name} paid ₹{exp.amount}
                  </p>
                </div>
                <p className="text-lg font-bold">₹{exp.amount}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-2xl flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <FaPlus />
      </button>

      {showModal && (
        <AddExpenseModal
          groupId={id as string}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
};

export default GroupDetails;
