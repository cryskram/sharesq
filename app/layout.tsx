import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Provider } from "./providers";
import Navbar from "@/components/Navbar";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShareSq",
  description: "Next-gen expense sharing, reimagined.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Provider>
          <div className="relative min-h-screen overflow-hidden text-white">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2a0845] via-[#6441a5] to-[#ff6f61]" />
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
            <div className="absolute bottom-16 right-16 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full" />
            <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-orange-400/20 blur-2xl rounded-full" />

            <Navbar />
            <main className="min-h-screen">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
