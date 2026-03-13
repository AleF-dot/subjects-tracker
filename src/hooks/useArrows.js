import { useState, useRef, useCallback, useLayoutEffect, useEffect, useMemo } from "react";
import { resolveArrowPoints, buildPath, estimateLen } from "../utils/arrowHelpers";

const EXIT_DURATION = 350;

export function useArrows({ selectedId, correlatives, cardRefs, dotRefs, gridRef, scrollContainerRef }) {
  const [arrows, setArrows]   = useState([]);
  const [exiting, setExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [clipRect, setClipRect] = useState(null);
  const rafRef         = useRef(null);
  const exitTimerRef   = useRef(null);
  const filterTimerRef = useRef(null);
  const svgRef         = useRef(null); // ref al SVG — para mutación directa en scroll
  const arrowsRef      = useRef([]);   // arrows actuales con arcOffset incluido

  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

  const prevSelectedRef  = useRef(selectedId);
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
        exitTimerRef.current = setTimeout(() => { setArrows([]); setExiting(false); }, EXIT_DURATION);
      }
      return;
    }
    setExiting(false);
    updateClipRect();
    rafRef.current = requestAnimationFrame(() => { computeArrows(); setAnimKey(k => k + 1); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [filterKey, selectedId]);

  // Mutación directa del SVG durante scroll — sin pasar por React state
  const mutateSvgPaths = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || !selectedId) return;

    const currentArrows = arrowsRef.current;
    if (!currentArrows.length) return;

    const getPoint = (id) => dotRefs?.current?.[id] ?? cardRefs.current[id] ?? null;
    const targetEl = getPoint(selectedId);
    if (!targetEl) return;

    // Actualizar clipRect del clipPath directamente
    const scrollEl = scrollContainerRef?.current;
    if (scrollEl) {
      const r = scrollEl.getBoundingClientRect();
      const clipRectEl = svg.querySelector("#arrow-clip rect");
      if (clipRectEl) {
        clipRectEl.setAttribute("x", r.left);
        clipRectEl.setAttribute("y", r.top);
        clipRectEl.setAttribute("width", r.right - r.left);
        clipRectEl.setAttribute("height", r.bottom - r.top);
      }
    }

    // Actualizar cada path usando los arrows actuales (con arcOffset correcto)
    currentArrows.forEach(a => {
      const el = getPoint(a.corrId);
      if (!el) return;
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl);
      const arcOffset = a.arcOffset ?? 0;
      const pathD = buildPath(x1, y1, x2, y2, dir, rightEdge1, rightEdge2, arcOffset);
      const len   = estimateLen(x1, y1, x2, y2, dir);

      svg.querySelectorAll(`[data-arrow-id="${a.id}"]`).forEach(path => {
        path.setAttribute("d", pathD);
        if (path.hasAttribute("stroke-dasharray") && path.getAttribute("stroke-dasharray") !== "5 4") {
          path.setAttribute("stroke-dasharray", len);
          path.setAttribute("stroke-dashoffset", "0");
        }
      });
    });
  }, [selectedId, cardRefs, dotRefs, scrollContainerRef]);

  const updateClipRect = useCallback(() => {
    const el = scrollContainerRef?.current;
    if (!el) { setClipRect(null); return; }
    const r = el.getBoundingClientRect();
    setClipRect({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  }, [scrollContainerRef]);

  const recomputePositions = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) return;
    const getPoint = (id) => dotRefs?.current?.[id] ?? cardRefs.current[id] ?? null;
    const targetEl = getPoint(selectedId);
    if (!targetEl) return;
    setArrows(prev => prev.map(a => {
      const el = getPoint(a.corrId);
      if (!el) return a;
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl);
      return { ...a, x1, y1, x2, y2, dir, rightEdge1, rightEdge2 };
    }));
  }, [selectedId, cardRefs, dotRefs]);

  // Scroll: mutación directa del DOM (sin lag de React) + recompute para sincronizar state
  useEffect(() => {
    const onScroll = () => {
      // Mutación directa — sin pasar por React, sin lag
      mutateSvgPaths();
    };
    const onScrollEnd = () => {
      // Al terminar el scroll, sincronizar el state de React
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        recomputePositions();
        updateClipRect();
      });
    };

    const scrollEl = scrollContainerRef?.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    document.querySelector("main")?.addEventListener("scroll", onScroll, { passive: true });
    if (scrollEl) scrollEl.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    if (scrollEl) scrollEl.addEventListener("scrollend", onScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.querySelector("main")?.removeEventListener("scroll", onScroll);
      if (scrollEl) scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      if (scrollEl) scrollEl.removeEventListener("scrollend", onScrollEnd);
    };
  }, [mutateSvgPaths, recomputePositions, updateClipRect, scrollContainerRef]);

  // ResizeObserver
  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => { recomputePositions(); updateClipRect(); });
    };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions, updateClipRect, gridRef]);

  useEffect(() => { updateClipRect(); }, [updateClipRect, selectedId]);

  const arcedArrows = useMemo(() => {
    if (!arrows.length) return arrows;
    const ARC_STEP = 35;
    const groups = {};
    arrows.forEach((a, i) => {
      const key = `${Math.round(a.x2/20)},${Math.round(a.y2/20)},${Math.round(a.y1/20)},${a.dir}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(i);
    });
    const result = [...arrows];
    Object.values(groups).forEach(indices => {
      if (indices.length < 2) return;
      indices.sort((a, b) => Math.abs(result[a].x2 - result[a].x1) - Math.abs(result[b].x2 - result[b].x1));
      indices.forEach((idx, pos) => {
        result[idx] = { ...result[idx], arcOffset: pos === 0 ? 0 : -(pos * ARC_STEP) };
      });
    });
    return result;
  }, [arrows]);

  arrowsRef.current = arcedArrows;

  return { arrows: arcedArrows, animKey, exiting, clipRect, svgRef };
}
