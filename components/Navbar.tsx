"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-5 left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2 rounded-3xl border border-white/[0.06] bg-[#111113]/80 px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/15 font-bold text-violet-300">
            S
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight transition-colors group-hover:text-violet-300">
              Share<sup>2</sup>
            </h1>

            <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              Expense Sharing
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/profile" className="transition-all hover:scale-105">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-white/[0.08] transition-all hover:border-violet-500/40"
                  />
                ) : (
                  <FaUserCircle
                    size={34}
                    className="text-zinc-400 transition-colors hover:text-violet-300"
                  />
                )}
              </Link>

              <button
                onClick={() => signOut()}
                className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-4 py-2 text-zinc-300 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="rounded-xl bg-violet-500 px-5 py-2 font-medium text-white transition-all hover:bg-violet-400"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
