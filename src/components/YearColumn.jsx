import React, { useState, useRef, useCallback } from 'react';
import SubjectCard from "./SubjectCard";

const LONG_PRESS_MS = 250;

export default function YearColumn({
  year, selectedId, menuOpenId, highlightMap, dimmedIds, statusMap,
  onCardClick, onChevronToggle, onSetStatus, onDelete,
  registerRef, registerDotRef, arrowFilter, onArrowFilterChange, selectedSubject,
  newIds, exitingIds, onReorder,
}) {
  const [dragIndex, setDragIndex]   = useState(null);
  const [overIndex, setOverIndex]   = useState(null);
  const [dragging,  setDragging]    = useState(false);

  const longPressTimer  = useRef(null);
  const itemRefs        = useRef([]);
  const pressOrigin     = useRef(null);   // { x, y } al momento del mousedown/touchstart
  const MOVE_THRESHOLD  = 6;             // px de tolerancia antes de cancelar

  const startLongPress = useCallback((index, e) => {
    if (e.target.closest("button, a")) return;
    clearTimeout(longPressTimer.current);
    const pt = e.touches ? e.touches[0] : e;
    pressOrigin.current = { x: pt.clientX, y: pt.clientY };
    longPressTimer.current = setTimeout(() => {
      setDragIndex(index);
      setOverIndex(index);
      setDragging(true);
      if (navigator.vibrate) navigator.vibrate(30);
    }, LONG_PRESS_MS);
  }, []);

  const cancelLongPress = useCallback(() => {
    clearTimeout(longPressTimer.current);
    pressOrigin.current = null;
  }, []);

  // Cancela el long-press solo si el movimiento supera el threshold
  const checkCancelOnMove = useCallback((e) => {
    if (!pressOrigin.current) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = Math.abs(pt.clientX - pressOrigin.current.x);
    const dy = Math.abs(pt.clientY - pressOrigin.current.y);
    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
      cancelLongPress();
    }
  }, [cancelLongPress]);

  const onMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let found = null;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) found = i;
    });
    if (found !== null) setOverIndex(found);
  }, [dragging]);

  const onEnd = useCallback(() => {
    if (dragging && dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex);
    }
    setDragging(false);
    setDragIndex(null);
    setOverIndex(null);
  }, [dragging, dragIndex, overIndex, onReorder]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0, flex: 1 }}>
      <div style={{ paddingBottom: "0.5rem", borderBottom: "1px solid #D5D0C8", marginBottom: "0.25rem" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600 }}>{year.label}</div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          {year.subjects.length} materia{year.subjects.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.4rem", userSelect: dragging ? "none" : undefined, touchAction: dragging ? "none" : undefined }}
        onMouseMove={dragging ? onMove : checkCancelOnMove}
        onTouchMove={dragging ? onMove : checkCancelOnMove}
        onMouseUp={onEnd}
        onTouchEnd={onEnd}
        onMouseLeave={() => { if (dragging) onEnd(); }}
      >
        {year.subjects.length === 0 && (
          <div style={{ fontSize: "0.72rem", color: "var(--text-ghost)", fontStyle: "italic", padding: "0.4rem 0" }}>Sin materias</div>
        )}

        {year.subjects.map((s, index) => {
          const hlEntry   = highlightMap[s.id];
          const status    = statusMap[s.id] ?? "disponible";
          const isDragged = dragging && dragIndex === index;
          const isTarget  = dragging && overIndex === index && dragIndex !== index;

          return (
            <div
              key={s.id}
              ref={el => { itemRefs.current[index] = el; }}
              style={{
                transition: dragging ? "transform 0.15s, opacity 0.15s" : undefined,
                transform: isDragged
                  ? "scale(1.03) rotate(-1deg)"
                  : isTarget
                    ? (dragIndex < overIndex ? "translateY(8px)" : "translateY(-8px)")
                    : "none",
                opacity: isDragged ? 0.85 : 1,
                cursor: isDragged ? "grabbing" : "grab",
                zIndex: isDragged ? 10 : undefined,
                position: "relative",
                filter: isDragged ? "drop-shadow(0 8px 16px rgba(0,0,0,0.22))" : undefined,
              }}
              onMouseDown={e => startLongPress(index, e)}
              onTouchStart={e => startLongPress(index, e)}
              onMouseUp={cancelLongPress}
              onTouchEnd={() => { cancelLongPress(); onEnd(); }}
            >
              {isTarget && (
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  height: '2px',
                  background: 'var(--accent, #6B7A5E)',
                  borderRadius: '2px',
                  ...(dragIndex < overIndex ? { bottom: '-5px' } : { top: '-5px' }),
                  zIndex: 20,
                }} />
              )}
              <SubjectCard
                subject={s}
                status={status}
                highlighted={!!hlEntry}
                highlightType={hlEntry?.forFinal ? `forFinal-${hlEntry.type}` : hlEntry?.type}
                dimmed={dimmedIds.has(s.id)}
                isSelected={s.id === selectedId}
                menuOpen={s.id === menuOpenId}
                onCardClick={isDragged ? () => {} : onCardClick}
                onChevronToggle={isDragged ? () => {} : onChevronToggle}
                onSetStatus={onSetStatus}
                onDelete={(id) => onDelete(year.id, id)}
                cardRef={el => registerRef(s.id, el)}
                dotRef={el => registerDotRef(s.id, el)}
                arrowFilter={s.id === selectedId ? arrowFilter : undefined}
                onArrowFilterChange={s.id === selectedId ? onArrowFilterChange : undefined}
                selectedSubject={s.id === selectedId ? selectedSubject : undefined}
                isNew={newIds?.has(s.id)}
                isExiting={exitingIds?.has(s.id)}
                isDragged={isDragged}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
