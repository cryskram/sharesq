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
    return <div className="p-10 text-white">Loading your profile...</div>;
  }

  return (
    <div className="bg-black">
      <main className="mx-auto min-h-screen max-w-3xl space-y-10 px-4 pt-28 pb-20 text-white">
        <div className="glass-card space-y-6 p-6">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold text-white/60">
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

          <div className="space-y-2 border-t border-white/10 pt-4">
            <h2 className="text-lg font-semibold text-white/80">Group Info</h2>
            <p className="text-sm text-white/80">
              You’re part of{" "}
              <span className="font-semibold text-white">
                {me?.groups?.length || 0}
              </span>{" "}
              group{me?.groups?.length !== 1 && "s"}.
            </p>

            {me?.groups?.length > 0 && (
              <ul className="mt-2 space-y-2">
                {me.groups.map((group: any) => (
                  <li
                    key={group.id}
                    className="rounded-md bg-white/5 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
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
            className="rounded-md border border-red-500/20 px-4 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
