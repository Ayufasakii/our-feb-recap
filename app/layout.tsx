
import type { Metadata } from "next";
import Soundtrack from "./components/Soundtrack";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Our Feb",
  description: "Monthly recap (read-only)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #ffe6f0 0%, #fff6fa 100%)",
        color: "#b34fa3"
      }}>
          {/* Romantic soundtrack, auto-play, loop */}
          <Soundtrack src="/soundtrack/romantic.mp3" />
        {children}
      </body>
    </html>
  );
}