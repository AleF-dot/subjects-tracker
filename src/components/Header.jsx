import React from 'react';
import { STATUS } from "../utils/constants";

export default function Header({ counts, onSelectPlan, onNewSubject }) {
  return (
    <header style={{ borderBottom: "1px solid #D5D0C8", padding: "1.5rem 2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "var(--text-faint)", textTransform: "uppercase", marginBottom: "0.3rem", fontFamily: "'DM Mono', monospace" }}>
          Gestión académica de
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
          Materias
        </h1>
      </div>

      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        {[["aprobada", "Aprobadas"], ["regular", "Regulares"], ["cursando", "Cursando"]].map(([k, label]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.3rem", fontWeight: 500, color: STATUS[k].dot, lineHeight: 1 }}>
              {counts[k] || 0}
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-faint)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
        <div style={{ width: 1, height: 32, background: "var(--border)" }} />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-ghost" onClick={onSelectPlan} style={{ fontSize: "0.76rem", padding: "0.55rem 0.95rem" }}>Seleccionar plan de estudio</button>
          <button className="btn-primary" onClick={onNewSubject}>+ Agregar materia</button>
        </div>
      </div>
    </header>
  );
}
