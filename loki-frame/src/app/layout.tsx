import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loki-Frame",
  description: "Picture frame",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="size-full bg-white text-primary">
      <body className={inter.className + " size-full "}>{children}</body>
    </html>
  );
}
