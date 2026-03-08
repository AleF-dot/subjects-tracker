import { useRef } from "react";
import Dot from "./Dot";
import { STATUS } from "../utils/constants";

export default function SubjectCard({ subject, status, highlighted, highlightType, dimmed, isSelected, onCardClick, onOpenMenu, cardRef, arrowFilter, onArrowFilterChange, selectedSubject }) {
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
    if (isBloqueada) {
      if (willSelect) {
        onOpenMenu(subject.id, innerRef.current);
      } else {
        onOpenMenu(null, null);
      }
      return;
    }
    if (willSelect) {
      onOpenMenu(subject.id, innerRef.current);
    } else {
      onOpenMenu(null, null);
    }
  };

  const borderColor = highlighted
    ? (highlightType === "regular" ? "#F59E0B" : "#10B981")
    : st.border;
  const bgColor = highlighted
    ? (highlightType === "regular" ? "#FEF9EC" : "#ECFDF5")
    : st.bg;

  // Compute which filter options are available for this subject
  const hasCursar = isSelected && selectedSubject && (selectedSubject.correlatives ?? []).length > 0;
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

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={`subject-card${isBloqueada ? " bloqueada" : ""}`}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "0.65rem 0.8rem",
        opacity: dimmed ? 0.35 : 1,
        boxShadow: isSelected && !isBloqueada ? `0 0 0 2px ${borderColor}88` : "none",
        position: "relative",
      }}
      onClick={handleClick}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
        <Dot status={status} />
        <span style={{ fontSize: "0.82rem", fontWeight: highlighted ? 500 : 400, color: st.color, lineHeight: 1.3, flex: 1 }}>
          {subject.name}
        </span>
        {showBadge && (
          <button
            onClick={handleBadgeClick}
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: `1.5px solid ${borderColor}`,
              background: borderColor + "22",
              color: borderColor,
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
              transition: "all 0.12s",
            }}
            title={arrowFilter === "T" ? "Todas las flechas" : arrowFilter === "C" ? "Solo para cursar" : "Solo para aprobar"}
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