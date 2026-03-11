import { buildPath, estimateLen } from "../utils/arrowHelpers";

const TYPE_COLOR_CURSAR = { regular: "#D97706", aprobada: "#059669" };
const TYPE_COLOR_FINAL  = { regular: "#06B6D4", aprobada: "#7C3AED" };

const MARKERS = [
  { id: "mAmberSolid",   color: "#D97706" },
  { id: "mAmberDash",    color: "#06B6D4" },
  { id: "mEmeraldSolid", color: "#059669" },
  { id: "mEmeraldDash",  color: "#7C3AED" },
];

const MARKER_ID = {
  "regular-cursar":  "mAmberSolid",
  "aprobada-cursar": "mEmeraldSolid",
  "regular-final":   "mAmberDash",
  "aprobada-final":  "mEmeraldDash",
};

const EXIT_DURATION = 350;

// clipRect: { left, top, right, bottom } en viewport space
export default function ArrowOverlay({ arrows, animKey, exiting, clipRect }) {
  if (!arrows.length) return null;

  const totalArrows = arrows.length;

  // Definimos un clipPath en viewport space que coincide exactamente
  // con el área visible del scroll container. Las flechas que salgan
  // por los bordes horizontales quedan recortadas.
  const clipId = "arrow-clip";
  const clipX      = clipRect?.left   ?? 0;
  const clipY      = clipRect?.top    ?? 0;
  const clipWidth  = clipRect ? clipRect.right  - clipRect.left : window.innerWidth;
  const clipHeight = clipRect ? clipRect.bottom - clipRect.top  : window.innerHeight;

  return (
    <svg
      key={animKey}
      data-arrows
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 500,
        overflow: "visible",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <defs>
        {MARKERS.map(m => (
          <marker key={m.id} id={m.id} markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,1.5 L0,6.5 L7,4z" fill={m.color} />
          </marker>
        ))}
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x={clipX} y={clipY} width={clipWidth} height={clipHeight} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`} style={{ willChange: "transform", transform: "translateZ(0)" }}>
        {arrows.map((a, i) => {
          const isFinal = !!a.forFinal;
          const color   = isFinal
            ? (TYPE_COLOR_FINAL[a.type]  ?? "#9B6F2F")
            : (TYPE_COLOR_CURSAR[a.type] ?? "#D97706");
          const markerKey = `${a.type}-${isFinal ? "final" : "cursar"}`;
          const markerId  = `url(#${MARKER_ID[markerKey]})`;
          const len       = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);
          const path      = buildPath(a.x1, a.y1, a.x2, a.y2, a.dir, a.rightEdge1, a.rightEdge2);

          const enterDelay = `${i * 0.04}s`;
          const exitDelay  = `${(totalArrows - 1 - i) * 0.03}s`;
          const exitDur    = `${EXIT_DURATION * 0.7}ms`;

          if (isFinal) {
            const animation = exiting
              ? `fadeOut ${exitDur} cubic-bezier(0.4,0,0.2,1) ${exitDelay} forwards`
              : `fadeIn 0.35s cubic-bezier(0.4,0,0.2,1) ${enterDelay} both`;
            return (
              <path
                key={a.id}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray="5 4"
                markerEnd={markerId}
                style={{ animation }}
              />
            );
          }

          const animation = exiting
            ? `undrawPath ${exitDur} cubic-bezier(0.4,0,0.2,1) ${exitDelay} forwards`
            : `drawPath 0.35s cubic-bezier(0.4,0,0.2,1) ${enterDelay} forwards`;

          return (
            <path
              key={a.id}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray={len}
              strokeDashoffset={exiting ? 0 : len}
              markerEnd={markerId}
              style={{ "--path-len": len, animation }}
            />
          );
        })}
      </g>
    </svg>
  );
}
