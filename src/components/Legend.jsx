import React, { useMemo } from 'react';
import { STATUS } from "../utils/constants";
import { useTheme } from "../context/ThemeContext";

const SolidArrow = ({ color }) => (
  <svg width="22" height="10" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <line x1="0" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <polygon points="13,2 20,5 13,8" fill={color} />
  </svg>
);

const DashArrow = ({ color }) => (
  <svg width="22" height="10" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <line x1="0" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" />
    <polygon points="13,2 20,5 13,8" fill={color} />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" style={{ display: "block", transition: "transform 0.2s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>
    <polyline points="4,3 9,8 4,13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Legend({ showLegend, onToggleLegend, allSubjects = [] }) {
  const { dark, daltonType } = useTheme(); // eslint-disable-line no-unused-vars — fuerza re-render al cambiar tema
  const usedTypes = useMemo(() => {
    const used = { regularCursar: false, aprobadaCursar: false, regularFinal: false, aprobadaFinal: false };
    for (const s of allSubjects) {
      for (const c of s.correlatives ?? []) {
        if (c.type === "regular")  used.regularCursar  = true;
        if (c.type === "aprobada") used.aprobadaCursar = true;
      }
      for (const c of s.correlativesParaFinal ?? []) {
        if (c.type === "regular")  used.regularFinal  = true;
        if (c.type === "aprobada") used.aprobadaFinal = true;
      }
    }
    return used;
  }, [allSubjects]);

  // Leer colores desde CSS vars para respetar el modo daltonismo
  const cssVars = typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const cv = (name) => cssVars?.getPropertyValue(name).trim() || "#888";

  const arrowItems = [
    { key: "regularCursar",  Arrow: SolidArrow, color: cv("--arrow-regular-cursar"),  label: "Regulares necesarias para cursar" },
    { key: "aprobadaCursar", Arrow: SolidArrow, color: cv("--arrow-aprobada-cursar"), label: "Aprobadas necesarias para cursar" },
    { key: "regularFinal",   Arrow: DashArrow,  color: cv("--arrow-regular-final"),   label: "Regulares necesarias para aprobación" },
    { key: "aprobadaFinal",  Arrow: DashArrow,  color: cv("--arrow-aprobada-final"),  label: "Aprobadas necesarias para aprobación" },
  ];

  return (
    <div style={{ borderBottom: "1px solid var(--border)", fontSize: "0.68rem", color: "var(--text-muted)", display: "flex", alignItems: "stretch", animation: "legendFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both" }}>

      {/* Chevron — colapsa toda la leyenda */}
      <button
        onClick={onToggleLegend}
        title={showLegend ? "Ocultar leyenda" : "Mostrar leyenda"}
        style={{
          background: "none", border: "none",
          cursor: "pointer", padding: "0.6rem 0.9rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-ghost)", flexShrink: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-muted)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-ghost)"}
      >
        <ChevronIcon open={showLegend} />
      </button>

      {/* Contenido colapsable */}
      <div style={{
        display: "grid",
        gridTemplateRows: showLegend ? "1fr" : "0fr",
        transition: "grid-template-rows 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
        flex: 1,
      }}>
        <div style={{
          minHeight: 0,
          overflow: "visible",
          opacity: showLegend ? 1 : 0,
          transition: "opacity 0.22s ease",
        }}>
        {/* Estados */}
        <div style={{ padding: "0.55rem 1rem 0.55rem 0", display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {Object.entries(STATUS).map(([key, s], i) => (
            <span key={key} style={{
              display: "flex", alignItems: "center", gap: 5,
              animation: showLegend ? `legendItemIn 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 0.04}s both` : "none",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
              <span style={{ color: s.color }}>{s.label}</span>
            </span>
          ))}
        </div>

        {/* Flechas */}
        <div style={{ padding: "0.4rem 1rem 0.9rem 0", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {arrowItems.map(({ key, Arrow, color, label }, i) => (
            <span key={key} style={{
              display: "flex", alignItems: "center", gap: 5,
              opacity: usedTypes[key] ? 1 : 0.35,
              transition: "opacity 0.2s",
              position: "relative",
              animation: showLegend ? `legendItemIn 0.35s cubic-bezier(0.22,1,0.36,1) ${(Object.keys(STATUS).length + i) * 0.04}s both` : "none",
            }}>
              <Arrow color={color} /> {label}
              {!usedTypes[key] && (
                <span style={{
                  position: "absolute", left: 0, right: 0,
                  top: "50%", height: "1px",
                  background: "var(--text-muted)",
                  pointerEvents: "none",
                }} />
              )}
            </span>
          ))}
        </div>
        </div>
      </div>

      {/* Preview cuando leyenda colapsada — siempre montado, animado con opacity */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.6rem", padding: "0 1rem",
        opacity: showLegend ? 0 : 0.5,
        pointerEvents: showLegend ? "none" : "auto",
        transition: "opacity 0.22s ease",
        position: showLegend ? "absolute" : "relative",
        visibility: showLegend ? "hidden" : "visible",
        flexShrink: 0,
      }}>
        {Object.values(STATUS).map((s, i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0,
            animation: !showLegend ? `legendItemIn 0.3s cubic-bezier(0.22,1,0.36,1) ${i * 0.035}s both` : "none",
          }} />
        ))}
        <span style={{ width: 1, height: 12, background: "var(--border-soft)", flexShrink: 0 }} />
        {arrowItems.map(({ key, Arrow, color }, i) => (
          <span key={key} style={{
            opacity: usedTypes[key] ? 1 : 0.3,
            animation: !showLegend ? `legendItemIn 0.3s cubic-bezier(0.22,1,0.36,1) ${(Object.keys(STATUS).length + i) * 0.035}s both` : "none",
          }}>
            <Arrow color={color} />
          </span>
        ))}
      </div>
    </div>
  );
}
