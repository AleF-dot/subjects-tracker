import { useRef } from "react";
import Dot from "./Dot";
import { STATUS, STATUS_ORDER } from "../utils/constants";

export default function StatusMenu({ anchor, current, onSelect, onDelete, onClose }) {
  const ref  = useRef(null);
  const rect = anchor?.getBoundingClientRect();

  const menuW = Math.max(rect?.width ?? 160, 170);
  const menuH = 230;
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;

  const rawTop  = rect ? (spaceBelow > menuH ? rect.bottom + 6 : rect.top - menuH - 6) : 0;
  const rawLeft = rect ? rect.left : 0;

  const top  = Math.max(8, Math.min(rawTop,  window.innerHeight - menuH - 8));
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth  - menuW  - 8));

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{ position: "fixed", top, left, width: menuW, zIndex: 800 }}
    >
      {current !== null && STATUS_ORDER.map(s => (
        <button
          key={s}
          className={`status-menu-item${current === s ? " active" : ""}`}
          onClick={() => { onSelect(s); onClose(); }}
        >
          <Dot status={s} />
          <span style={{ color: STATUS[s].color }}>{STATUS[s].label}</span>
          {current === s && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#bbb" }}>✓</span>}
        </button>
      ))}
      <button
        className="status-menu-item"
        onClick={() => { onDelete(); onClose(); }}
        style={{ borderTop: current !== null ? "1px solid #E0DAD0" : "none", color: "#b44" }}
      >
        <span style={{ fontSize: "0.8rem" }}>✕</span> Eliminar materia
      </button>
    </div>
  );
}