"use client";

import { useMemo, useState } from "react";
import { setUnlocked } from "../lib/auth";

const PASSCODE = process.env.NEXT_PUBLIC_RECAP_PASSCODE ?? "200107";

export default function UnlockPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const hint = useMemo(() => {
    // optional: show nothing; keep it minimal
    return "";
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "#f6f7f9",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>ใส่รหัสเพื่อดู Recap</h1>
        <p style={{ margin: "8px 0 0 0", color: "rgba(0,0,0,0.6)" }}>
          หน้า Recap เป็นแบบ read-only
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim() !== PASSCODE) {
              setError("รหัสไม่ถูกต้อง");
              return;
            }
            setUnlocked(true);
            window.location.href = "/";
          }}
          style={{ marginTop: 14, display: "grid", gap: 10 }}
        >
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            inputMode="numeric"
            placeholder="Passcode"
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              padding: "0 12px",
              fontSize: 16,
            }}
          />

          <button
            type="submit"
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.2)",
              background: "#111",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            เข้าใช้งาน
          </button>

          {error ? (
            <p style={{ margin: 0, color: "#b00020" }}>{error}</p>
          ) : null}

          {hint ? <small style={{ color: "rgba(0,0,0,0.5)" }}>{hint}</small> : null}
        </form>
      </section>
    </main>
  );
}