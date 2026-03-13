import React from 'react';
export const ARROW_OFFSET = 7;
const DOT_RADIUS = 4;
const MARKER_LEN = 7;

export function buildPath(x1, y1, x2, y2, dir, rightEdge1, rightEdge2, arcOffset = 0) {
  const ox = rightEdge1 ?? x1;
  const ix = rightEdge2 ?? x2;
  const ao = arcOffset;

  if (dir === "same") {
    const bulge = Math.max(80, Math.abs(y2 - y1) * 0.6 + 60);
    const cx = Math.max(ox, ix) + bulge;
    return `M ${ox} ${y1} C ${cx} ${y1 + ao}, ${cx} ${y2 + ao}, ${ix} ${y2}`;
  }

  if (dir === "ltr") {
    const span = Math.abs(x2 - x1);
    const ctrl = Math.max(span * 0.35, 50);
    // Con arcOffset: ctrl points desplazados verticalmente para un arco suave
    return `M ${ox} ${y1} C ${ox + ctrl} ${y1 + ao}, ${ix - ctrl} ${y2 + ao}, ${ix} ${y2}`;
  }

  if (dir === "rtl") {
    const span = Math.abs(x2 - x1);
    const bulge = Math.max(60, span * 0.25 + 40);
    const cx = Math.max(ox, ix) + bulge;
    return `M ${ox} ${y1} C ${cx} ${y1 + ao}, ${cx} ${y2 + ao}, ${ix} ${y2}`;
  }

  return `M ${ox} ${y1} L ${ix} ${y2}`;
}

export function estimateLen(x1, y1, x2, y2, dir) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let base = Math.sqrt(dx * dx + dy * dy);
  if (dir === "rtl")  base = base * 1.6 + 80;
  if (dir === "same") base = base * 1.4 + 100;
  if (dir === "ltr")  base = base * 1.1 + 40;
  return Math.max(20, base);
}

function elInfo(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, rx: r.right };
}

export function resolveArrowPoints(corrDotEl, targetDotEl, containerEl) {
  const c = elInfo(corrDotEl);
  const t = elInfo(targetDotEl);

  // Si hay container, convertir a coordenadas relativas al container
  // para que el SVG pueda vivir en position:absolute y scrollear nativo
  let ox = 0, oy = 0;
  if (containerEl) {
    const cr = containerEl.getBoundingClientRect();
    ox = cr.left - containerEl.scrollLeft;
    oy = cr.top - containerEl.scrollTop;
    // Ajustar también por el scroll del window
    oy += window.scrollY;
  }

  const cx = c.x - (containerEl ? ox : 0);
  const cy = c.y - (containerEl ? oy : 0);
  const tx = t.x - (containerEl ? ox : 0);
  const ty = t.y - (containerEl ? oy : 0);
  const crx = c.rx - (containerEl ? ox : 0);
  const trx = t.x - DOT_RADIUS - MARKER_LEN - (containerEl ? ox : 0);
  const tlx = t.x - DOT_RADIUS - MARKER_LEN - (containerEl ? ox : 0);

  let dir;
  const SAME_THRESHOLD = 60;
  if (Math.abs(cx - tx) < SAME_THRESHOLD) dir = "same";
  else if (cx < tx) dir = "ltr";
  else dir = "rtl";

  const x1 = crx;
  const y1 = cy;
  const x2 = dir === "same" ? tx + DOT_RADIUS + MARKER_LEN : tlx;
  const y2 = ty;

  return { x1, y1, x2, y2, rightEdge1: x1, rightEdge2: x2, dir };
}
