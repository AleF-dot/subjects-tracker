import { useRef } from "react";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

const BLOCK_REASON = {
  disponible: null,
  cursando:  "correlativas para cursar incompletas",
  regular:   "correlativas para cursar incompletas",
  aprobada:  "correlativas para aprobar incompletas",
};

// anchorRect: { top, bottom, left, width } relativo al scroll container (position:absolute)
export default function StatusMenu({ anchorRect, current, onSelect, onEdit, onDelete, onClose, allowedStatuses }) {
  const ref = useRef(null);

  const allowed = allowedStatuses ?? { disponible: true, cursando: true, regular: true, aprobada: true };

  const menuW  = Math.max(anchorRect?.width ?? 160, 170);
  const menuH  = ref.current?.offsetHeight ?? 220;

  // arriba o abajo: usamos coordenadas viewport para saber si hay espacio
  const spaceBelow = anchorRect ? window.innerHeight - anchorRect.viewportBottom : 999;
  const opensUp    = spaceBelow < menuH + 6;

  const top  = anchorRect ? (opensUp ? anchorRect.top - menuH - 6 : anchorRect.bottom + 6) : 0;
  const left = anchorRect ? anchorRect.left : 0;

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{ position: "absolute", top, left, width: menuW, zIndex: 800 }}
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
        style={{ borderTop: "1px solid #E0DAD0", color: "var(--text-secondary)" }}
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
