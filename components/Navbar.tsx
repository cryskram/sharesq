"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 
      backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl px-6 py-3 shadow-md flex justify-between items-center"
    >
      <Link href="/" className="text-2xl font-bold text-white/90">
        Share²
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link href="/profile">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-white/20"
                />
              ) : (
                <FaUserCircle size={28} className="text-white/80" />
              )}
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-1.5 text-sm text-white bg-white/10 hover:bg-white/20 rounded-xl transition"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="px-4 py-1.5 text-sm text-white bg-white/10 hover:bg-white/20 rounded-xl transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
