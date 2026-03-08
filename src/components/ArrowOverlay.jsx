import { buildPath, estimateLen } from "../utils/arrowHelpers";

export default function ArrowOverlay({ arrows, animKey }) {
  if (!arrows.length) return null;
  return (
    <svg
      key={animKey}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 500, overflow: "visible" }}
    >
      <defs>
        <marker id="mAmber"        markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#D97706" />
        </marker>
        <marker id="mEmerald"      markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#059669" />
        </marker>
        <marker id="mAmberFinal"   markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#9333EA" />
        </marker>
        <marker id="mEmeraldFinal" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#9333EA" />
        </marker>
      </defs>
      {arrows.map((a, i) => {
        const isReg   = a.type === "regular";
        const isFinal = a.forFinal;
        const len     = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);
        const color   = isFinal ? "#9333EA" : (isReg ? "#D97706" : "#059669");
        const markerId = isFinal
          ? (isReg ? "url(#mAmberFinal)" : "url(#mEmeraldFinal)")
          : (isReg ? "url(#mAmber)" : "url(#mEmerald)");
        return (
          <path
            key={a.id}
            d={buildPath(a.x1, a.y1, a.x2, a.y2, a.dir)}
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray={isFinal ? `${len} 0` : len}
            strokeDashoffset={len}
            strokeOpacity={isFinal ? 0.7 : 1}
            markerEnd={markerId}
            style={{
              animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s forwards`,
              ...(isFinal ? { strokeDasharray: "6 4" } : {}),
            }}
          />
        );
      })}
    </svg>
  );
}
