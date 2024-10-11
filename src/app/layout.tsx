import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AddPhotosProvider from "./components/AddPhotosProvider";

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
    <html
      lang="en"
      data-theme="mytheme"
      className="size-full"
      style={{ scrollbarGutter: "unset" }}
    >
      <body className={inter.className + " size-full overflow-hidden"}>
        <div className="h-full md:py-5 overflow-hidden max-w-screen-xl m-auto">
          <AddPhotosProvider>{children}</AddPhotosProvider>
        </div>
      </body>
    </html>
  );
}
