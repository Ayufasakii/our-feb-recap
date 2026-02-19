import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Feb",
  description: "Monthly recap (read-only)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Geist, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans Thai", sans-serif',
          background: "linear-gradient(135deg, #f8e8ff 0%, #e6f0ff 100%)",
          color: "#222",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}