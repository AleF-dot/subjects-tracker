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

function computePos(anchor, menuRef, scrollContainerRef) {
  if (!anchor) return null;
  const er = anchor.getBoundingClientRect();
  const menuW = Math.max(er.width, 170);
  const menuH = menuRef?.offsetHeight ?? 220;

  if (scrollContainerRef?.current) {
    const cr = scrollContainerRef.current.getBoundingClientRect();
    if (er.right < cr.left || er.left > cr.right) return null;
  }

  const spaceBelow = window.innerHeight - er.bottom;
  const opensUp    = spaceBelow < menuH + 6;
  const rawTop     = opensUp ? er.top - menuH - 6 : er.bottom + 6;
  const rawLeft    = er.left;

  return {
    top:   Math.max(8, Math.min(rawTop,  window.innerHeight - menuH - 8)),
    left:  Math.max(8, Math.min(rawLeft, window.innerWidth  - menuW - 8)),
    width: menuW,
  };
}

export default function StatusMenu({ anchor, current, onSelect, onEdit, onDelete, onClose, allowedStatuses, scrollContainerRef }) {
  const ref  = useRef(null);
  // Inicializar con top:-9999 para que sea invisible pero medible desde el primer render
  const [pos, setPos] = useState({ top: -9999, left: 0, width: 170 });

  const allowed = allowedStatuses ?? { disponible: true, cursando: true, regular: true, aprobada: true };

  useLayoutEffect(() => {
    if (!anchor) return;

    // Primera medición: ahora ref.current existe y tiene altura real
    const next = computePos(anchor, ref.current, scrollContainerRef);
    setPos(next ?? { top: -9999, left: 0, width: 170 });

    const scrollEl = scrollContainerRef?.current;
    const fn = () => {
      requestAnimationFrame(() => {
        const p = computePos(anchor, ref.current, scrollContainerRef);
        setPos(p ?? { top: -9999, left: 0, width: 170 });
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    if (scrollEl) scrollEl.addEventListener("scroll", fn, { passive: true });
    return () => {
      window.removeEventListener("scroll", fn);
      if (scrollEl) scrollEl.removeEventListener("scroll", fn);
    };
  }, [anchor, scrollContainerRef]);

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 800 }}
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
