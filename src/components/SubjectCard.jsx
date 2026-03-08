import { useRef, useState, useEffect } from "react";
import Dot from "./Dot";
import { STATUS } from "../utils/constants";

const BADGE_COLOR = "#C1694F";

export default function SubjectCard({
  subject, status, highlighted, highlightType, dimmed, isSelected,
  onCardClick, onOpenMenu, cardRef, arrowFilter, onArrowFilterChange,
  selectedSubject, isNew, isExiting,
}) {
  const innerRef = useRef(null);
  const [badgePressed, setBadgePressed] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const prevStatusRef = useRef(status);
  const prevSelectedRef = useRef(isSelected);

  const st = STATUS[status];
  const isBloqueada = status === "bloqueada";

  // Pulso SOLO al transición false→true de isSelected, no en re-renders
  useEffect(() => {
    const wasSelected = prevSelectedRef.current;
    prevSelectedRef.current = isSelected;
    if (!wasSelected && isSelected) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 220);
      return () => clearTimeout(t);
    }
  }, [isSelected]);

  // Flash al cambiar status
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
    const willSelect = !isSelected;
    onCardClick(subject.id);
    if (willSelect) {
      onOpenMenu(subject.id, innerRef.current);
    } else {
      onOpenMenu(null, null);
    }
  };

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    setBadgePressed(true);
    setTimeout(() => setBadgePressed(false), 120);
    const idx = filterOptions.indexOf(arrowFilter);
    const next = filterOptions[(idx + 1) % filterOptions.length];
    onArrowFilterChange(next);
  };

  const borderColor = highlighted
    ? (highlightType === "forFinal-regular"
        ? "#3B82F6"
        : highlightType === "forFinal-aprobada"
        ? "#8B5CF6"
        : (highlightType === "regular" ? "#F59E0B" : "#10B981"))
    : st.border;

  const bgColor = highlighted
    ? (highlightType === "forFinal-regular"
        ? "#DBEAFE"
        : highlightType === "forFinal-aprobada"
        ? "#EDE9FE"
        : (highlightType === "regular" ? "#FDE68A" : "#A7F3D0"))
    : st.bg;

  const hasCursar  = isSelected && selectedSubject && (selectedSubject.correlatives ?? []).length > 0;
  const hasAprobar = isSelected && selectedSubject && (selectedSubject.correlativesParaFinal ?? []).length > 0;
  const filterOptions = isSelected
    ? ["T", hasCursar && "C", hasAprobar && "A"].filter(Boolean)
    : [];
  const showBadge = filterOptions.length > 1;

  const classes = [
    "subject-card",
    isBloqueada ? "bloqueada" : "",
    isNew     ? "card-enter"       : "",
    isExiting ? "card-exit"        : "",
    flashing  ? "card-status-flash": "",
  ].filter(Boolean).join(" ");

  // outline no se corta por overflow de parents — reemplaza box-shadow para el glow
  // El pulso también usa outline via animación CSS
  const outlineStyle = isSelected && !isBloqueada && pulsing
    ? { outline: `3px solid ${borderColor}`, outlineOffset: "2px" }
    : isSelected && !isBloqueada
    ? { outline: `2px solid ${borderColor}`, outlineOffset: "1px" }
    : { outline: "none" };

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={classes}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "0.65rem 0.8rem",
        opacity: dimmed ? 0.3 : 1,
        position: "relative",
        transition: "outline 0.12s, opacity 0.15s",
        ...outlineStyle,
      }}
      onClick={handleClick}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
        <Dot status={status} />
        <span style={{
          fontSize: "0.82rem",
          fontWeight: 400,
          color: st.color,
          lineHeight: 1.3,
          flex: 1,
        }}>
          {subject.name}
        </span>
        {showBadge && (
          <button
            onClick={handleBadgeClick}
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: `1.5px solid ${BADGE_COLOR}`,
              background: badgePressed ? BADGE_COLOR : BADGE_COLOR + "18",
              color: badgePressed ? "#fff" : BADGE_COLOR,
              fontSize: "0.6rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              lineHeight: 1,
              fontFamily: "'DM Mono', monospace",
              flexShrink: 0,
              marginLeft: "auto",
              transform: badgePressed ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.1s, background 0.1s, color 0.1s",
            }}
            title={
              arrowFilter === "T" ? "Todas las flechas" :
              arrowFilter === "C" ? "Solo para cursar" :
              "Solo para rendir final"
            }
          >
            {arrowFilter}
          </button>
        )}
      </div>
      {isBloqueada && (
        <div style={{ fontSize: "0.62rem", color: "#DC2626", marginTop: 3, marginLeft: 11, fontStyle: "italic" }}>
          Correlativas pendientes
        </div>
      )}
    </div>
  );
}
