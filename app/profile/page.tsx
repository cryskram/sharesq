"use client";

import { useQuery } from "@apollo/client";
import { signOut, useSession } from "next-auth/react";
import { ME_QUERY } from "@/lib/queries";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { data, loading } = useQuery(ME_QUERY);

  const user = session?.user;
  const me = data?.me;

  if (status === "loading" || loading) {
    return <div className="text-white p-10">Loading your profile...</div>;
  }

  return (
    <div className="bg-black">
      <main className="min-h-screen px-4 pt-28 pb-20 text-white max-w-3xl mx-auto space-y-10">
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-2xl font-semibold">
                {user?.name?.[0] || "?"}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              {me?.username && (
                <p className="text-sm text-white/60">@{me.username}</p>
              )}
              <p className="text-sm text-white/70">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <h2 className="text-lg font-semibold text-white/80">Group Info</h2>
            <p className="text-white/80 text-sm">
              You’re part of{" "}
              <span className="text-white font-semibold">
                {me?.groups?.length || 0}
              </span>{" "}
              group{me?.groups?.length !== 1 && "s"}.
            </p>

            {me?.groups?.length > 0 && (
              <ul className="mt-2 space-y-2">
                {me.groups.map((group: any) => (
                  <li
                    key={group.id}
                    className="bg-white/5 px-3 py-2 rounded-md text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">{group.name}</span>
                      <span className="text-xs text-white/50">
                        Code: {group.inviteCode}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="text-sm text-red-400 px-4 py-2 rounded-md border border-red-500/20 hover:bg-red-500/10 transition-all"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
