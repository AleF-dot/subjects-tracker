import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PLANES } from '../data/planes';

const FILTERS = ["Todos", "UNR", "UTN"];

// Fix: ConfirmOverwriteModal y ConfirmDeleteModal unificados en un componente genérico
function ConfirmModal({ open, title, description, confirmLabel, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  React.useEffect(() => {
    if (open) { setVisible(true); setAnimating(false); }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!visible) return null;
  const closing = animating && !open;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
    }}>
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", zIndex: 1,
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "1.5rem",
        width: "100%", maxWidth: "320px",
        animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600, margin: "0 0 0.5rem" }}>
          {title}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-ghost" onClick={onCancel} style={{ flex: 1 }}>Cancelar</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "0.6rem 1rem",
              background: "var(--status-bloqueada-dot)", border: "none",
              borderRadius: "8px", cursor: "pointer",
              color: "#fff", fontSize: "0.78rem", fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const MAIL = "subjectstracker@gmail.com";

function SuggestPlanModal({ open, onClose, userEmail }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  React.useEffect(() => {
    if (open) { setVisible(true); setAnimating(false); }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!visible) return null;
  const closing = animating && !open;
  const body = [
    userEmail ? `De: ${userEmail}\n` : "",
    "Universidad: \nCarrera: \nPlan: \n\nDetalles de las materias y correlativas:\n\nNotas:\n",
  ].join("");
  const mailtoHref = `mailto:${MAIL}?subject=${encodeURIComponent("Sugerencia de plan de estudios")}&body=${encodeURIComponent(body)}`;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
      animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
    }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", zIndex: 1,
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "1.5rem",
        width: "100%", maxWidth: "320px",
        animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "0.75rem", right: "0.75rem",
          background: "var(--bg-elevated)", border: "none",
          width: 26, height: 26, borderRadius: "6px",
          cursor: "pointer", fontSize: "0.8rem", color: "var(--text-muted)",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
        >✕</button>
        <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem", paddingRight: "1.5rem" }}>
          ¿No encontraste tu plan?
        </p>
        <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 1.25rem" }}>
          Mandá tu plan de estudios por correo — universidad, carrera, materias y correlativas — si es válido muy probablemente se agrege a la lista.
        </p>
        <a
          href={mailtoHref}
          style={{
            display: "block", textAlign: "center",
            padding: "0.6rem 1rem", borderRadius: "8px",
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            color: "var(--text-primary)", fontSize: "0.78rem",
            fontFamily: "inherit", textDecoration: "none",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
        >
          Enviar por correo
        </a>
      </div>
    </div>
  );
}

export default function PlanSelectorModal({ open, onClose, onImport, onExport, onLoadPlan, onClearPlan, hasData }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [pendingPlan, setPendingPlan] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const { dark } = useTheme(); // eslint-disable-line no-unused-vars
  const { session } = useAuth();
  const userEmail = session?.user?.email ?? null;

  React.useEffect(() => {
    if (open) { setVisible(true); setAnimating(false); setFilter("Todos"); }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;
  const closing = animating && !open;

  const filtered = PLANES.filter(p => filter === "Todos" || p.universidad === filter);

  const handleSelectPlan = (plan) => {
    if (hasData) {
      setPendingPlan(plan);
      setConfirmOpen(true);
    } else {
      onLoadPlan(plan);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (pendingPlan) onLoadPlan(pendingPlan);
    setConfirmOpen(false);
    setPendingPlan(null);
    onClose();
  };

  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 1100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
      }}>
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }} />
        <div style={{
          position: "relative", zIndex: 1,
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: "14px",
          width: "100%", maxWidth: "420px",
          // Fix: 80dvh respeta el teclado virtual en móvil
          maxHeight: "80dvh",
          height: "80dvh",
          display: "flex", flexDirection: "column",
          animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
          boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
          overflow: "hidden",
        }}>

          {/* Header con filtros */}
          <div style={{
            padding: "1.25rem 1.5rem 0",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", margin: 0,
              }}>
                Seleccionar plan de estudios
              </p>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <button
                  onClick={() => setSuggestOpen(true)}
                  style={{
                    background: "var(--bg-elevated)", border: "none",
                    width: 26, height: 26, borderRadius: "6px",
                    cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)",
                    fontFamily: "inherit", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                >?</button>
                <button onClick={onClose} style={{
                  background: "var(--bg-elevated)", border: "none",
                  width: 26, height: 26, borderRadius: "6px",
                  cursor: "pointer", fontSize: "0.8rem", color: "var(--text-muted)",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                >✕</button>
              </div>
            </div>

            {/* Filtro tabs */}
            <div style={{ display: "flex", gap: "0.25rem", paddingBottom: "1rem" }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: filter === f ? "var(--text-muted)" : "var(--border)",
                    background: filter === f ? "var(--bg-hover)" : "transparent",
                    color: filter === f ? "var(--text-primary)" : "var(--text-muted)",
                    fontSize: "0.72rem", cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de planes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {filtered.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    width: "100%", background: "var(--bg-elevated)",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    padding: "0.75rem 1rem", cursor: "pointer",
                    transition: "all 0.15s", textAlign: "left",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.borderColor = "var(--text-muted)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <span style={{ fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: 500 }}>{plan.carrera}</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: "0.2rem", fontFamily: "'DM Mono', monospace" }}>{plan.universidad} · {plan.plan}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer con importar/exportar/eliminar */}
          <div style={{
            borderTop: "1px solid var(--border)",
            padding: "0.9rem 1.5rem",
            display: "flex", gap: "0.5rem",
            flexShrink: 0,
          }}>
            <button className="btn-ghost" onClick={onImport} style={{ flex: 1, fontSize: "0.74rem" }}>↓ Importar plan</button>
            <button className="btn-ghost" onClick={onExport} style={{ flex: 1, fontSize: "0.74rem" }}>↑ Exportar plan</button>
            {hasData && (
              <button
                onClick={() => setConfirmDeleteOpen(true)}
                style={{
                  flex: 1, fontSize: "0.74rem",
                  padding: "0.5rem 0.75rem",
                  background: "transparent",
                  border: "1px solid var(--status-bloqueada-dot)",
                  borderRadius: "8px", cursor: "pointer",
                  color: "var(--status-bloqueada-dot)",
                  fontFamily: "inherit", fontWeight: 500,
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--status-bloqueada-dot)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--status-bloqueada-dot)"; }}
              >
                ✕ Eliminar plan
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="¿Reemplazar plan actual?"
        description="Tenés materias cargadas. Al cargar este plan se van a pisar. ¿Querés continuar?"
        confirmLabel="Sí, reemplazar"
        onConfirm={handleConfirm}
        onCancel={() => { setConfirmOpen(false); setPendingPlan(null); }}
      />
      <ConfirmModal
        open={confirmDeleteOpen}
        title="¿Eliminar plan?"
        description="Se van a borrar todas las materias cargadas. Esta acción no se puede deshacer."
        confirmLabel="Sí, eliminar todo"
        onConfirm={() => { setConfirmDeleteOpen(false); onClearPlan(); onClose(); }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <SuggestPlanModal open={suggestOpen} onClose={() => setSuggestOpen(false)} userEmail={userEmail} />
    </>
  );
}
