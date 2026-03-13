import React, { useEffect, useState } from "react";
import { buildPath, estimateLen } from "../utils/arrowHelpers";

const EXIT_DURATION = 350;

const MARKERS = [
  { id: "mSolid",  orient: "auto" },
  { id: "mSolidH", orient: "0" },
  { id: "mDash",   orient: "auto" },
  { id: "mDashH",  orient: "0" },
];

const MARKER_ID   = { solid: "mSolid",  dash: "mDash"  };
const MARKER_ID_H = { solid: "mSolidH", dash: "mDashH" };

function getArrowColor(type, isFinal) {
  const s = getComputedStyle(document.documentElement);
  const cv = (n) => s.getPropertyValue(n).trim();
  if (isFinal) return type === "regular" ? cv("--arrow-regular-final") : cv("--arrow-aprobada-final");
  return type === "regular" ? cv("--arrow-regular-cursar") : cv("--arrow-aprobada-cursar");
}

// SVG vive dentro del scroll container en position:absolute
// Las coordenadas ya vienen relativas al container desde resolveArrowPoints
export default function ArrowOverlay({ arrows, animKey, exiting, svgRef, containerRef }) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Medir el tamaño del contenido del container para que el SVG lo cubra completo
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const measure = () => setSize({ w: el.scrollWidth, h: el.scrollHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const totalArrows = arrows.length;

  if (!totalArrows && !exiting) return null;

  return (
    <svg
      key={animKey}
      ref={svgRef}
      data-arrows
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size.w || "100%",
        height: size.h || "100%",
        pointerEvents: "none",
        zIndex: 500,
        overflow: "visible",
        willChange: "contents",
      }}
    >
      <defs>
        {MARKERS.map(m => (
          <marker key={m.id} id={m.id} markerWidth="8" markerHeight="8" refX="0" refY="4" orient={m.orient} markerUnits="userSpaceOnUse">
            <path d="M0,1.5 L0,6.5 L7,4z" fill="currentColor" />
          </marker>
        ))}
      </defs>

      <g>
        {arrows.map((a, i) => {
          const isFinal = !!a.forFinal;
          const color   = getArrowColor(a.type, isFinal);
          const shapeKey = isFinal ? "dash" : "solid";
          const isArced  = (a.arcOffset ?? 0) !== 0;
          const markerId = `url(#${isArced ? MARKER_ID_H[shapeKey] : MARKER_ID[shapeKey]})`;
          const len       = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);
          const path      = buildPath(a.x1, a.y1, a.x2, a.y2, a.dir, a.rightEdge1, a.rightEdge2, a.arcOffset ?? 0);

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
                data-arrow-id={a.id}
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

          const markerAnim = exiting
            ? `fadeOut ${parseFloat(exitDur) * 0.4}ms cubic-bezier(0.4,0,0.2,1) ${exitDelay} forwards`
            : `fadeIn 0.35s cubic-bezier(0.4,0,0.2,1) ${enterDelay} both`;

          return (
            <g key={a.id}>
              <path
                data-arrow-id={a.id}
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={exiting ? 0 : len}
                style={{ "--path-len": len, animation }}
              />
              <path
                data-arrow-id={a.id}
                d={path}
                fill="none"
                stroke={color}
                strokeOpacity={0}
                color={color}
                markerEnd={markerId}
                style={{ animation: markerAnim }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
