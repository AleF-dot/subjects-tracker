import { buildPath, estimateLen } from "../utils/arrowHelpers";

// Color = tipo (regular → naranja, aprobada → verde)
// Trazo = propósito (sólido → para cursar, punteado → para final)
const TYPE_COLOR = { regular: "#D97706", aprobada: "#059669" };
const MARKER_IDS = {
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
        {Object.entries(TYPE_COLOR).map(([type, color]) =>
          ["Solid", "Dash"].map(style => (
            <marker
              key={`${type}-${style}`}
              id={`m${type === "regular" ? "Amber" : "Emerald"}${style}`}
              markerWidth="8" markerHeight="8" refX="6.5" refY="4"
              orient="auto" markerUnits="userSpaceOnUse"
            >
              <path d="M0,1.5 L0,6.5 L7,4z" fill={color} fillOpacity={style === "Dash" ? 0.75 : 1} />
            </marker>
          ))
        )}
      </defs>
      {arrows.map((a, i) => {
        const color     = TYPE_COLOR[a.type] ?? "#D97706";
        const isFinal   = a.forFinal;
        const markerKey = `${a.type}-${isFinal ? "final" : "cursar"}`;
        const markerId  = `url(#${MARKER_IDS[markerKey]})`;
        const len       = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);

        return (
          <path
            key={a.id}
            d={buildPath(a.x1, a.y1, a.x2, a.y2, a.dir)}
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeOpacity={isFinal ? 0.75 : 1}
            strokeDasharray={isFinal ? "5 4" : `${len}`}
            strokeDashoffset={len}
            markerEnd={markerId}
            style={{ animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s forwards` }}
          />
        );
      })}
    </svg>
  );
}
