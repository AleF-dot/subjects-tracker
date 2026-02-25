import { useEffect } from "react";

export default function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn 0.15s ease" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,18,14,0.5)", backdropFilter: "blur(3px)" }} />
      <div style={{ position: "relative", background: "#F5F2EC", border: "1px solid #D5D0C8", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "480px", animation: "popUp 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#EFECE6", border: "none", width: 28, height: 28, borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", color: "#888" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
