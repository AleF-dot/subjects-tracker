import React from 'react';
import { useRef, useState, useEffect } from "react";
import Dot from "./Dot";
import { STATUS } from "../utils/constants";

const BADGE_COLOR = "#E53E3E";

export default function SubjectCard({
  subject, status, highlighted, highlightType, dimmed, isSelected, menuOpen,
  onCardClick, onChevronToggle, cardRef, dotRef, arrowFilter, onArrowFilterChange,
  selectedSubject, isNew, isExiting,
}) {
  const innerRef = useRef(null);
  const [badgePressed, setBadgePressed] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const prevStatusRef = useRef(status);

  const st = STATUS[status];
  const isBloqueada = status === "bloqueada";

  useEffect(() => {
    if (prevStatusRef.current !== status) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 350);
      prevStatusRef.current = status;
      return () => clearTimeout(t);
    }
  }, [status]);

  const setRef = (el) => {
    innerRef.current = el;
    if (typeof cardRef === "function") cardRef(el);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onCardClick(subject.id, innerRef.current);
  };

  const handleChevronClick = (e) => {
    e.stopPropagation();
    onChevronToggle(subject.id, innerRef.current);
  };

  const hasCursar  = isSelected && selectedSubject && (selectedSubject.correlatives ?? []).length > 0;
  const hasAprobar = isSelected && selectedSubject && (selectedSubject.correlativesParaFinal ?? []).length > 0;
  const filterOptions = isSelected
    ? ["T", hasCursar && "C", hasAprobar && "A"].filter(Boolean)
    : [];
  const showBadge = filterOptions.length > 1;

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    setBadgePressed(true);
    setTimeout(() => setBadgePressed(false), 120);
    const idx = filterOptions.indexOf(arrowFilter);
    const next = filterOptions[(idx + 1) % filterOptions.length];
    onArrowFilterChange(next);
  };

  const borderColor = highlighted
    ? (highlightType === "forFinal-regular"  ? "var(--hl-final-reg-border)"
      : highlightType === "forFinal-aprobada" ? "var(--hl-final-apr-border)"
      : highlightType === "regular"           ? "var(--hl-regular-border)" : "var(--hl-aprobada-border)")
    : st.border;

  const bgColor = highlighted
    ? (highlightType === "forFinal-regular"  ? "var(--hl-final-reg-bg)"
      : highlightType === "forFinal-aprobada" ? "var(--hl-final-apr-bg)"
      : highlightType === "regular"           ? "var(--hl-regular-bg)" : "var(--hl-aprobada-bg)")
    : st.bg;

  const classes = [
    "subject-card",
    isBloqueada ? "bloqueada" : "",
    isNew       ? "card-enter"        : "",
    isExiting   ? "card-exit"         : "",
    flashing    ? "card-status-flash" : "",
  ].filter(Boolean).join(" ");

  const outlineStyle = isSelected && !isBloqueada
    ? { outline: `2px solid ${borderColor}`, outlineOffset: "2px" }
    : { outline: "none" };

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={classes}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${subject.name}, ${st.label}${isBloqueada ? ", bloqueada" : ""}`}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        // Padding fijo siempre — no cambia al seleccionar
        padding: "0.65rem 0.8rem",
        opacity: dimmed ? 0.3 : 1,
        position: "relative",
        transition: "outline 0.12s, opacity 0.15s",
        ...outlineStyle,
      }}
      onClick={handleClick}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(e); } }}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      {isSelected && (
        <button
          onClick={handleChevronClick}
          className="chevron-btn"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label={menuOpen ? "Cerrar menú de opciones" : "Abrir menú de opciones"}
          title={menuOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: 0,
            width: "calc(0.8rem + 1px + 8px + 4px)", // padding-left + border + dot area
            background: "none", border: "none", cursor: "pointer",
            borderRadius: "8px 0 0 8px",
            transition: "background 0.15s",
            zIndex: 1,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>

        {/* Columna izquierda: tamaño fijo siempre.
            El espacio del chevron está reservado aunque no sea visible,
            para que el layout no salte al seleccionar.
            Botón y chevron visual son ambos absolute → no afectan el flujo. */}
        <div style={{
          position: "relative", flexShrink: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          minHeight: "25px",
        }}>
          <Dot status={status} dotRef={dotRef} />

          {/* Chevron visual: siempre en el DOM, invisible cuando no seleccionada */}
          <span
            style={{
              position: "absolute",
              top: "14px",
              left: "50%", transform: `translateX(-50%) rotate(${menuOpen ? 180 : 0}deg)`,
              fontSize: "0.9rem",
              lineHeight: 1,
              color: menuOpen ? borderColor : st.dot,
              transition: "transform 0.2s, color 0.15s, opacity 0.15s",
              opacity: isSelected ? 1 : 0,
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            ▾
          </span>


        </div>

        <span style={{ fontSize: "0.82rem", fontWeight: 400, color: st.color, lineHeight: 1.3, flex: 1, wordBreak: "break-word", overflowWrap: "break-word", minWidth: 0 }}>
          {subject.name}
        </span>

        {showBadge && (
          <button
            onClick={handleBadgeClick}
            style={{
              width: "20px", height: "20px", borderRadius: "4px",
              border: `1.5px solid ${BADGE_COLOR}`,
              background: badgePressed ? BADGE_COLOR : BADGE_COLOR + "18",
              color: badgePressed ? "var(--menu-bg)" : BADGE_COLOR,
              fontSize: "0.6rem", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0, lineHeight: 1,
              fontFamily: "'DM Mono', monospace", flexShrink: 0, marginLeft: "auto",
              transform: badgePressed ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.1s, background 0.1s, color 0.1s",
            }}
            title={arrowFilter === "T" ? "Todas las flechas" : arrowFilter === "C" ? "Solo para cursar" : "Solo para aprobar"}
          >
            {arrowFilter}
          </button>
        )}
      </div>

      {isBloqueada && (
        <div style={{ fontSize: "0.62rem", color: "var(--status-bloqueada-dot)", marginTop: 3, marginLeft: 12, fontStyle: "italic" }}>
          Correlativas pendientes
        </div>
      )}
    </div>
  );
}
