import { STATUS } from "../utils/constants";

const SolidArrow = ({ color }) => (
  <svg width="22" height="10" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <line x1="0" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <polygon points="13,2 20,5 13,8" fill={color} />
  </svg>
);

const DashArrow = ({ color }) => (
  <svg width="22" height="10" style={{ display: "inline-block", verticalAlign: "middle", opacity: 0.8 }}>
    <line x1="0" y1="5" x2="16" y2="5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" />
    <polygon points="13,2 20,5 13,8" fill={color} fillOpacity="0.8" />
  </svg>
);

export default function Legend() {
  return (
    <div style={{ padding: "0.65rem 2rem", borderBottom: "1px solid #EAE6DF", fontSize: "0.68rem", color: "#999", display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
      {Object.entries(STATUS).map(([key, s]) => (
        <span key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
          <span style={{ color: s.color }}>{s.label}</span>
        </span>
      ))}
      <span style={{ marginLeft: "auto", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <SolidArrow color="#D97706" /> Regular (cursar)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <SolidArrow color="#059669" /> Aprobada (cursar)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <DashArrow color="#D97706" /> Regular (final)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <DashArrow color="#059669" /> Aprobada (final)
        </span>
      </span>
    </div>
  );
}
