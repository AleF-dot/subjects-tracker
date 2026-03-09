import { buildPath, estimateLen } from "../utils/arrowHelpers";

const TYPE_COLOR_CURSAR = { regular: "#D97706", aprobada: "#059669" };
const TYPE_COLOR_FINAL  = { regular: "#3B82F6", aprobada: "#8B5CF6" };

const MARKERS = [
  { id: "mAmberSolid",   color: "#D97706" },
  { id: "mAmberDash",    color: "#3B82F6" },
  { id: "mEmeraldSolid", color: "#059669" },
  { id: "mEmeraldDash",  color: "#8B5CF6" },
];

const MARKER_ID = {
  "regular-cursar":  "mAmberSolid",
  "aprobada-cursar": "mEmeraldSolid",
  "regular-final":   "mAmberDash",
  "aprobada-final":  "mEmeraldDash",
};

export default function ArrowOverlay({ arrows, animKey }) {
  if (!arrows.length) return null;
  return (
    <svg
      key={animKey}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 500, overflow: "visible" }}
    >
      <defs>
        {MARKERS.map(m => (
          <marker key={m.id} id={m.id} markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,1.5 L0,6.5 L7,4z" fill={m.color} />
          </marker>
        ))}
      </defs>

      {arrows.map((a, i) => {
        const isFinal  = !!a.forFinal;
        const color    = isFinal
          ? (TYPE_COLOR_FINAL[a.type]  ?? "#9B6F2F")
          : (TYPE_COLOR_CURSAR[a.type] ?? "#D97706");
        const markerKey = `${a.type}-${isFinal ? "final" : "cursar"}`;
        const markerId  = `url(#${MARKER_ID[markerKey]})`;
        const delay     = `${i * 0.07}s`;
        const path      = buildPath(a.x1, a.y1, a.x2, a.y2, a.dir, a.rightEdge1, a.rightEdge2);

        // Ambos tipos usan pathLength="1" + strokeDashoffset para la animación de dibujo.
        // Las punteadas expresan su patrón en unidades relativas al pathLength (0..1),
        // así strokeDashoffset funciona igual en ambos casos.
        if (isFinal) {
          return (
            <path
              key={a.id}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="0.06 0.04"
              strokeDashoffset="1"
              markerEnd={markerId}
              style={{ animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${delay} forwards` }}
            />
          );
        }

        return (
          <path
            key={a.id}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            markerEnd={markerId}
            style={{ animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${delay} forwards` }}
          />
        );
      })}
    </svg>
  );
}
