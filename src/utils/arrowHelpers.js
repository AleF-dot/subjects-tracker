export const ARROW_OFFSET = 7;

/**
 * Builds a smooth bezier SVG path between two points.
 * dir: "ltr" | "rtl" | "same"
 */
export function buildPath(x1, y1, x2, y2, dir) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  if (dir === "ltr") {
    const offset = Math.max(Math.abs(x2 - x1) * 0.25, 40);
    return `M ${x1} ${y1} Q ${x1 + offset} ${y1}, ${mx} ${my} T ${x2} ${y2}`;
  }

  if (dir === "rtl") {
    const drop = Math.max(60, Math.abs(x2 - x1) * 0.3 + 40);
    const cy = Math.max(y1, y2) + drop;
    return `M ${x1} ${y1} Q ${x1} ${cy}, ${mx} ${cy} T ${x2} ${y2}`;
  }

  if (dir === "same") {
    const side = x2 > x1 ? 1 : -1;
    const bulge = Math.max(70, Math.abs(y2 - y1) * 0.5 + 40);
    const cx = mx + side * bulge;
    return `M ${x1} ${y1} Q ${cx} ${y1}, ${mx} ${my} T ${x2} ${y2}`;
  }

  return `M ${x1} ${y1} L ${x2} ${y2}`;
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

/**
 * Returns center {x, y} of a DOM element relative to viewport.
 */
function elCenter(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/**
 * Determines the arrow direction and attachment points between two dots.
 * corrDot / targetDot: DOM elements of the dot spans.
 * offsetSide: vertical offset for overlapping arrows.
 */
export function resolveArrowPoints(corrDotEl, targetDotEl, offsetSide = 0) {
  const VERT_OFFSET = offsetSide * 10;

  const c = elCenter(corrDotEl);
  const t = elCenter(targetDotEl);

  const cx = c.x;
  const tx = t.x;

  let dir;
  if (Math.abs(cx - tx) < 40) {
    dir = "same";
  } else if (cx < tx) {
    dir = "ltr";
  } else {
    dir = "rtl";
  }

  return {
    x1: c.x, y1: c.y + VERT_OFFSET,
    x2: t.x, y2: t.y + VERT_OFFSET,
    dir,
  };
}
