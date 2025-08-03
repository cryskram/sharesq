import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_ID
          : process.env.AUTH_GITHUB_ID_DEV,
      clientSecret:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_GITHUB_SECRET
          : process.env.AUTH_GITHUB_SECRET_DEV,
    }),
  ],
});
