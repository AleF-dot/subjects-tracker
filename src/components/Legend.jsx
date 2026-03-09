import { STATUS } from "../utils/constants";

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

export default function Legend() {
  return (
    <div style={{ padding: "0.55rem 2rem", borderBottom: "1px solid #EAE6DF", fontSize: "0.68rem", color: "#999", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        {Object.entries(STATUS).map(([key, s]) => (
          <span key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
            <span style={{ color: s.color }}>{s.label}</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <SolidArrow color="#D97706" /> Regulares necesarias para cursar
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <SolidArrow color="#059669" /> Aprobadas necesarias para cursar
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <DashArrow color="#06B6D4" /> Regulares necesarias para aprobación
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <DashArrow color="#7C3AED" /> Aprobadas necesarias para aprobación
        </span>
      </div>
    </div>
  );
}
