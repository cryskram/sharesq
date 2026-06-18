import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Provider } from "./providers";

const font = Nunito({
  subsets: ["latin"],
});

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
      <body className={`${font.className} bg-[#09090B] text-white antialiased`}>
        <Provider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 -z-50 bg-[#09090B]" />
            <div className="absolute -top-40 left-1/3 -z-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />
            <div className="absolute right-1/4 bottom-0 -z-40 h-[350px] w-[350px] rounded-full bg-fuchsia-500/5 blur-[120px]" />
            <div className="absolute top-1/2 left-0 -z-40 h-[250px] w-[250px] rounded-full bg-indigo-500/5 blur-[100px]" />
            <Navbar />
            <main>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
