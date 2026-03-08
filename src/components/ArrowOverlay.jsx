import { buildPath, estimateLen } from "../utils/arrowHelpers";

// Color = tipo de requisito  (naranja = regular, verde = aprobada)
// Trazo = propósito           (sólido = para cursar, punteado = para final)
const TYPE_COLOR = { regular: "#D97706", aprobada: "#059669" };

const MARKERS = [
  { id: "mAmberSolid",   color: "#D97706", opacity: 1    },
  { id: "mAmberDash",    color: "#D97706", opacity: 0.75 },
  { id: "mEmeraldSolid", color: "#059669", opacity: 1    },
  { id: "mEmeraldDash",  color: "#059669", opacity: 0.75 },
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
          <marker key={m.id} id={m.id} markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,1.5 L0,6.5 L7,4z" fill={m.color} fillOpacity={m.opacity} />
          </marker>
        ))}
      </defs>

      {arrows.map((a, i) => {
        const color     = TYPE_COLOR[a.type] ?? "#D97706";
        const isFinal   = !!a.forFinal;
        const markerKey = `${a.type}-${isFinal ? "final" : "cursar"}`;
        const markerId  = `url(#${MARKER_ID[markerKey]})`;
        const len       = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);
        const delay     = `${i * 0.07}s`;

        if (isFinal) {
          // Flechas punteadas para final: no usamos strokeDashoffset para animar
          // porque ya está ocupado por el patrón de guiones.
          // En cambio animamos opacity de 0 → 1.
          return (
            <path
              key={a.id}
              d={buildPath(a.x1, a.y1, a.x2, a.y2, a.dir)}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeOpacity={0.75}
              strokeDasharray="5 4"
              markerEnd={markerId}
              style={{ animation: `fadeIn 0.4s ease ${delay} both` }}
            />
          );
        }

        // Flechas sólidas para cursar: animación de dibujo con dashoffset
        return (
          <path
            key={a.id}
            d={buildPath(a.x1, a.y1, a.x2, a.y2, a.dir)}
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len}
            markerEnd={markerId}
            style={{ animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${delay} forwards` }}
          />
        );
      })}
    </svg>
  );
}
