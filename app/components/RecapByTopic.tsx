"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RecapEvent = {
  title: string;
  detail?: string;
  link?: string;
};

type Topic = {
  id: string;
  title: string;
  events: RecapEvent[];
};

export default function RecapByTopic({ topics }: { topics: Topic[] }) {
  const [topicIndex, setTopicIndex] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  const total = topics.length;
  const canPrev = topicIndex > 0;
  const canNext = topicIndex < total - 1;

  const scrollToTopic = (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    scrollToTopic(topicIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicIndex]);

  const counter = useMemo(() => {
    if (total === 0) return "0/0";
    return `${topicIndex + 1}/${total}`;
  }, [topicIndex, total]);

  return (
    <div>
      {/* สารบัญ */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "rgba(246,247,249,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "10px 0",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {topics.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTopicIndex(i)}
              style={{
                border: "1px solid rgba(0,0,0,0.14)",
                background: i === topicIndex ? "#111" : "white",
                color: i === topicIndex ? "white" : "#111",
                borderRadius: 999,
                padding: "8px 10px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {t.title}
            </button>
          ))}
        </div>
      </nav>

      {/* ปุ่มเลื่อนทีละ topic */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 14,
          display: "flex",
          justifyContent: "center",
          padding: "0 16px",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 999,
            padding: "10px 12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            onClick={() => setTopicIndex((v) => Math.max(0, v - 1))}
            disabled={!canPrev}
            style={btnStyle}
          >
            ก่อนหน้า
          </button>

          <span style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", minWidth: 56, textAlign: "center" }}>
            {counter}
          </span>

          <button
            onClick={() => setTopicIndex((v) => Math.min(total - 1, v + 1))}
            disabled={!canNext}
            style={btnStyle}
          >
            ถัดไป
          </button>

          <button
            onClick={() => {
              setTopicIndex(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={btnStyle}
          >
            ขึ้นบน
          </button>
        </div>
      </div>

      {/* เนื้อหาแต่ละ topic */}
      <div style={{ display: "grid", gap: 18 }}>
        {topics.map((t, i) => (
          <section
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{
              scrollMarginTop: 70,
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 18,
              background: "white",
              padding: 16,
            }}
          >
            <header style={{ marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{t.title}</h2>
              <p style={{ margin: "6px 0 0 0", color: "rgba(0,0,0,0.55)", fontSize: 13 }}>
                {t.events.length} เหตุการณ์
              </p>
            </header>

            <div style={{ display: "grid", gap: 12 }}>
              {t.events.map((ev, idx) => (
                <article
                  key={idx}
                  style={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 16,
                    padding: 14,
                    background: "#fff",
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 16 }}>{ev.title}</h3>
                  {ev.detail ? (
                    <p style={{ margin: "8px 0 0 0", color: "rgba(0,0,0,0.75)", lineHeight: 1.6 }}>
                      {ev.detail}
                    </p>
                  ) : null}
                  {ev.link ? (
                    <div style={{ marginTop: 10 }}>
                      <a href={ev.link} target="_blank" rel="noreferrer">
                        เปิดลิงก์
                      </a>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* กันปุ่มลอยทับเนื้อหา */}
      <div style={{ height: 96 }} />
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