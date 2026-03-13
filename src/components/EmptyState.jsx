import React from 'react';

export default function EmptyState({ onSelectPlan, onNewSubject }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "55vh", padding: "2rem", textAlign: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      <svg width="64" height="64" viewBox="0 0 72 72" fill="none" style={{ marginBottom: "1.5rem", opacity: 0.18 }}>
        <rect x="8" y="16" width="18" height="44" rx="4" stroke="var(--text-muted)" strokeWidth="2.5" />
        <rect x="31" y="8" width="18" height="52" rx="4" stroke="var(--text-muted)" strokeWidth="2.5" />
        <rect x="54" y="22" width="10" height="38" rx="3" stroke="var(--text-muted)" strokeWidth="2.5" />
        <line x1="26" y1="38" x2="31" y2="38" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="49" y1="38" x2="54" y2="38" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="2 2" />
      </svg>

      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
        fontWeight: 700, letterSpacing: "-0.02em",
        marginBottom: "0.5rem", color: "var(--text-primary)",
      }}>
        ¿Cómo querés empezar?
      </h2>
      <p style={{
        fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6,
        maxWidth: "320px", marginBottom: "2.25rem",
      }}>
        Elegí un plan de estudios existente o creá el tuyo propio materia por materia.
      </p>

      {/* Dos tarjetas paralelas */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: "520px" }}>
        {/* Opción A: elegir plan */}
        <button
          onClick={onSelectPlan}
          style={{
            flex: "1 1 200px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.5rem 1.25rem",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.15s, box-shadow 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>🎓</div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
            Elegir plan de estudios
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            UTN, UNR y más. Las materias y correlatividades se cargan solas.
          </div>
        </button>

        {/* Opción B: crear propio */}
        <button
          onClick={onNewSubject}
          style={{
            flex: "1 1 200px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.5rem 1.25rem",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.15s, box-shadow 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>✏️</div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
            Crear mi propio plan
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Agregá materias manualmente y definí vos las correlatividades.
          </div>
        </button>
      </div>
    </div>
  );
}
