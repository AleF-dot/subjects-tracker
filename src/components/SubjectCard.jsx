import { useRef } from "react";
import Dot from "./Dot";
import { STATUS } from "../utils/constants";

// Paleta de colores por año para dar identidad visual a cada card
const YEAR_ACCENT_COLORS = [
  { strip: "#6366F1", stripBg: "rgba(99,102,241,0.06)" },   // 1er año – índigo
  { strip: "#0EA5E9", stripBg: "rgba(14,165,233,0.06)" },   // 2do año – sky
  { strip: "#10B981", stripBg: "rgba(16,185,129,0.06)" },   // 3er año – emerald
  { strip: "#F59E0B", stripBg: "rgba(245,158,11,0.06)" },   // 4to año – amber
  { strip: "#EC4899", stripBg: "rgba(236,72,153,0.06)" },   // 5to año – pink
];

export default function SubjectCard({
  subject, status, highlighted, highlightType, dimmed, isSelected,
  onCardClick, onOpenMenu, cardRef, arrowFilter, onArrowFilterChange,
  selectedSubject, yearIndex,
}) {
  const innerRef = useRef(null);
  const st = STATUS[status];
  const isBloqueada = status === "bloqueada";

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

  const borderColor = highlighted
    ? (highlightType === "forFinal-regular"
        ? "#3B82F6"
        : highlightType === "forFinal-aprobada"
        ? "#8B5CF6"
        : (highlightType === "regular" ? "#F59E0B" : "#10B981"))
    : st.border;

  const bgColor = highlighted
    ? (highlightType === "forFinal-regular"
        ? "#EFF6FF"
        : highlightType === "forFinal-aprobada"
        ? "#F5F3FF"
        : (highlightType === "regular" ? "#FEF9EC" : "#ECFDF5"))
    : st.bg;

  // Año accent — solo cuando no está highlighted ni bloqueada
  const accent = (!highlighted && !isBloqueada && yearIndex !== undefined)
    ? YEAR_ACCENT_COLORS[yearIndex % YEAR_ACCENT_COLORS.length]
    : null;

  // Badge T/C/A
  const hasCursar  = isSelected && selectedSubject && (selectedSubject.correlatives ?? []).length > 0;
  const hasAprobar = isSelected && selectedSubject && (selectedSubject.correlativesParaFinal ?? []).length > 0;
  const filterOptions = isSelected
    ? ["T", hasCursar && "C", hasAprobar && "A"].filter(Boolean)
    : [];
  const showBadge = filterOptions.length > 1;

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    const idx = filterOptions.indexOf(arrowFilter);
    const next = filterOptions[(idx + 1) % filterOptions.length];
    onArrowFilterChange(next);
  };

  // Color del badge refleja el filtro activo
  const badgeColor =
    arrowFilter === "C" ? "#F59E0B" :
    arrowFilter === "A" ? "#8B5CF6" :
    borderColor;

  // Borde izquierdo de color de año (3px) o borde normal (1px)
  const borderLeft = accent
    ? `3px solid ${accent.strip}`
    : `1px solid ${borderColor}`;

  const background = accent && !isSelected
    ? `linear-gradient(to right, ${accent.stripBg} 0%, ${bgColor} 45%)`
    : bgColor;

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={`subject-card${isBloqueada ? " bloqueada" : ""}`}
      style={{
        background,
        border: `1px solid ${borderColor}`,
        borderLeft,
        borderRadius: "8px",
        padding: "0.65rem 0.8rem",
        opacity: dimmed ? 0.35 : 1,
        boxShadow: isSelected && !isBloqueada ? `0 0 0 2px ${borderColor}88` : "none",
        position: "relative",
        transition: "opacity 0.15s, box-shadow 0.15s",
      }}
      onClick={handleClick}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
        <Dot status={status} />
        <span style={{
          fontSize: "0.82rem",
          fontWeight: highlighted ? 500 : 400,
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
              border: `1.5px solid ${badgeColor}`,
              background: badgeColor + "22",
              color: badgeColor,
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
              transition: "border-color 0.12s, color 0.12s, background 0.12s",
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
        <div style={{ fontSize: "0.62rem", color: "#EF4444", marginTop: 3, marginLeft: 11, fontStyle: "italic" }}>
          Correlativas pendientes
        </div>
      )}
    </div>
  );
}
