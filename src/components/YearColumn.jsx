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
  const pressOrigin     = useRef(null);
  const MOVE_THRESHOLD  = 6;

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

  const checkCancelOnMove = useCallback((e) => {
    if (!pressOrigin.current) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = Math.abs(pt.clientX - pressOrigin.current.x);
    const dy = Math.abs(pt.clientY - pressOrigin.current.y);
    if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) cancelLongPress();
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

  // Lista reordenada para el preview: muestra cómo quedaría si se suelta ahora.
  // La card draggeada aparece en la posición destino como "ghost" (semitransparente).
  // En su posición original se deja un hueco invisible para no colapsar el layout.
  const renderList = () => {
    if (!dragging || dragIndex === null || overIndex === null) {
      // Estado normal — sin drag
      return year.subjects.map((s, index) => {
        const hlEntry  = highlightMap[s.id];
        const status   = statusMap[s.id] ?? "disponible";
        return (
          <div
            key={s.id}
            ref={el => { itemRefs.current[index] = el; }}
            onMouseDown={e => startLongPress(index, e)}
            onTouchStart={e => startLongPress(index, e)}
            onMouseUp={cancelLongPress}
            onTouchEnd={() => { cancelLongPress(); onEnd(); }}
          >
            <SubjectCard
              subject={s} status={status}
              highlighted={!!hlEntry}
              highlightType={hlEntry?.forFinal ? `forFinal-${hlEntry.type}` : hlEntry?.type}
              dimmed={dimmedIds.has(s.id)}
              isSelected={s.id === selectedId} menuOpen={s.id === menuOpenId}
              onCardClick={onCardClick} onChevronToggle={onChevronToggle}
              onSetStatus={onSetStatus} onDelete={(id) => onDelete(year.id, id)}
              cardRef={el => registerRef(s.id, el)} dotRef={el => registerDotRef(s.id, el)}
              arrowFilter={s.id === selectedId ? arrowFilter : undefined}
              onArrowFilterChange={s.id === selectedId ? onArrowFilterChange : undefined}
              selectedSubject={s.id === selectedId ? selectedSubject : undefined}
              isNew={newIds?.has(s.id)} isExiting={exitingIds?.has(s.id)}
            />
          </div>
        );
      });
    }

    // Durante el drag: construir la lista reordenada
    const reordered = [...year.subjects];
    const [draggedSubject] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, draggedSubject);

    return reordered.map((s, previewIndex) => {
      const hlEntry     = highlightMap[s.id];
      const status      = statusMap[s.id] ?? "disponible";
      const isDragItem  = s === draggedSubject; // la card que se está moviendo
      const origIndex   = year.subjects.indexOf(s);
<<<<<<< HEAD
      // Ghost: la card draggeada en su posición destino (solo cuando se movió de lugar)
      const moved   = dragIndex !== overIndex;
      const isGhost = isDragItem && moved;  // siempre que se haya movido, aparece como ghost en destino

      // En la lista reordenada la card draggeada aparece UNA sola vez (en previewIndex === overIndex).
      // Cuando moved === false la lista no cambió, entonces isDragItem === true en su pos original → visible normal.
=======
      // Es la posición destino actual — mostrar como ghost
      const isGhost     = isDragItem && previewIndex === overIndex && dragIndex !== overIndex;

>>>>>>> 562e36f51c23817dee8d60073caa1ef0dfa691f0
      return (
        <div
          key={s.id}
          ref={el => { itemRefs.current[previewIndex] = el; }}
          style={{
            opacity: isGhost ? 0.4 : 1,
<<<<<<< HEAD
=======
            // La card original (antes del reorder) se oculta visualmente pero mantiene
            // su espacio, así el hover over los índices sigue funcionando
            visibility: isDragItem && !isGhost ? "hidden" : "visible",
>>>>>>> 562e36f51c23817dee8d60073caa1ef0dfa691f0
            transition: "opacity 0.1s",
          }}
          onMouseDown={e => startLongPress(origIndex, e)}
          onTouchStart={e => startLongPress(origIndex, e)}
          onMouseUp={cancelLongPress}
          onTouchEnd={() => { cancelLongPress(); onEnd(); }}
        >
          <SubjectCard
            subject={s} status={status}
            highlighted={!!hlEntry}
            highlightType={hlEntry?.forFinal ? `forFinal-${hlEntry.type}` : hlEntry?.type}
            dimmed={dimmedIds.has(s.id)}
            isSelected={s.id === selectedId} menuOpen={s.id === menuOpenId}
            onCardClick={() => {}} onChevronToggle={() => {}}
            onSetStatus={onSetStatus} onDelete={(id) => onDelete(year.id, id)}
            cardRef={el => registerRef(s.id, el)} dotRef={el => registerDotRef(s.id, el)}
            arrowFilter={s.id === selectedId ? arrowFilter : undefined}
            onArrowFilterChange={s.id === selectedId ? onArrowFilterChange : undefined}
            selectedSubject={s.id === selectedId ? selectedSubject : undefined}
            isNew={newIds?.has(s.id)} isExiting={exitingIds?.has(s.id)}
            isDragged={isGhost}
          />
        </div>
      );
    });
  };

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
        {renderList()}
      </div>
    </div>
  );
}
