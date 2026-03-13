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

  // Convertir coordenadas de viewport a coordenadas dentro del contenido del container.
  // El SVG está en position:absolute dentro del container con overflow:auto,
  // por lo que las coords deben ser relativas al origen del contenido scrolleable.
  //
  // viewport_pos = content_pos + container_rect.top - scrollTop
  // => content_pos = viewport_pos - container_rect.top + scrollTop
  let offX = 0, offY = 0;
  if (containerEl) {
    const cr = containerEl.getBoundingClientRect();
    offX = cr.left - containerEl.scrollLeft;
    offY = cr.top  - containerEl.scrollTop;
  }

  const cx  = c.x  - offX;
  const cy  = c.y  - offY;
  const tx  = t.x  - offX;
  const ty  = t.y  - offY;
  const crx = c.rx - offX;

  let dir;
  const SAME_THRESHOLD = 60;
  if (Math.abs(cx - tx) < SAME_THRESHOLD) dir = "same";
  else if (cx < tx) dir = "ltr";
  else dir = "rtl";

  const x1 = crx;
  const y1 = cy;
  const x2 = dir === "same" ? tx + DOT_RADIUS + MARKER_LEN : tx - DOT_RADIUS - MARKER_LEN;
  const y2 = ty;

  return { x1, y1, x2, y2, rightEdge1: x1, rightEdge2: x2, dir };
}
