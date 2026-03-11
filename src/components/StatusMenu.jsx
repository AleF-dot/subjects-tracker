import { useRef } from "react";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

const BLOCK_REASON = {
  disponible: null,
  cursando:  "correlativas para cursar incompletas",
  regular:   "correlativas para cursar incompletas",
  aprobada:  "correlativas para aprobar incompletas",
};

// anchor ahora puede ser un elemento DOM o { top, left, width } de coordenadas ya calculadas
export default function StatusMenu({ anchor, current, onSelect, onEdit, onDelete, onClose, allowedStatuses }) {
  const ref = useRef(null);

  const allowed = allowedStatuses ?? { disponible: true, cursando: true, regular: true, aprobada: true };

  // Soporte para anchor como elemento DOM (legacy) o como coordenadas pre-calculadas
  let rect;
  if (anchor && typeof anchor.getBoundingClientRect === "function") {
    rect = anchor.getBoundingClientRect();
  } else if (anchor && typeof anchor === "object") {
    rect = anchor; // { top, bottom, left, right, width, height }
  }

  const menuW = Math.max(rect?.width ?? 160, 170);
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;
  const menuH = ref.current?.offsetHeight ?? 220;
  const opensUp = rect ? spaceBelow < menuH + 6 : false;

  const rawTop  = rect ? (opensUp ? rect.top - menuH - 6 : rect.bottom + 6) : 0;
  const rawLeft = rect ? rect.left : 0;

  const top  = Math.max(8, Math.min(rawTop,  window.innerHeight - menuH - 8));
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth  - menuW - 8));

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{ position: "fixed", top, left, width: menuW, zIndex: 800 }}
    >
      {(allowed.disponible || allowed.cursando || allowed.regular || allowed.aprobada) && STATUS_ORDER.map(s => {
        const blocked  = !allowed[s];
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
            {isActive && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--text-faint)" }}>✓</span>}
            {blocked && !isActive && (
              <span style={{ marginLeft: "auto", fontSize: "0.58rem", color: "var(--text-faint)", textAlign: "right", maxWidth: 90 }}>
                {BLOCK_REASON[s]}
              </span>
            )}
          </button>
        );
      })}
      <button
        className="status-menu-item"
        onClick={() => { onEdit(); onClose(); }}
        style={{ borderTop: (allowed.disponible || allowed.cursando || allowed.regular || allowed.aprobada) ? "1px solid #E0DAD0" : "none", color: "var(--text-secondary)" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✎</span> Editar materia
      </button>
      <button
        className="status-menu-item"
        onClick={() => { onDelete(); onClose(); }}
        style={{ color: "var(--status-bloqueada-dot)" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✕</span> Eliminar materia
      </button>
    </div>
  );
}
