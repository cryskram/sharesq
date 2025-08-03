"use client";

import client from "@/lib/client";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </SessionProvider>
  );
}
