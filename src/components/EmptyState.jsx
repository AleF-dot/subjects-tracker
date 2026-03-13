import React from 'react';

export default function EmptyState({ onSelectPlan, onNewSubject }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "55vh", padding: "2rem", textAlign: "center",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Ilustración minimalista */}
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ marginBottom: "1.5rem", opacity: 0.18 }}>
        <rect x="8" y="16" width="18" height="44" rx="4" stroke="var(--text-muted)" strokeWidth="2.5" />
        <rect x="31" y="8" width="18" height="52" rx="4" stroke="var(--text-muted)" strokeWidth="2.5" />
        <rect x="54" y="22" width="10" height="38" rx="3" stroke="var(--text-muted)" strokeWidth="2.5" />
        <line x1="26" y1="38" x2="31" y2="38" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="49" y1="38" x2="54" y2="38" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="2 2" />
      </svg>

      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
        fontWeight: 700, letterSpacing: "-0.02em",
        marginBottom: "0.6rem", color: "var(--text-primary)",
      }}>
        Tu plan de estudios no tiene materias todavía
      </h2>

      <p style={{
        fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6,
        maxWidth: "340px", marginBottom: "1.5rem",
      }}>
        Agregá tus materias, definí correlatividades y visualizá qué podés cursar o rendir en el momento.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          className="btn-primary"
          onClick={onSelectPlan}
          style={{ fontSize: "0.85rem", padding: "0.65rem 1.25rem" }}
        >
          Seleccioná tu plan de estudios
        </button>

        <span style={{
          fontSize: "0.72rem", color: "var(--text-ghost)",
          fontFamily: "'DM Mono', monospace",
        }}>
          o crealo
        </span>

        <button
          className="btn-ghost"
          onClick={onNewSubject}
          style={{ fontSize: "0.85rem", padding: "0.65rem 1.25rem" }}
        >
          + Agregando materias
        </button>
      </div>
    </div>
  );
}
