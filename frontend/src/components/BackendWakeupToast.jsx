import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBackendStore } from "../store/useBackendStore";

/**
 * BackendWakeupToast
 * Fully custom portal toast — zero react-toastify dependency.
 * - Header: 'Outfit', sans-serif
 * - Subtitle: 'Inter', sans-serif ("Instant view loaded · Latest data fetching")
 *   with Red, Amber, Green baseline-aligned punctuation dots.
 * - Close button: Positioned at the top-right most corner (opposite label header).
 * - Bottom border: Removed from card border; the 40s Red -> Amber -> Green progress bar acts directly as the bottom border.
 */
const BackendWakeupToast = () => {
  const status = useBackendStore((s) => s.status);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase]     = useState("waking_up");
  const [mounted, setMounted] = useState(false);
  const elapsedRef = useRef(0);
  const startRef   = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "waking_up") {
      setPhase("waking_up");
      if (!startRef.current) startRef.current = Date.now();
      const delay = setTimeout(() => {
        if (useBackendStore.getState().status === "waking_up") setVisible(true);
      }, 1200);
      return () => clearTimeout(delay);
    }
    if (status === "ready") {
      elapsedRef.current = startRef.current
        ? Math.floor((Date.now() - startRef.current) / 1000)
        : 0;
      setPhase("ready");
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        startRef.current = null;
        elapsedRef.current = 0;
      }, 3500);
      return () => clearTimeout(t);
    }
    if (status === "error") {
      setPhase("error");
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        startRef.current = null;
        elapsedRef.current = 0;
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  if (!mounted) return null;

  /* ── per-phase theme & copy ───────────────────────── */
  const themes = {
    waking_up: {
      accent:    "#38bdf8",
      accentRgb: "56,189,248",
      dimRgb:    "14,165,233",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="#38bdf8"
            strokeWidth="1.4"
            strokeDasharray="3 2"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 7 7"
              to="360 7 7"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="7" cy="7" r="2" fill="#38bdf8">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      ),
      label: "LIVE SYNC",
      badge: "EST. 30–40S",
      renderBody: () => (
        <span>
          Instant view loaded · Latest data fetching
          <span
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: "3px",
              marginLeft: "5px",
              verticalAlign: "baseline",
            }}
          >
            <span className="wakeup-dot wakeup-dot-red" />
            <span className="wakeup-dot wakeup-dot-amber" />
            <span className="wakeup-dot wakeup-dot-green" />
          </span>
        </span>
      ),
    },
    ready: {
      accent:    "#10b981",
      accentRgb: "16,185,129",
      dimRgb:    "5,150,105",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="#10b981" strokeWidth="1.4" />
          <path
            d="M4.5 7L6.3 8.8L9.5 5.5"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "LIVE CONNECTED",
      badge: "200 OK",
      renderBody: () => (
        <span>Live connection established · Data synced</span>
      ),
    },
    error: {
      accent:    "#f59e0b",
      accentRgb: "245,158,11",
      dimRgb:    "217,119,6",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="#f59e0b" strokeWidth="1.4" />
          <path
            d="M7 4.5V7.5M7 9.5V10"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "OFFLINE CACHE",
      badge: "TIMEOUT",
      renderBody: () => (
        <span>Instant view active · Backend delayed</span>
      ),
    },
  };

  const th = themes[phase] || themes.waking_up;

  const portal = (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position:   "fixed",
        top:        "74px",
        right:      "14px",
        zIndex:     99999,
        width:      "min(330px, calc(100vw - 24px))",
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateX(0) scale(1)" : "translateX(20px) scale(0.97)",
        transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* outer glow ring */}
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "13px",
          pointerEvents: "none",
          background: `linear-gradient(135deg, rgba(${th.accentRgb},0.32), rgba(${th.accentRgb},0.04) 60%, transparent)`,
        }}
      />

      {/* glass card (bottom border removed to let progress bar act as bottom border) */}
      <div
        style={{
          position:   "relative",
          background: "rgba(4, 8, 20, 0.93)",
          backdropFilter: "blur(28px) saturate(1.6)",
          WebkitBackdropFilter: "blur(28px) saturate(1.6)",
          borderTop:    `1px solid rgba(${th.accentRgb}, 0.24)`,
          borderLeft:   `1px solid rgba(${th.accentRgb}, 0.24)`,
          borderRight:  `1px solid rgba(${th.accentRgb}, 0.24)`,
          borderBottom: "none",
          borderRadius: "12px",
          overflow:   "hidden",
          boxShadow:  `0 24px 48px -8px rgba(0,0,0,0.92), 0 0 32px rgba(${th.accentRgb},0.14), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "2.5px",
            background: `linear-gradient(to bottom, ${th.accent}, rgba(${th.accentRgb},0.08))`,
            borderRadius: "12px 0 0 0",
          }}
        />

        {/* dismiss × button positioned at TOP RIGHT MOST (opposite label header) */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "22px",
            height: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            border: "none",
            background: "transparent",
            color: "rgba(148,163,184,0.75)",
            cursor: "pointer",
            padding: 0,
            zIndex: 10,
            transition: "color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(148,163,184,0.75)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* content row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "10px 32px 10px 14px", // Right padding avoids overlap with top-right close button
          }}
        >
          {/* icon box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              flexShrink: 0,
              background: `rgba(${th.accentRgb}, 0.10)`,
              border:     `1px solid rgba(${th.accentRgb}, 0.25)`,
              boxShadow:  `0 0 12px rgba(${th.accentRgb}, 0.18)`,
              marginTop: "1px",
            }}
          >
            {th.icon}
          </div>

          {/* text block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header row: distinctive 'Outfit' font family */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: th.accent,
                  lineHeight: 1.1,
                }}
              >
                {th.label}
              </span>
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color:       `rgba(${th.accentRgb},0.92)`,
                  background:  `rgba(${th.accentRgb},0.12)`,
                  border:      `1px solid rgba(${th.accentRgb},0.32)`,
                  borderRadius: "4px",
                  padding: "1px 5px",
                  lineHeight: 1.4,
                }}
              >
                {th.badge}
              </span>
            </div>

            {/* Subtitle / body text: distinctive 'Inter' font family */}
            <div
              style={{
                margin: 0,
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(203, 213, 225, 0.92)",
                letterSpacing: "0.01em",
                lineHeight: "1.35",
              }}
            >
              {th.renderBody()}
            </div>
          </div>
        </div>

        {/* bottom progress bar: acts as the bottom border of the toast box */}
        <div
          style={{
            height: "2.5px",
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {phase === "waking_up" ? (
            /* 40-second continuous progress bar transitioning Red -> Amber -> Green */
            <div className="wakeup-40s-bar" />
          ) : (
            /* Solid fill on ready / error */
            <div
              style={{
                height: "100%",
                width: "100%",
                background:
                  phase === "ready"
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #f59e0b, #fbbf24)",
              }}
            />
          )}
        </div>
      </div>

      {/* Styles for 40s progress bar and Red -> Amber -> Green pulsing dots */}
      <style>{`
        .wakeup-40s-bar {
          height: 100%;
          width: 0%;
          border-radius: 0 0 12px 12px;
          animation:
            wakeup-width-40s 40s linear forwards,
            wakeup-color-40s 40s linear forwards;
        }

        @keyframes wakeup-width-40s {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes wakeup-color-40s {
          0% {
            background-color: #ef4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.7);
          }
          30% {
            background-color: #f87171;
            box-shadow: 0 0 8px rgba(248, 113, 113, 0.7);
          }
          45% {
            background-color: #f59e0b;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);
          }
          65% {
            background-color: #d97706;
            box-shadow: 0 0 8px rgba(217, 119, 6, 0.7);
          }
          85% {
            background-color: #10b981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
          }
          100% {
            background-color: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
          }
        }

        .wakeup-dot {
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          display: inline-block;
          vertical-align: baseline;
          animation: wakeup-dot-pulse 3.2s ease-in-out infinite both;
        }
        .wakeup-dot-red {
          background-color: #ef4444;
          box-shadow: 0 0 4px #ef4444;
          animation-delay: 0s;
        }
        .wakeup-dot-amber {
          background-color: #f59e0b;
          box-shadow: 0 0 4px #f59e0b;
          animation-delay: 0.5s;
        }
        .wakeup-dot-green {
          background-color: #10b981;
          box-shadow: 0 0 4px #10b981;
          animation-delay: 1.0s;
        }

        @keyframes wakeup-dot-pulse {
          0%, 80%, 100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          40% {
            opacity: 1;
            transform: scale(1.25);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(portal, document.body);
};

export default BackendWakeupToast;
