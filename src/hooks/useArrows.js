import { useState, useRef, useCallback, useLayoutEffect, useEffect, useMemo } from "react";
import { resolveArrowPoints } from "../utils/arrowHelpers";

const EXIT_DURATION = 350;

export function useArrows({ selectedId, correlatives, cardRefs, dotRefs, gridRef, scrollContainerRef }) {
  const [arrows, setArrows]   = useState([]);
  const [exiting, setExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [clipRect, setClipRect] = useState(null); // rect del scroll container en viewport space
  const rafRef        = useRef(null);
  const exitTimerRef  = useRef(null);
  const filterTimerRef = useRef(null);

  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

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
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl);
      const uid = `${selectedId}-${c.subjectId}-${c.forFinal ? "final" : "cursar"}`;
      return { id: uid, corrId: c.subjectId, forFinal: c.forFinal ?? false, x1, y1, x2, y2, dir, rightEdge1, rightEdge2, type: c.type };
    }).filter(Boolean);

    setArrows(next);
  }, [selectedId, cardRefs, dotRefs]);

  // Effect principal: cambio de selección
  useLayoutEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selectedId;
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

    setExiting(false);
    updateClipRect();
    rafRef.current = requestAnimationFrame(() => {
      computeArrows();
      setAnimKey(k => k + 1);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Intencional: este effect maneja exclusivamente el cambio de selección.
  // computeArrows y updateClipRect son estables (useCallback); arrows se lee
  // directamente del estado en el momento de ejecución. Agregarlos causaría
  // re-animaciones no deseadas ante cambios de filtro (manejados en el effect secundario).
  useLayoutEffect(() => {
    if (!selectedId) return;
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
  // Intencional: computeArrows es estable (useCallback) y correlatives se lee via
  // correlativesRef para evitar que su referencia sea una dep que dispare este effect.
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
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl);
      return { ...a, x1, y1, x2, y2, dir, rightEdge1, rightEdge2 };
    }));
  }, [selectedId, cardRefs, dotRefs]);

  const updateClipRect = useCallback(() => {
    const el = scrollContainerRef?.current;
    if (!el) { setClipRect(null); return; }
    const r = el.getBoundingClientRect();
    setClipRect({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  }, [scrollContainerRef]);

  // ResizeObserver para grid
  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        recomputePositions();
        updateClipRect();
      });
    };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions, updateClipRect, gridRef]);

  // Scroll listeners — window, main, y el scroll container horizontal
  useEffect(() => {
    const fn = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        recomputePositions();
        updateClipRect();
      });
    };
    const scrollEl = scrollContainerRef?.current;
    window.addEventListener("scroll", fn, { passive: true });
    document.querySelector("main")?.addEventListener("scroll", fn, { passive: true });
    if (scrollEl) scrollEl.addEventListener("scroll", fn, { passive: true });
    return () => {
      window.removeEventListener("scroll", fn);
      document.querySelector("main")?.removeEventListener("scroll", fn);
      if (scrollEl) scrollEl.removeEventListener("scroll", fn);
    };
  }, [recomputePositions, updateClipRect, scrollContainerRef]);

  // Calcular clipRect inicial y cuando cambia selectedId
  useEffect(() => {
    updateClipRect();
  }, [updateClipRect, selectedId]);

  // ── Arco separador para flechas con trayecto similar ────────────────
  const arcedArrows = useMemo(() => {
    if (!arrows.length) return arrows;
    const ARC_STEP = 35;
    const groups = {};
    arrows.forEach((a, i) => {
      // Agrupa por origen y destino aproximados
      // Agrupar por destino + fila de origen (y1 similar) — solo las que realmente se pisan
      const key = `${Math.round(a.x2/20)},${Math.round(a.y2/20)},${Math.round(a.y1/20)},${a.dir}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(i);
    });
    const result = [...arrows];
    Object.values(groups).forEach(indices => {
      if (indices.length < 2) return;
      // La flecha más corta (origen más cercano) va recta.
      // Las más largas se arquean hacia arriba, en orden de distancia.
      indices.sort((a, b) => Math.abs(result[a].x2 - result[a].x1) - Math.abs(result[b].x2 - result[b].x1));
      indices.forEach((idx, pos) => {
        result[idx] = { ...result[idx], arcOffset: pos === 0 ? 0 : -(pos * ARC_STEP) };
      });
    });
    return result;
  }, [arrows]);

  return { arrows: arcedArrows, animKey, exiting, clipRect };
}
