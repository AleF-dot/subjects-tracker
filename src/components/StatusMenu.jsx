import React from 'react';
import { useRef, useLayoutEffect, useState } from "react";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

const BLOCK_REASON = {
  disponible: null,
  cursando:  "correlativas para cursar incompletas",
  regular:   "correlativas para cursar incompletas",
  aprobada:  "correlativas para aprobar incompletas",
};

function computePos(anchor, menuRef, containerEl) {
  if (!anchor || !containerEl) return null;

  const er = anchor.getBoundingClientRect();
  const cr = containerEl.getBoundingClientRect();
  const menuW = Math.max(er.width, 170);
  const menuH = menuRef?.offsetHeight ?? 220;

  // Coords relativas al contenido del container (igual que las flechas)
  const sl = containerEl.scrollLeft;
  const st = containerEl.scrollTop;
  const offX = cr.left - sl;
  const offY = cr.top  - st;

  const cardLeft   = er.left   - offX;
  const cardBottom = er.bottom - offY;
  const cardTop    = er.top    - offY;

  // Abrir arriba o abajo según espacio en viewport
  const spaceBelow = window.innerHeight - er.bottom;
  const opensUp    = spaceBelow < menuH + 6;
  const top = opensUp ? cardTop - menuH - 6 : cardBottom + 6;

  // Limitar horizontalmente dentro del contenido
  const contentW = containerEl.scrollWidth;
  const left = Math.max(4, Math.min(cardLeft, contentW - menuW - 4));

  return { top, left, width: menuW };
}

export default function StatusMenu({ anchor, current, onSelect, onEdit, onDelete, onClose, allowedStatuses, scrollContainerRef }) {
  const ref  = useRef(null);
  const [pos, setPos] = useState({ top: -9999, left: 0, width: 170 });

  const allowed = allowedStatuses ?? { disponible: true, cursando: true, regular: true, aprobada: true };

  useLayoutEffect(() => {
    if (!anchor) return;
    const containerEl = scrollContainerRef?.current;
    const measure = () => {
      const next = computePos(anchor, ref.current, containerEl);
      setPos(next ?? { top: -9999, left: 0, width: 170 });
    };
    measure();
    // No scroll listener needed — menu scrolls natively with the container
  }, [anchor, scrollContainerRef]);

  return (
    <div
      ref={ref}
      className="status-menu"
      role="menu"
      aria-label="Opciones de materia"
      onClick={e => e.stopPropagation()}
      style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 800 }}
    >
      {(allowed.disponible || allowed.cursando || allowed.regular || allowed.aprobada) && STATUS_ORDER.map(s => {
        const blocked  = !allowed[s];
        const isActive = current === s;
        return (
          <button
            key={s}
            role="menuitemradio"
            aria-checked={isActive}
            aria-disabled={blocked}
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
        role="menuitem"
        className="status-menu-item"
        onClick={() => { onEdit(); onClose(); }}
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✎</span> Editar materia
      </button>
      <button
        role="menuitem"
        className="status-menu-item"
        onClick={() => { onDelete(); onClose(); }}
        style={{ color: "var(--status-bloqueada-dot)" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✕</span> Eliminar materia
      </button>
    </div>
  );
}
