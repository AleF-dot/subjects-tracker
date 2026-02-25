import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { resolveArrowPoints } from "../utils/arrowHelpers";

/**
 * Manages arrow computation, animation key, and position recalculation
 * when the selected subject or layout changes.
 */
export function useArrows({ selectedId, correlatives, cardRefs, gridRef }) {
  const [arrows, setArrows] = useState([]);
  const [animKey, setAnimKey] = useState(0);
  const rafRef = useRef(null);

  // Store correlatives in a ref so callbacks don't need it as a dependency,
  // preventing the infinite loop: correlatives (new array ref) → useCallback
  // recreates → useLayoutEffect re-runs → setState → re-render → repeat.
  const correlativesRef = useRef(correlatives);
  useEffect(() => { correlativesRef.current = correlatives; }, [correlatives]);

  const computeArrows = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) { setArrows([]); return; }
    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) { setArrows([]); return; }
    const tRect = targetEl.getBoundingClientRect();

    const next = corrs.map(c => {
      const el = cardRefs.current[c.subjectId];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const { x1, y1, x2, y2, dir } = resolveArrowPoints(r, tRect);
      return { id: `${selectedId}-${c.subjectId}`, x1, y1, x2, y2, dir, type: c.type };
    }).filter(Boolean);

    setArrows(next);
  }, [selectedId, cardRefs]);

  const recomputePositions = useCallback(() => {
    const corrs = correlativesRef.current;
    if (!selectedId || corrs.length === 0) { setArrows([]); return; }
    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) return;
    const tRect = targetEl.getBoundingClientRect();

    setArrows(prev => prev.map(a => {
      const corrId = a.id.replace(`${selectedId}-`, "");
      const el = cardRefs.current[corrId];
      if (!el) return a;
      const r = el.getBoundingClientRect();
      const { x1, y1, x2, y2, dir } = resolveArrowPoints(r, tRect);
      return { ...a, x1, y1, x2, y2, dir };
    }));
  }, [selectedId, cardRefs]);

  // Initial draw when selection changes
  useLayoutEffect(() => {
    if (!selectedId) { setArrows([]); return; }
    rafRef.current = requestAnimationFrame(() => { computeArrows(); setAnimKey(k => k + 1); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId, computeArrows]);

  // Recompute on resize / scroll
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

  return { arrows, animKey };
}