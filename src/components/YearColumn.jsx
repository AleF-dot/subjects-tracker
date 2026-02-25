import SubjectCard from "./SubjectCard";

export default function YearColumn({ year, selectedId, highlightMap, dimmedIds, statusMap, onCardClick, onOpenMenu, onSetStatus, onDelete, registerRef }) {
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
              highlightType={hlEntry?.type}
              dimmed={dimmedIds.has(s.id)}
              isSelected={s.id === selectedId}
              onCardClick={onCardClick}
              onOpenMenu={onOpenMenu}
              onSetStatus={onSetStatus}
              onDelete={(id) => onDelete(year.id, id)}
              cardRef={el => registerRef(s.id, el)}
            />
          );
        })}
      </div>
    </div>
  );
}
