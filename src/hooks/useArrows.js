import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { resolveArrowPoints } from "../utils/arrowHelpers";

const EXIT_DURATION = 350;

export function useArrows({ selectedId, correlatives, cardRefs, dotRefs, gridRef, scrollContainerRef }) {
  const [arrows, setArrows]   = useState([]);
  const [exiting, setExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const rafRef        = useRef(null);
  const exitTimerRef  = useRef(null);
  const filterTimerRef = useRef(null);

  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

  // Trackeamos el selectedId anterior para distinguir "cambio de selección"
  // de "cambio de filtro dentro de la misma selección"
  const prevSelectedRef = useRef(selectedId);

  const filterKey = correlatives.map(c => `${c.subjectId}-${c.forFinal ? "f" : "c"}`).join(",");
  const prevFilterKeyRef = useRef(filterKey);

  const computeArrows = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) { setArrows([]); return; }

    const getPoint = (id) => dotRefs?.current?.[id] ?? cardRefs.current[id] ?? null;
    const targetEl = getPoint(selectedId);
    if (!targetEl) { setArrows([]); return; }

    const next = corrs.map(c => {
      const el = getPoint(c.subjectId);
      if (!el) return null;
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl, c.offsetSide ?? 0, scrollContainerRef?.current);
      const uid = `${selectedId}-${c.subjectId}-${c.forFinal ? "final" : "cursar"}`;
      return { id: uid, corrId: c.subjectId, forFinal: c.forFinal ?? false, x1, y1, x2, y2, dir, rightEdge1, rightEdge2, type: c.type };
    }).filter(Boolean);

    setArrows(next);
  }, [selectedId, cardRefs, dotRefs]);

  // Effect principal: cambio de selección
  useLayoutEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selectedId;

    // Siempre actualizar prevFilterKey cuando cambia la selección,
    // para que el effect de filterKey no se dispare también.
    prevFilterKeyRef.current = filterKey;

    clearTimeout(exitTimerRef.current);
    clearTimeout(filterTimerRef.current);
    cancelAnimationFrame(rafRef.current);

    if (!selectedId) {
      if (prev && arrows.length > 0) {
        setExiting(true);
        exitTimerRef.current = setTimeout(() => {
          setArrows([]);
          setExiting(false);
        }, EXIT_DURATION);
      }
      return;
    }

    // Nueva selección: dibujar
    setExiting(false);
    rafRef.current = requestAnimationFrame(() => {
      computeArrows();
      setAnimKey(k => k + 1);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect secundario: cambio de filtro DENTRO de la misma selección
  useLayoutEffect(() => {
    if (!selectedId) return;
    // Si el selectedId también cambió en este render, el effect de arriba
    // ya actualizó prevFilterKeyRef — acá va a ver que no cambió y no hace nada.
    if (filterKey === prevFilterKeyRef.current) return;
    prevFilterKeyRef.current = filterKey;
    correlativesRef.current = correlatives;

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
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl, corr?.offsetSide ?? 0, scrollContainerRef?.current);
      return { ...a, x1, y1, x2, y2, dir, rightEdge1, rightEdge2 };
    }));
  }, [selectedId, cardRefs, dotRefs]);

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
    const scrollEl = scrollContainerRef?.current;
    if (scrollEl) scrollEl.addEventListener("scroll", fn, { passive: true });
    return () => {
      window.removeEventListener("scroll", fn);
      document.querySelector("main")?.removeEventListener("scroll", fn);
      if (scrollEl) scrollEl.removeEventListener("scroll", fn);
    };
  }, [recomputePositions, scrollContainerRef]);

  return { arrows, animKey, exiting };
}
