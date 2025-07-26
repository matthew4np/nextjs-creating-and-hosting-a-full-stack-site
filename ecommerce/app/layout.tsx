import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import NavBar from "./NavBar";

// Optimized font loading
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyStore - The Best E-Commerce Site",
  description: "Browse and buy the latest and greatest products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
