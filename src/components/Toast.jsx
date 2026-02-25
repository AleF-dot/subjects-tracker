export default function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? "#7f1d1d" : "#1a1a1a", color: "#F5F2EC",
      padding: "0.5rem 1.2rem", borderRadius: "20px", fontSize: "0.76rem",
      zIndex: 1000, animation: "popUp 0.18s ease", whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)", letterSpacing: "0.02em",
    }}>
      {msg}
    </div>
  );
}
