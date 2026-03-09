import SubjectCard from "./SubjectCard";

export default function YearColumn({
  year, selectedId, menuOpenId, highlightMap, dimmedIds, statusMap,
  onCardClick, onChevronToggle, onSetStatus, onDelete,
  registerRef, registerDotRef, arrowFilter, onArrowFilterChange, selectedSubject,
  newIds, exitingIds,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0, flex: 1 }}>
      <div style={{ paddingBottom: "0.5rem", borderBottom: "1px solid #D5D0C8", marginBottom: "0.25rem" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600 }}>{year.label}</div>
        <div style={{ fontSize: "0.65rem", color: "#bbb", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          {year.subjects.length} materia{year.subjects.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {year.subjects.length === 0 && (
          <div style={{ fontSize: "0.72rem", color: "#ccc", fontStyle: "italic", padding: "0.4rem 0" }}>Sin materias</div>
        )}
        {year.subjects.map(s => {
          const hlEntry = highlightMap[s.id];
          const status  = statusMap[s.id] ?? "disponible";
          return (
            <SubjectCard
              key={s.id}
              subject={s}
              status={status}
              highlighted={!!hlEntry}
              highlightType={hlEntry?.forFinal ? `forFinal-${hlEntry.type}` : hlEntry?.type}
              dimmed={dimmedIds.has(s.id)}
              isSelected={s.id === selectedId}
              menuOpen={s.id === menuOpenId}
              onCardClick={onCardClick}
              onChevronToggle={onChevronToggle}
              onSetStatus={onSetStatus}
              onDelete={(id) => onDelete(year.id, id)}
              cardRef={el => registerRef(s.id, el)}
              dotRef={el => registerDotRef(s.id, el)}
              arrowFilter={s.id === selectedId ? arrowFilter : undefined}
              onArrowFilterChange={s.id === selectedId ? onArrowFilterChange : undefined}
              selectedSubject={s.id === selectedId ? selectedSubject : undefined}
              isNew={newIds?.has(s.id)}
              isExiting={exitingIds?.has(s.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
