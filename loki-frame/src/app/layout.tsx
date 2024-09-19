import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loki-Frame",
  description: "Picture frame",
  icons: "/icon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel" className="size-full">
      <body className={inter.className + " size-full overflow-hidden"}>
        {children}
      </body>
    </html>
  );
}
