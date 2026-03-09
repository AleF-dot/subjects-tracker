import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { resolveArrowPoints } from "../utils/arrowHelpers";

const EXIT_DURATION = 350; // ms — debe coincidir con la animación de salida

export function useArrows({ selectedId, correlatives, cardRefs, dotRefs, gridRef }) {
  const [arrows, setArrows] = useState([]);
  const [exiting, setExiting] = useState(false); // true durante la animación de salida
  const [animKey, setAnimKey] = useState(0);
  const rafRef = useRef(null);
  const exitTimerRef = useRef(null);

  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

  const filterKey = correlatives.map(c => `${c.subjectId}-${c.forFinal ? "f" : "c"}`).join(",");
  const prevFilterKeyRef = useRef(filterKey);
  const filterTimerRef = useRef(null);
  useLayoutEffect(() => {
    if (!selectedId) return;
    if (filterKey === prevFilterKeyRef.current) return;
    prevFilterKeyRef.current = filterKey;
    correlativesRef.current = correlatives;
    // Animar salida de las flechas actuales, luego redibujar con el nuevo filtro
    clearTimeout(filterTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    setExiting(true);
    filterTimerRef.current = setTimeout(() => {
      setExiting(false);
      setAnimKey(k => k + 1);
      rafRef.current = requestAnimationFrame(() => { computeArrows(); });
    }, EXIT_DURATION);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, selectedId]);

  const computeArrows = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) { setArrows([]); return; }

    const getPoint = (id) => {
      const dotEl = dotRefs?.current?.[id];
      if (dotEl) return dotEl;
      return cardRefs.current[id] ?? null;
    };

    const targetEl = getPoint(selectedId);
    if (!targetEl) { setArrows([]); return; }

    const next = corrs.map(c => {
      const el = getPoint(c.subjectId);
      if (!el) return null;
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl, c.offsetSide ?? 0);
      const uid = `${selectedId}-${c.subjectId}-${c.forFinal ? "final" : "cursar"}`;
      return { id: uid, corrId: c.subjectId, forFinal: c.forFinal ?? false, x1, y1, x2, y2, dir, rightEdge1, rightEdge2, type: c.type };
    }).filter(Boolean);

    setArrows(next);
  }, [selectedId, cardRefs, dotRefs]);

  const recomputePositions = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) return;

    const getPoint = (id) => dotRefs?.current?.[id] ?? cardRefs.current[id] ?? null;
    const targetEl = getPoint(selectedId);
    if (!targetEl) return;

    setArrows(prev => prev.map(a => {
      const el = getPoint(a.corrId);
      if (!el) return a;
      const corr = corrs.find(c => c.subjectId === a.corrId && (c.forFinal ?? false) === a.forFinal);
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl, corr?.offsetSide ?? 0);
      return { ...a, x1, y1, x2, y2, dir, rightEdge1, rightEdge2 };
    }));
  }, [selectedId, cardRefs, dotRefs]);

  // Cuando selectedId cambia: si había flechas y ahora no hay selección → animar salida
  const prevSelectedRef = useRef(selectedId);
  useLayoutEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selectedId;

    clearTimeout(exitTimerRef.current);

    if (!selectedId) {
      if (prev && arrows.length > 0) {
        // Hay flechas visibles → animar salida antes de limpiar
        setExiting(true);
        exitTimerRef.current = setTimeout(() => {
          setArrows([]);
          setExiting(false);
        }, EXIT_DURATION);
      }
      return;
    }

    // Nueva selección: cancelar salida pendiente y dibujar
    setExiting(false);
    rafRef.current = requestAnimationFrame(() => { computeArrows(); setAnimKey(k => k + 1); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recomputePositions);
    };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions, gridRef]);

  useEffect(() => {
    const fn = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recomputePositions);
    };
    window.addEventListener("scroll", fn, { passive: true });
    document.querySelector("main")?.addEventListener("scroll", fn, { passive: true });
    return () => {
      window.removeEventListener("scroll", fn);
      document.querySelector("main")?.removeEventListener("scroll", fn);
    };
  }, [recomputePositions]);

  return { arrows, animKey, exiting };
}
