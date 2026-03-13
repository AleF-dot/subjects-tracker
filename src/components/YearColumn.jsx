import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SubjectCard from "./SubjectCard";

const LONG_PRESS_MS = 200;

function CardWrapper({ isExiting, exitDelay, waveDelay, alreadyAnimated, onAnimated, children }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isExiting) {
      const frame = requestAnimationFrame(() => setCollapsed(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setCollapsed(false);
    }
  }, [isExiting]);

  if (isExiting) {
    const delay = `${exitDelay ?? 0}ms`;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateRows: collapsed ? "0fr" : "1fr",
          transition: `grid-template-rows 0.25s ease ${delay}`,
        }}
        onAnimationEnd={onAnimated}
      >
        <div style={{
          minHeight: 0,
          overflow: "hidden",
          opacity: collapsed ? 0 : 1,
          transition: `opacity 0.15s ease ${delay}`,
        }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        overflow: "visible",
        animation: alreadyAnimated ? "none" : "colFadeIn 0.18s ease both",
        animationDelay: alreadyAnimated ? undefined : waveDelay,
      }}
      onAnimationEnd={onAnimated}
    >
      {children}
    </div>
  );
}

export default function YearColumn({
  year, selectedId, menuOpenId, highlightMap, dimmedIds, statusMap,
  onCardClick, onChevronToggle, onSetStatus, onDelete,
  registerRef, registerDotRef, arrowFilter, onArrowFilterChange, selectedSubject,
  newIds, exitingIds, onReorder, onDragStart, colIndex,
}) {
  const [dragIndex,  setDragIndex]  = useState(null);
  const [overIndex,  setOverIndex]  = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const animatedIds = useRef(new Set());
  const [mousePos,   setMousePos]   = useState({ x: 0, y: 0 });
  const [cardSize,   setCardSize]   = useState({ w: 0, h: 0 });
  const [grabOffset, setGrabOffset] = useState({ x: 0, y: 0 });
  const [tilt,       setTilt]       = useState(0); // grados de inclinación según dirección
  const lastMouseY = useRef(null);

  const longPressTimer = useRef(null);
  const itemRefs       = useRef([]);
  const exitingHeightRef = useRef(0);
  const pressOrigin    = useRef(null);
  const MOVE_THRESHOLD = 6;

  const startLongPress = useCallback((index, e) => {
    if (e.target.closest("button, a")) return;
    clearTimeout(longPressTimer.current);
    const pt = e.touches ? e.touches[0] : e;
    pressOrigin.current = { x: pt.clientX, y: pt.clientY };
    longPressTimer.current = setTimeout(() => {
      const el = itemRefs.current[index];
      if (el) {
        const rect = el.getBoundingClientRect();
        setCardSize({ w: rect.width, h: rect.height });
        setGrabOffset({ x: pt.clientX - rect.left, y: pt.clientY - rect.top });
        setMousePos({ x: pt.clientX, y: pt.clientY });
      }
      setDragIndex(index);
      setOverIndex(index);
      setDragging(true);
      lastMouseY.current = null;
      onDragStart?.();
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

  const onEnd = useCallback(() => {
    if (dragging && dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onReorder(dragIndex, overIndex);
    }
    setDragging(false);
    setDragIndex(null);
    setOverIndex(null);
    setTilt(0);
    lastMouseY.current = null;
  }, [dragging, dragIndex, overIndex, onReorder]);

  // Listeners globales durante el drag:
  // - mousemove/touchmove: seguir al mouse en cualquier parte de la pantalla
  // - mouseup/touchend: terminar el drag
  // - touchmove con preventDefault: bloquear scroll en mobile
  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      // Calcular tilt según dirección vertical
      if (lastMouseY.current !== null) {
        const dy = pt.clientY - lastMouseY.current;
        if (Math.abs(dy) > 1) {
          setTilt(dy > 0 ? 2.5 : -2.5);
        } else {
          setTilt(0);
        }
      }
      lastMouseY.current = pt.clientY;
      setMousePos({ x: pt.clientX, y: pt.clientY });

      // Actualizar overIndex solo con elementos dentro de la columna
      const clientY = pt.clientY;
      let found = null;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) found = i;
      });
      if (found !== null) setOverIndex(found);
    };

    const handleUp = () => onEnd();

    const preventScroll = (e) => e.preventDefault();

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    document.addEventListener('touchmove', preventScroll, { passive: false });

    const prevTouchAction = document.body.style.touchAction;
    document.body.style.touchAction = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
      document.removeEventListener('touchmove', preventScroll);
      document.body.style.touchAction = prevTouchAction;
    };
  }, [dragging, onEnd]);

  const renderList = () => {
    if (!dragging || dragIndex === null || overIndex === null) {
      return year.subjects.map((s, index) => {
        const hlEntry = highlightMap[s.id];
        const status  = statusMap[s.id] ?? "disponible";
        const isExiting = exitingIds?.has(s.id);
        const alreadyAnimated = animatedIds.current.has(s.id);
        const waveDelay = `${index * 0.045 + (colIndex ?? 0) * 0.035}s`;
        const exitDelay = isExiting ? index * 35 : 0;
        return (
          <CardWrapper
            key={s.id}
            isExiting={isExiting}
            exitDelay={exitDelay}
            waveDelay={waveDelay}
            alreadyAnimated={alreadyAnimated}
            onAnimated={() => { animatedIds.current.add(s.id); }}
          >
            <div
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
              isNew={newIds?.has(s.id)} isExiting={false}
            />
            </div>
          </CardWrapper>
        );
      });
    }

    const reordered = [...year.subjects];
    const [draggedSubject] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, draggedSubject);
    const moved = dragIndex !== overIndex;

    return reordered.map((s, previewIndex) => {
      const hlEntry    = highlightMap[s.id];
      const status     = statusMap[s.id] ?? "disponible";
      const isDragItem = s === draggedSubject;
      const isGhost    = isDragItem && moved;
      const origIndex  = year.subjects.indexOf(s);

      return (
        <div
          key={s.id}
          ref={el => { itemRefs.current[previewIndex] = el; }}
          style={{
            opacity: isGhost ? 0.35 : 1,
            transition: "opacity 0.1s",
            pointerEvents: "none", // bloquear dropdown, flechas, etc. durante el drag
          }}
          onMouseDown={e => startLongPress(origIndex, e)}
          onTouchStart={e => startLongPress(origIndex, e)}
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
            isDragged={false}
          />
        </div>
      );
    });
  };

  const draggedSubject = dragging && dragIndex !== null ? year.subjects[dragIndex] : null;
  const floatingCard = draggedSubject
    ? createPortal(
        <div
          className="drag-floating"
          style={{
            position: "fixed",
            left: mousePos.x - grabOffset.x,
            top:  mousePos.y - grabOffset.y,
            width: cardSize.w,
            pointerEvents: "none",
            zIndex: 9999,
            transform: `scale(1.04) rotate(${tilt}deg)`,
            transformOrigin: `${grabOffset.x}px ${grabOffset.y}px`,
            filter: "drop-shadow(0 10px 28px rgba(0,0,0,0.28))",
            outline: "2px solid var(--border)",
            outlineOffset: "2px",
            borderRadius: "10px",
          }}>
          <SubjectCard
            subject={draggedSubject}
            status={statusMap[draggedSubject.id] ?? "disponible"}
            highlighted={!!highlightMap[draggedSubject.id]}
            highlightType={
              highlightMap[draggedSubject.id]?.forFinal
                ? `forFinal-${highlightMap[draggedSubject.id].type}`
                : highlightMap[draggedSubject.id]?.type
            }
            dimmed={false} isSelected={false} menuOpen={false}
            onCardClick={() => {}} onChevronToggle={() => {}}
            onSetStatus={() => {}} onDelete={() => {}}
            cardRef={null} dotRef={null} isDragged={false}
          />
        </div>,
        document.body
      )
    : null;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0, flex: 1,
    }}>
      <div style={{
        paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "0.25rem",
        animation: "colFadeIn 0.18s ease both",
        animationDelay: `${(colIndex ?? 0) * 0.05}s`,
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600 }}>{year.label}</div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-faint)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          {year.subjects.length} materia{year.subjects.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.4rem", userSelect: dragging ? "none" : undefined }}
        onMouseMove={!dragging ? checkCancelOnMove : undefined}
        onTouchMove={!dragging ? checkCancelOnMove : undefined}
      >
        {year.subjects.length === 0 && (
          <div style={{ fontSize: "0.72rem", color: "var(--text-ghost)", fontStyle: "italic", padding: "0.4rem 0" }}>Sin materias</div>
        )}
        {renderList()}
      </div>

      {floatingCard}
    </div>
  );
}
