import { useRef } from "react";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

// Mensaje explicativo por cada estado bloqueado
const BLOCK_REASON = {
  cursando:  null, // nunca bloqueado
  regular:   "correlativas para cursar incompletas",
  aprobada:  "correlativas para final incompletas",
};

export default function StatusMenu({ anchor, current, onSelect, onEdit, onDelete, onClose, allowedStatuses }) {
  const ref  = useRef(null);
  const rect = anchor?.getBoundingClientRect();

  // allowedStatuses: { cursando: bool, regular: bool, aprobada: bool }
  // Si no se pasa (materia sin correlativas) todo habilitado
  const allowed = allowedStatuses ?? { cursando: true, regular: true, aprobada: true };

  const menuW = Math.max(rect?.width ?? 160, 170);
  const menuH = 290;
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;

  const rawTop  = rect ? (spaceBelow > menuH ? rect.bottom + 6 : rect.top - menuH - 6) : 0;
  const rawLeft = rect ? rect.left : 0;

  const top  = Math.max(8, Math.min(rawTop,  window.innerHeight - menuH - 8));
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth  - menuW  - 8));

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{ position: "fixed", top, left, width: menuW, zIndex: 800 }}
    >
      {(allowed.cursando || allowed.regular || allowed.aprobada) && STATUS_ORDER.map(s => {
        const blocked = !allowed[s];
        const isActive = current === s;
        return (
          <button
            key={s}
            className={`status-menu-item${isActive ? " active" : ""}`}
            onClick={() => { if (!blocked) { onSelect(s); onClose(); } }}
            disabled={blocked}
            title={blocked ? BLOCK_REASON[s] : undefined}
            style={blocked ? { opacity: 0.38, cursor: "not-allowed" } : {}}
          >
            <Dot status={s} />
            <span style={{ color: STATUS[s].color }}>{STATUS[s].label}</span>
            {isActive && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#bbb" }}>✓</span>}
            {blocked && !isActive && (
              <span style={{ marginLeft: "auto", fontSize: "0.58rem", color: "#bbb", textAlign: "right", maxWidth: 90 }}>
                {BLOCK_REASON[s]}
              </span>
            )}
          </button>
        );
      })}
      <button
        className="status-menu-item"
        onClick={() => { onEdit(); onClose(); }}
        style={{ borderTop: (allowed.cursando || allowed.regular || allowed.aprobada) ? "1px solid #E0DAD0" : "none", color: "#555" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✎</span> Editar materia
      </button>
      <button
        className="status-menu-item"
        onClick={() => { onDelete(); onClose(); }}
        style={{ color: "#b44" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✕</span> Eliminar materia
      </button>
    </div>
  );
}