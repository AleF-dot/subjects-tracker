import { STATUS } from "../utils/constants";

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
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#D97706", fontWeight: 700 }}>→</span> Regular (cursar)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#059669", fontWeight: 700 }}>→</span> Aprobada (cursar)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.8 }}>
          <span style={{ color: "#D97706", fontWeight: 700, letterSpacing: "-1px" }}>╌→</span> Regular (final)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.8 }}>
          <span style={{ color: "#059669", fontWeight: 700, letterSpacing: "-1px" }}>╌→</span> Aprobada (final)
        </span>
      </span>
    </div>
  );
}
