import { useState, useRef, useCallback, useLayoutEffect, useEffect, useMemo } from "react";
import { resolveArrowPoints } from "../utils/arrowHelpers";

const EXIT_DURATION = 350;

export function useArrows({ selectedId, correlatives, cardRefs, dotRefs, gridRef, scrollContainerRef }) {
  const [arrows, setArrows]   = useState([]);
  const [exiting, setExiting] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const rafRef         = useRef(null);
  const exitTimerRef   = useRef(null);
  const filterTimerRef = useRef(null);
  const svgRef         = useRef(null);
  const arrowsRef      = useRef([]);

  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

  const prevSelectedRef  = useRef(selectedId);
  const filterKey = correlatives.map(c => `${c.subjectId}-${c.forFinal ? "f" : "c"}`).join(",");
  const prevFilterKeyRef = useRef(filterKey);

  const computeArrows = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) { setArrows([]); return; }
    const containerEl = scrollContainerRef?.current ?? null;
    const getPoint = (id) => dotRefs?.current?.[id] ?? cardRefs.current[id] ?? null;
    const targetEl = getPoint(selectedId);
    if (!targetEl) { setArrows([]); return; }
    const next = corrs.map(c => {
      const el = getPoint(c.subjectId);
      if (!el) return null;
      const { x1, y1, x2, y2, dir, rightEdge1, rightEdge2 } = resolveArrowPoints(el, targetEl, containerEl);
      const uid = `${selectedId}-${c.subjectId}-${c.forFinal ? "final" : "cursar"}`;
      return { id: uid, corrId: c.subjectId, forFinal: c.forFinal ?? false, x1, y1, x2, y2, dir, rightEdge1, rightEdge2, type: c.type };
    }).filter(Boolean);
    setArrows(next);
  }, [selectedId, cardRefs, dotRefs, scrollContainerRef]);

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

  // Recompute on resize only — scroll is handled natively by the browser
  const recomputePositions = useCallback(() => {
    if (!selectedId) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => { computeArrows(); });
  }, [selectedId, computeArrows]);

  useEffect(() => {
    const onResize = () => { recomputePositions(); };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions, gridRef]);

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

  return { arrows: arcedArrows, animKey, exiting, svgRef };
}
