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
 * Determines the arrow direction and attachment points
 * between a correlative element and the target element.
 */
export function resolveArrowPoints(corrRect, targetRect) {
  const SAME_THRESH = 40;
  const corrCenterX = corrRect.left + corrRect.width / 2;
  const targCenterX = targetRect.left + targetRect.width / 2;

  let x1, y1, x2, y2, dir;

  if (Math.abs(corrCenterX - targCenterX) < SAME_THRESH) {
    dir = "ltr";
    x1 = corrRect.right;   y1 = corrRect.top + corrRect.height / 2;
    x2 = targetRect.left;  y2 = targetRect.top + targetRect.height / 2;
  } else if (corrCenterX < targCenterX) {
    dir = "ltr";
    x1 = corrRect.right;   y1 = corrRect.top + corrRect.height / 2;
    x2 = targetRect.left;  y2 = targetRect.top + targetRect.height / 2;
  } else {
    dir = "rtl";
    x1 = corrRect.left;    y1 = corrRect.top + corrRect.height / 2;
    x2 = targetRect.right; y2 = targetRect.top + targetRect.height / 2;
  }

  return { x1, y1, x2, y2, dir };
}
