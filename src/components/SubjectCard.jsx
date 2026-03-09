import { useRef, useState, useEffect } from "react";
import Dot from "./Dot";
import { STATUS } from "../utils/constants";

const BADGE_COLOR = "#C1694F";

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
    ? (highlightType === "forFinal-regular"  ? "#3B82F6"
      : highlightType === "forFinal-aprobada" ? "#8B5CF6"
      : highlightType === "regular"           ? "#F59E0B" : "#10B981")
    : st.border;

  const bgColor = highlighted
    ? (highlightType === "forFinal-regular"  ? "#DBEAFE"
      : highlightType === "forFinal-aprobada" ? "#EDE9FE"
      : highlightType === "regular"           ? "#FDE68A" : "#A7F3D0")
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

  // La card tiene padding 0.65rem arriba/abajo y 0.8rem izquierda/derecha.
  // Cuando está seleccionada, convertimos la columna izquierda entera en el
  // botón del chevron: padding negativo la extiende hasta los bordes de la card.
  const CARD_PAD_V = "0.65rem";
  const CARD_PAD_L = "0.8rem";

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={classes}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: `${CARD_PAD_V} 0.8rem`,
        opacity: dimmed ? 0.3 : 1,
        position: "relative",
        transition: "outline 0.12s, opacity 0.15s",
        // Quitamos el padding izquierdo de la card; lo absorbe el botón chevron
        // (o el div dummy cuando no está seleccionada)
        paddingLeft: 0,
        ...outlineStyle,
      }}
      onClick={handleClick}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>

        {isSelected ? (
          /* Columna izquierda como botón: ocupa toda la altura de la card */
          <button
            onClick={handleChevronClick}
            title={menuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              // Padding que reproduce el padding izquierdo de la card
              // y se extiende verticalmente hasta sus bordes
              padding: `${CARD_PAD_V} 6px ${CARD_PAD_V} ${CARD_PAD_L}`,
              margin: `-${CARD_PAD_V} 0 -${CARD_PAD_V} 0`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-start",
              flexShrink: 0, gap: "4px",
              color: menuOpen ? borderColor : st.dot,
              transition: "color 0.15s",
              // Sin border-radius en el lado derecho para que no se vea raro
              borderRadius: "8px 0 0 8px",
            }}
          >
            <Dot status={status} dotRef={dotRef} />
            <span style={{
              fontSize: "0.9rem",
              lineHeight: 1,
              display: "block",
              transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}>
              ▾
            </span>
          </button>
        ) : (
          /* Columna izquierda pasiva: mantiene el mismo padding que la card tenía */
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            flexShrink: 0, paddingLeft: CARD_PAD_L, paddingTop: "0.22rem",
          }}>
            <Dot status={status} dotRef={dotRef} />
          </div>
        )}

        <span style={{ fontSize: "0.82rem", fontWeight: 400, color: st.color, lineHeight: 1.3, flex: 1, paddingTop: "0.15rem" }}>
          {subject.name}
        </span>

        {showBadge && (
          <button
            onClick={handleBadgeClick}
            style={{
              width: "20px", height: "20px", borderRadius: "4px",
              border: `1.5px solid ${BADGE_COLOR}`,
              background: badgePressed ? BADGE_COLOR : BADGE_COLOR + "18",
              color: badgePressed ? "#fff" : BADGE_COLOR,
              fontSize: "0.6rem", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0, lineHeight: 1,
              fontFamily: "'DM Mono', monospace", flexShrink: 0, marginLeft: "auto",
              transform: badgePressed ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.1s, background 0.1s, color 0.1s",
            }}
            title={arrowFilter === "T" ? "Todas las flechas" : arrowFilter === "C" ? "Solo para cursar" : "Solo para rendir final"}
          >
            {arrowFilter}
          </button>
        )}
      </div>

      {isBloqueada && (
        <div style={{ fontSize: "0.62rem", color: "#DC2626", marginTop: 3, marginLeft: `calc(${CARD_PAD_L} + 12px)`, fontStyle: "italic" }}>
          Correlativas pendientes
        </div>
      )}
    </div>
  );
}
