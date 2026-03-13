import React from 'react';
import { useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

const BLOCK_REASON = {
  disponible: null,
  cursando:  "correlativas para cursar incompletas",
  regular:   "correlativas para cursar incompletas",
  aprobada:  "correlativas para aprobar incompletas",
};

/**
 * Calcula posición en viewport (position:fixed) y el clip-path horizontal.
 *
 * Por qué fixed + clip-path en lugar de absolute dentro del container:
 *   - absolute + overflow-y:hidden → el menú se clipea cuando abre hacia arriba.
 *   - fixed → sin clipping vertical, nunca se corta por arriba/abajo.
 *   - clip-path:inset() → simula el corte horizontal nativo: cuando la card
 *     empieza a salirse por el borde izquierdo del container, el menú también
 *     se va cortando de la misma manera, sin JS de scroll.
 *
 * Vertical: abre abajo si hay espacio, arriba si no. Nunca se clipea.
 * Horizontal: fixed en viewport. clip-path recorta el borde izquierdo si la
 *   card está parcialmente scrolleada fuera del container visible.
 */
function applyPos(anchor, menuEl, containerEl) {
  if (!anchor || !menuEl || !containerEl) return;

  const er  = anchor.getBoundingClientRect();
  const cr  = containerEl.getBoundingClientRect();
  const menuW = er.width; // mismo ancho que la card, siempre alineado
  const menuH = menuEl.offsetHeight || 220;

  // Vertical: fixed en viewport coords
  const spaceBelow = window.innerHeight - er.bottom;
  const opensUp    = spaceBelow < menuH + 6 && er.top >= menuH + 6;
  const top        = opensUp ? er.top - menuH - 6 : er.bottom + 6;

  // Horizontal: alineado con la card en coords de viewport
  const left = er.left;

  // clip-path: recorta ambos lados del menú cuando se sale de los bordes
  // visibles del container, exactamente como se corta una card.
  const clipLeft  = Math.max(0, cr.left  - left);
  const clipRight = Math.max(0, (left + menuW) - cr.right);
  // Sin round cuando hay clip activo: el corte debe ser limpio (recto),
  // igual que como se corta cualquier card en el borde del container.
  const clip = (clipLeft > 0 || clipRight > 0)
    ? `inset(0 ${clipRight}px 0 ${clipLeft}px)`
    : "";

  menuEl.style.top       = `${top}px`;
  menuEl.style.left      = `${left}px`;
  menuEl.style.width     = `${menuW}px`;
  menuEl.style.clipPath  = clip;
  menuEl.style.opacity   = "1";
}

export default function StatusMenu({ anchor, current, onSelect, onEdit, onDelete, onClose, allowedStatuses, scrollContainerRef }) {
  const ref        = useRef(null);
  const anchorRef  = useRef(anchor);
  useEffect(() => { anchorRef.current = anchor; }, [anchor]);

  const allowed = allowedStatuses ?? { disponible: true, cursando: true, regular: true, aprobada: true };

  // Posición inicial: síncrona antes del primer paint
  useLayoutEffect(() => {
    if (!anchor || !ref.current) return;
    applyPos(anchor, ref.current, scrollContainerRef?.current);
  }, [anchor, scrollContainerRef]);

  // Scroll y resize (incluyendo zoom del navegador): reposicionar via DOM directo,
  // sin setState para no perder frames.
  useEffect(() => {
    if (!anchor || !ref.current) return;
    const el          = ref.current;
    const containerEl = scrollContainerRef?.current;
    let ticking = false;

    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        applyPos(anchorRef.current, el, containerEl);
      });
    };

    // capture:true para capturar scroll en cualquier ancestro (el container, window, etc.)
    window.addEventListener("scroll",  update, { capture: true, passive: true });
    window.addEventListener("resize",  update, { passive: true });

    // ResizeObserver en el container: captura zoom y cambios de tamaño
    // que no siempre disparan window resize (e.g. zoom en algunos browsers)
    let ro;
    if (containerEl) {
      ro = new ResizeObserver(update);
      ro.observe(containerEl);
    }

    return () => {
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [anchor, scrollContainerRef]);

  const menu = (
    <div
      ref={ref}
      className="status-menu"
      data-status-menu
      role="menu"
      aria-label="Opciones de materia"
      // Arranca invisible hasta que useLayoutEffect escribe la posición correcta
      style={{ position: "fixed", top: -9999, left: 0, opacity: 0 }}
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

  return createPortal(menu, document.body);
}
