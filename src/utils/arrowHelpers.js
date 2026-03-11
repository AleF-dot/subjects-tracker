export const ARROW_OFFSET = 7;
const DOT_RADIUS = 4; // dot = 8px diámetro
const MARKER_LEN = 7;  // largo del triángulo SVG (M0→L7)

export function buildPath(x1, y1, x2, y2, dir, rightEdge1, rightEdge2) {
  const ox = rightEdge1 ?? x1;
  const ix = rightEdge2 ?? x2;

  if (dir === "same") {
    const bulge = Math.max(80, Math.abs(y2 - y1) * 0.6 + 60);
    const cx = Math.max(ox, ix) + bulge;
    return `M ${ox} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${ix} ${y2}`;
  }

  if (dir === "ltr") {
    const span = Math.abs(x2 - x1);
    const ctrl = Math.max(span * 0.35, 50);
    return `M ${ox} ${y1} C ${ox + ctrl} ${y1}, ${ix - ctrl} ${y2}, ${ix} ${y2}`;
  }

  if (dir === "rtl") {
    const span = Math.abs(x2 - x1);
    const bulge = Math.max(60, span * 0.25 + 40);
    const drop = Math.max(50, Math.abs(y2 - y1) * 0.4 + 30);
    const cx = Math.max(ox, ix) + bulge;
    return `M ${ox} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${ix} ${y2}`;
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

function elInfo(el, origin) {
  const r = el.getBoundingClientRect();
  const ox = origin ? origin.left : 0;
  const oy = origin ? origin.top  : 0;
  return {
    x:  r.left + r.width  / 2 - ox,
    y:  r.top  + r.height / 2 - oy,
    rx: r.right - ox,
  };
}

export function resolveArrowPoints(corrDotEl, targetDotEl, offsetSide = 0, containerEl = null) {
  const VERT_OFFSET = offsetSide * 10;

  const origin = containerEl ? containerEl.getBoundingClientRect() : null;
  const c = elInfo(corrDotEl, origin);
  const t = elInfo(targetDotEl, origin);

  let dir;
  const SAME_THRESHOLD = 60;
  if (Math.abs(c.x - t.x) < SAME_THRESHOLD) {
    dir = "same";
  } else if (c.x < t.x) {
    dir = "ltr";
  } else {
    dir = "rtl";
  }

  const x1 = c.rx;
  const y1 = c.y + VERT_OFFSET;

  
  
  
  const x2 = dir === "same" ? t.x + DOT_RADIUS + MARKER_LEN : t.x - DOT_RADIUS - MARKER_LEN;
  const y2 = t.y + VERT_OFFSET;

  return {
    x1, y1,
    x2, y2,
    rightEdge1: x1,
    rightEdge2: x2,
    dir,
  };
}
