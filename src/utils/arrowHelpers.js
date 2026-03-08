export const ARROW_OFFSET = 7;

/**
 * Builds a smooth bezier SVG path between two points.
 * dir: "ltr" | "rtl" | "same"
 *
 * Todas las flechas salen por el borde DERECHO de la card origen.
 * - ltr: curva suave hacia la derecha (destino está a la derecha)
 * - rtl: curva que baja y vuelve hacia la izquierda
 * - same: semicírculo por la derecha (misma columna de año)
 */
export function buildPath(x1, y1, x2, y2, dir, rightEdge1, rightEdge2) {
  // Puntos de salida/entrada siempre en el borde derecho
  const ox = rightEdge1 ?? x1;  // salida: borde derecho de la card origen
  const ix = rightEdge2 ?? x2;  // entrada: borde derecho de la card destino

  if (dir === "same") {
    // Semicírculo por la derecha: sale horizontalmente, vuelca 180° y entra
    const bulge = Math.max(80, Math.abs(y2 - y1) * 0.6 + 60);
    const cx = Math.max(ox, ix) + bulge;
    const my = (y1 + y2) / 2;
    return `M ${ox} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${ix} ${y2}`;
  }

  if (dir === "ltr") {
    // Destino a la derecha: salida recta, curva bezier
    const span = Math.abs(x2 - x1);
    const ctrl = Math.max(span * 0.35, 50);
    return `M ${ox} ${y1} C ${ox + ctrl} ${y1}, ${ix - ctrl} ${y2}, ${ix} ${y2}`;
  }

  if (dir === "rtl") {
    // Destino a la izquierda: sale hacia la derecha, arquea abajo y vuelve
    const span = Math.abs(x2 - x1);
    const bulge = Math.max(60, span * 0.25 + 40);
    const drop = Math.max(50, Math.abs(y2 - y1) * 0.4 + 30);
    const cy = Math.max(y1, y2) + drop;
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

/**
 * Returns center {x, y} and right edge {rx} of a DOM element relative to viewport.
 */
function elInfo(el) {
  const r = el.getBoundingClientRect();
  return {
    x:  r.left + r.width / 2,
    y:  r.top  + r.height / 2,
    rx: r.right,
  };
}

/**
 * Determina la dirección y los puntos de anclaje entre origen y destino.
 * SIEMPRE sale por el borde derecho de la card origen.
 * SIEMPRE entra por el borde derecho de la card destino.
 */
export function resolveArrowPoints(corrDotEl, targetDotEl, offsetSide = 0) {
  const VERT_OFFSET = offsetSide * 10;

  const c = elInfo(corrDotEl);
  const t = elInfo(targetDotEl);

  // Usamos el centro X solo para determinar la dirección relativa
  let dir;
  const SAME_THRESHOLD = 60; // px — mismo año si están muy cerca horizontalmente
  if (Math.abs(c.x - t.x) < SAME_THRESHOLD) {
    dir = "same";
  } else if (c.x < t.x) {
    dir = "ltr";
  } else {
    dir = "rtl";
  }

  return {
    x1: c.rx,  y1: c.y + VERT_OFFSET,   // salida: borde derecho origen
    x2: t.rx,  y2: t.y + VERT_OFFSET,   // entrada: borde derecho destino
    rightEdge1: c.rx,
    rightEdge2: t.rx,
    dir,
  };
}

