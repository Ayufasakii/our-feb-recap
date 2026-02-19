"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RecapItem = {
  title: string;
  detail?: string;
  link?: string;
};

export default function RecapPager({ items }: { items: RecapItem[] }) {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; detail?: string } | null>(null);
  const refs = useRef<Array<HTMLElement | null>>([]);

  const total = items.length;

  const canPrev = index > 0;
  const canNext = index < total - 1;

  const scrollToIndex = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // เมื่อ index เปลี่ยน ให้เลื่อนไปการ์ดนั้น
  useEffect(() => {
    scrollToIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ปรับ index ตามการ scroll ด้วยมือ (optional แต่ทำให้ state ตรงกับที่เห็น)
  useEffect(() => {
    const onScroll = () => {
      // หา section ที่ใกล้ top ที่สุด
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - 12); // top offset คร่าว ๆ
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setIndex(best);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // คีย์บอร์ด (optional)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        setIndex((v) => Math.min(total - 1, v + 1));
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        setIndex((v) => Math.max(0, v - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  const counter = useMemo(() => {
    if (total === 0) return "0/0";
    return `${index + 1}/${total}`;
  }, [index, total]);

  return (
    <div>
      {/* Page indicator bar at the right side */}
      <div
        style={{
          position: "fixed",
          top: 60,
          right: 0,
          zIndex: 20,
          background: "rgba(255,255,255,0.96)",
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          borderLeft: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.04)",
          minWidth: 120,
          alignItems: "stretch",
        }}
      >
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setTimeout(() => scrollToIndex(i), 50);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: i === index ? "2px solid #0070f3" : "1px solid rgba(0,0,0,0.12)",
              background: i === index ? "#e6f0ff" : "white",
              color: i === index ? "#0070f3" : "#222",
              fontWeight: i === index ? 600 : 400,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: i === index ? "0 2px 8px rgba(0,112,243,0.08)" : "none",
              transition: "all 0.2s",
              outline: "none",
              borderBottom: i === index ? "2px solid #0070f3" : "none",
              textAlign: "left",
            }}
            title="Click to jump"
          >
            {it.title}
          </button>
        ))}
      </div>

      {/* การ์ดทีละอัน (เต็มความสูงประมาณ 1 หน้าจอ) */}
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {items.map((it, i) => {
          if (i !== index) return null;
          return (
            <section
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              style={{
                minHeight: "100vh",
                maxWidth: 900,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #fff6fa 60%, #e6f0ff 100%)",
                borderRadius: 32,
                boxShadow: "0 12px 48px 0 rgba(179,79,163,0.18), 0 2px 8px #fff6fa",
                border: "4px solid",
                borderImage: "linear-gradient(90deg, #b34fa3 0%, #e6f0ff 100%) 1",
                cursor: "pointer",
                padding: "0 32px",
                position: "relative",
                animation: "fadeInScale 0.7s cubic-bezier(.68,-0.55,.27,1.55)",
                overflow: "hidden",
              }}
              onClick={() => {
                setModalContent({ title: it.title, detail: it.detail });
                setModalOpen(true);
              }}
            >
              {/* Subtle background pattern */}
              <svg width="100%" height="100%" viewBox="0 0 900 900" style={{ position: "absolute", left: 0, top: 0, zIndex: 0, opacity: 0.08 }}>
                <defs>
                  <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#b34fa3" />
                    <stop offset="100%" stopColor="#fff6fa" />
                  </radialGradient>
                </defs>
                <circle cx="450" cy="450" r="400" fill="url(#bgGrad)" />
              </svg>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, zIndex: 1 }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: "#b34fa3", letterSpacing: "0.03em", textShadow: "0 2px 16px #fff6fa, 0 1px 2px #b34fa3" }}>#{i + 1}</span>
                {it.title && (
                  <span style={{ fontSize: 42, fontWeight: 700, color: "#222", letterSpacing: "0.02em", textShadow: "0 2px 16px #fff6fa" }}>{it.title}</span>
                )}
              </div>
              {/* Only show title in card, detail in popup */}
              <style>{`
                @keyframes fadeInScale {
                  0% { opacity: 0; transform: scale(0.92); }
                  60% { opacity: 1; transform: scale(1.04); }
                  100% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </section>
          );
        })}
      </div>

      {/* Modal popup for description */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: "#fff6fa",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(179,79,163,0.18)",
              border: "2px solid #b34fa3",
              padding: "40px 32px",
              maxWidth: 600,
              width: "90vw",
              textAlign: "center",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#b34fa3", marginBottom: 18 }}>{modalContent?.title}</h2>
            <div style={{ fontSize: 20, color: "#444", lineHeight: 1.6 }}>{modalContent?.detail}</div>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                marginTop: 32,
                padding: "12px 24px",
                borderRadius: 16,
                border: "1.5px solid #b34fa3",
                background: "#f8e8ff",
                color: "#b34fa3",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #b34fa3a0",
                transition: "all 0.2s",
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* เผื่อพื้นที่ให้ปุ่มลอยไม่ทับเนื้อหา */}
      <div style={{ height: 90 }} />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.18)",
  background: "white",
  borderRadius: 999,
  padding: "10px 12px",
  cursor: "pointer",
  fontSize: 14,
};