"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import RecapCards from "./components/RecapCards";
import { clearUnlocked, isUnlocked } from "./lib/auth";

// แนะนำให้ import แบบ static เพื่อไม่ต้องเดา relative path ตอน runtime
import recap from "./content/current-month.json";

type RecapData = {
  monthLabel: string;
  updatedAt: string;
  items: { title: string; detail?: string; link?: string }[];
};

export default function HomePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  // cast ให้ TS รู้ type
  const data = recap as RecapData;

  useEffect(() => {
    if (!isUnlocked()) {
      router.replace("/unlock");
      return;
    }
    setAllowed(true);
  }, [router]);

  const header = useMemo(() => {
    return { monthLabel: data.monthLabel ?? "Our Feb", updatedAt: data.updatedAt ?? "" };
  }, [data.monthLabel, data.updatedAt]);

  if (!allowed) return null;

  return (
    <main className="romantic-gradient" style={{ maxWidth: 980, margin: "0 auto", padding: 24, minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: "10px 0 0 0", fontSize: 38, fontWeight: 700, color: "#b34fa3", letterSpacing: "0.04em", textShadow: "0 2px 16px #fff6fa, 0 1px 2px #b34fa3" }}>{header.monthLabel}</h1>
          {header.updatedAt ? (
            <p style={{ margin: "6px 0 0 0", color: "#b34fa3", fontWeight: 500, fontSize: 18, letterSpacing: "0.02em" }}>
              อัปเดตล่าสุด: {header.updatedAt}
            </p>
          ) : null}
        </div>

        <button
          onClick={() => {
            clearUnlocked();
            router.replace("/unlock");
          }}
          style={{
            border: "1px solid #b34fa3",
            background: "#fff6fa",
            borderRadius: 16,
            padding: "12px 18px",
            cursor: "pointer",
            height: 44,
            marginTop: 10,
            color: "#b34fa3",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 2px 8px #b34fa3a0",
            transition: "all 0.2s",
          }}
        >
          ล็อกอีกครั้ง
        </button>
      </header>

      <section className="card-romantic" style={{ marginBottom: 32 }}>
        <RecapCards items={data.items ?? []} />
      </section>

      <footer style={{ padding: "18px 2px", color: "#b34fa3", textAlign: "center", fontWeight: 500, fontSize: 16 }}>
        <small>ส่งให้แฟนสาวด้วยความรัก 💖</small>
      </footer>
    </main>
  );
}