import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/* ─── Global styles ──────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F5F2EC; color: #1a1a1a; font-family: 'DM Sans', sans-serif; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #c8c2b6; border-radius: 2px; }

    select, input, button { font-family: inherit; }
    select { appearance: none; -webkit-appearance: none; }

    @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
    @keyframes popUp     { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes menuIn    { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
    @keyframes drawPath  { to { stroke-dashoffset: 0 } }

    .subject-card {
      cursor: pointer; user-select: none;
      transition: filter 0.15s, transform 0.18s, opacity 0.18s, box-shadow 0.18s;
      position: relative;
    }
    .subject-card:hover { filter: brightness(0.96); }
    .subject-card.bloqueada { cursor: pointer; }
    .subject-card.bloqueada:hover { filter: brightness(0.96); }

    .status-menu {
      position: fixed;
      z-index: 800;
      background: #fff;
      border: 1px solid #E0DAD0;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      overflow: hidden;
      min-width: 160px;
      animation: menuIn 0.15s ease;
    }
    .status-menu-item {
      padding: 0.55rem 0.9rem;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.1s;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    .status-menu-item:hover { background: #F5F2EC; }
    .status-menu-item.active { background: #F0EDE7; font-weight: 500; }
    .status-menu-item + .status-menu-item { border-top: 1px solid #F0EDE7; }

    .btn-primary { background:#1a1a1a; color:#F5F2EC; border:none; padding:0.65rem 1.4rem; border-radius:6px; font-size:0.82rem; font-weight:500; cursor:pointer; letter-spacing:0.03em; transition:background 0.15s, transform 0.1s; }
    .btn-primary:hover { background:#333; transform:translateY(-1px); }
    .btn-primary:active { transform:translateY(0); }
    .btn-ghost { background:transparent; color:#888; border:1px solid #D5D0C8; padding:0.65rem 1.2rem; border-radius:6px; font-size:0.82rem; cursor:pointer; letter-spacing:0.03em; transition:all 0.15s; }
    .btn-ghost:hover { border-color:#999; color:#444; }

    .input-field { width:100%; background:#EFECE6; border:1px solid #D5D0C8; border-radius:6px; padding:0.7rem 0.9rem; font-size:0.88rem; color:#1a1a1a; outline:none; transition:border-color 0.15s; }
    .input-field:focus { border-color:#999; }
    .input-field::placeholder { color:#bbb; }

    .select-field { width:100%; background:#EFECE6; border:1px solid #D5D0C8; border-radius:6px; padding:0.7rem 2rem 0.7rem 0.9rem; font-size:0.88rem; color:#1a1a1a; outline:none; cursor:pointer; transition:border-color 0.15s; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.8rem center; }
    .select-field:focus { border-color:#999; }
    .select-field option { background:#F5F2EC; }
  `}</style>
);

/* ─── Constants ──────────────────────────────────────────────────────────── */
const STORAGE_KEY  = "curriculum_v5";
const YEAR_LABELS  = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];
const defaultData  = { years: YEAR_LABELS.map((label, i) => ({ id: i + 1, label, subjects: [] })) };
const uid          = () => Math.random().toString(36).slice(2, 9);

// Status config
const STATUS = {
  disponible: { label: "Disponible",  color: "#6B7280", bg: "#F3F4F6", border: "#D1D5DB", dot: "#9CA3AF" },
  cursando:   { label: "Cursando",    color: "#0369A1", bg: "#E0F2FE", border: "#7DD3FC", dot: "#38BDF8" },
  regular:    { label: "Regular",     color: "#9A3412", bg: "#FEF3C7", border: "#FCD34D", dot: "#F59E0B" },
  aprobada:   { label: "Aprobada",    color: "#065F46", bg: "#D1FAE5", border: "#6EE7B7", dot: "#10B981" },
  bloqueada:  { label: "Bloqueada",   color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5", dot: "#EF4444" },
};
const STATUS_ORDER = ["disponible", "cursando", "regular", "aprobada"];

/* ─── Status logic ───────────────────────────────────────────────────────── */
function computeStatus(subject, statusMap) {
  // If manually set, respect it — unless correlatives now block it
  const manual = statusMap[subject.id] ?? null;

  // Check if blocked by correlatives
  const corrs = subject.correlatives ?? [];
  for (const c of corrs) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
  
    if (c.type === "regular") {
      if (!(depStatus === "regular" || depStatus === "aprobada")) {
        return "bloqueada";
      }
    }
  
    if (c.type === "aprobada") {
      if (depStatus !== "aprobada") {
        return "bloqueada";
      }
    }
  }

  // Not blocked — return manual or default
  return manual && manual !== "bloqueada" ? manual : "disponible";
}

/* ─── Arrow helpers ──────────────────────────────────────────────────────── */
const ARROW_OFFSET = 7;

/**
 * Build a clean bezier path from (x1,y1) to (x2,y2).
 * The caller already picks the best attachment sides so we just need
 * to draw a smooth curve without crossings.
 *
 * Cases:
 *  A) corr is LEFT of target  → exit corr.right → enter target.left   (normal)
 *  B) corr is RIGHT of target → exit corr.left  → enter target.right  (backward, arc below)
 *  C) same column             → exit corr.right → arc wide right → enter target.right
 *     or exit corr.left → arc wide left → enter target.left
 */
function buildPath(x1, y1, x2, y2, dir) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // punto medio base
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  if (dir === "ltr") {
    // curva suave tipo S usando dos cuadráticas
    const offset = Math.max(Math.abs(dx) * 0.25, 40);
    return `
      M ${x1} ${y1}
      Q ${x1 + offset} ${y1}, ${mx} ${my}
      T ${x2} ${y2}
    `;
  }

  if (dir === "rtl") {
    // arco por debajo (pero controlado)
    const drop = Math.max(60, Math.abs(dx) * 0.3 + 40);
    const cy = Math.max(y1, y2) + drop;

    return `
      M ${x1} ${y1}
      Q ${x1} ${cy}, ${mx} ${cy}
      T ${x2} ${y2}
    `;
  }

  if (dir === "same") {
    // misma columna → empujar a la derecha o izquierda sin loops
    const side = x2 > x1 ? 1 : -1;
    const bulge = Math.max(70, Math.abs(dy) * 0.5 + 40);

    const cx = mx + side * bulge;

    return `
      M ${x1} ${y1}
      Q ${cx} ${y1}, ${mx} ${my}
      T ${x2} ${y2}
    `;
  }

  // fallback recta
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function estimateLen(x1, y1, x2, y2, dir) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  let base = Math.sqrt(dx*dx + dy*dy);

  if (dir === "rtl")  base = base*1.6 + 80;
  if (dir === "same") base = base*1.4 + 100;
  if (dir === "ltr")  base = base*1.1 + 40;

  // Limitar longitud máxima para casos de cards muy cercanas
  const maxLen = Math.max(20, base); // mínimo 20 para que la flecha se vea
  return maxLen;
}

/* ─── SVG Arrow Overlay ──────────────────────────────────────────────────── */
function ArrowOverlay({ arrows, animKey }) {
  if (!arrows.length) return null;
  return (
    <svg key={animKey} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:500, overflow:"visible" }}>
      <defs>
        <marker id="mAmber"   markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#D97706"/>
        </marker>
        <marker id="mEmerald" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,1.5 L0,6.5 L7,4z" fill="#059669"/>
        </marker>
      </defs>
      {arrows.map((a, i) => {
        const isReg = a.type === "regular";
        const len   = estimateLen(a.x1, a.y1, a.x2, a.y2, a.dir);
        return (
          <path key={a.id} d={buildPath(a.x1, a.y1, a.x2, a.y2, a.dir)}
            fill="none" stroke={isReg ? "#D97706" : "#059669"} strokeWidth={1.8}
            strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len}
            markerEnd={isReg ? "url(#mAmber)" : "url(#mEmerald)"}
            style={{ animation:`drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${i*0.07}s forwards` }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Status dot ─────────────────────────────────────────────────────────── */
function Dot({ status }) {
  const s = STATUS[status];
  return <span style={{ width:7, height:7, borderRadius:"50%", background:s.dot, display:"inline-block", flexShrink:0 }} />;
}

/* ─── Status dropdown menu — fixed position portal, never clipped ────────── */
function StatusMenu({ anchor, current, onSelect, onDelete, onClose }) {
  const ref  = useRef(null);
  const rect = anchor?.getBoundingClientRect();

  const menuW   = Math.max(rect?.width ?? 160, 170);
  const menuH   = 230;
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999;

  const rawTop  = rect ? (spaceBelow > menuH ? rect.bottom + 6 : rect.top - menuH - 6) : 0;
  const rawLeft = rect ? rect.left : 0;

  // Clamp to viewport
  const top  = Math.max(8, Math.min(rawTop,  window.innerHeight - menuH - 8));
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth  - menuW  - 8));

  // Closing is handled by the App-level click-outside listener (via menuPortalRef).
  // No duplicate listener needed here.

  return (
    <div
      ref={ref}
      className="status-menu"
      onClick={e => e.stopPropagation()}
      style={{
        position: "fixed",
        top,
        left,
        width: menuW,
        zIndex: 800,
      }}
    >
      {STATUS_ORDER.map(s => (
        <button key={s} className={`status-menu-item${current === s ? " active" : ""}`} onClick={() => { onSelect(s); onClose(); }}>
          <Dot status={s} />
          <span style={{ color: STATUS[s].color }}>{STATUS[s].label}</span>
          {current === s && <span style={{ marginLeft:"auto", fontSize:"0.65rem", color:"#bbb" }}>✓</span>}
        </button>
      ))}
      <button className="status-menu-item" onClick={() => { onDelete(); onClose(); }} style={{ borderTop:"1px solid #E0DAD0", color:"#b44" }}>
        <span style={{ fontSize:"0.8rem" }}>✕</span> Eliminar materia
      </button>
    </div>
  );
}

/* ─── Subject card ───────────────────────────────────────────────────────── */
function SubjectCard({ subject, status, highlighted, highlightType, dimmed, isSelected, onCardClick, onOpenMenu, cardRef }) {
  const innerRef = useRef(null);
  const st = STATUS[status];
  const isBloqueada = status === "bloqueada";

  // Merge refs
  const setRef = (el) => {
    innerRef.current = el;
    if (typeof cardRef === "function") cardRef(el);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const willSelect = !isSelected;
    onCardClick(subject.id);
    if (isBloqueada) {
      // Bloqueadas: solo mostrar/ocultar flechas de correlativas, sin menú
      onOpenMenu(null, null);
      return;
    }
    if (willSelect) {
      onOpenMenu(subject.id, innerRef.current);
    } else {
      onOpenMenu(null, null);
    }
  };

  const borderColor = highlighted
    ? (highlightType === "regular" ? "#F59E0B" : "#10B981")
    : st.border;
  const bgColor = highlighted
    ? (highlightType === "regular" ? "#FEF9EC" : "#ECFDF5")
    : st.bg;

  return (
    <div
      ref={setRef}
      data-subject-id={subject.id}
      className={`subject-card${isBloqueada ? " bloqueada" : ""}`}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "0.65rem 0.8rem",
        opacity: dimmed ? 0.35 : 1,
        boxShadow: isSelected && !isBloqueada ? "0 0 0 2px " + borderColor + "88" : "none",
      }}
      onClick={handleClick}
      title={isBloqueada ? "Ver correlativas requeridas" : undefined}
    >
      <div style={{ display:"flex", alignItems:"flex-start", gap:"0.4rem" }}>
        <Dot status={status} />
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: highlighted ? 500 : 400,
            color: st.color,
            lineHeight: 1.3,
            flex: 1,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {subject.name}
        </span>
      </div>
      {isBloqueada && (
        <div style={{ fontSize:"0.62rem", color:"#EF4444", marginTop:3, marginLeft:11, fontStyle:"italic" }}>
          Correlativas pendientes
        </div>
      )}
    </div>
  );
}

/* ─── Year column ────────────────────────────────────────────────────────── */
function YearColumn({ year, selectedId, highlightMap, dimmedIds, statusMap, onCardClick, onOpenMenu, onSetStatus, onDelete, registerRef }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", minWidth:0, flex:1 }}>
      <div style={{ paddingBottom:"0.5rem", borderBottom:"1px solid #D5D0C8", marginBottom:"0.25rem" }}>
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"0.95rem", fontWeight:600 }}>{year.label}</div>
        <div style={{ fontSize:"0.65rem", color:"#bbb", marginTop:2, fontFamily:"'DM Mono', monospace" }}>
          {year.subjects.length} materia{year.subjects.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
        {year.subjects.length === 0 && (
          <div style={{ fontSize:"0.72rem", color:"#ccc", fontStyle:"italic", padding:"0.4rem 0" }}>Sin materias</div>
        )}
        {year.subjects.map(s => {
          const hlEntry = highlightMap[s.id];
          const status  = statusMap[s.id] ?? "disponible";
          return (
            <SubjectCard
              key={s.id}
              subject={s}
              status={status}
              highlighted={!!hlEntry}
              highlightType={hlEntry?.type}
              dimmed={dimmedIds.has(s.id)}
              isSelected={s.id === selectedId}
              onCardClick={onCardClick}
              onOpenMenu={onOpenMenu}
              onSetStatus={onSetStatus}
              onDelete={(id) => onDelete(year.id, id)}
              cardRef={el => registerRef(s.id, el)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function Modal({ open, onClose, children, title }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", animation:"fadeIn 0.15s ease" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(20,18,14,0.5)", backdropFilter:"blur(3px)" }} />
      <div style={{ position:"relative", background:"#F5F2EC", border:"1px solid #D5D0C8", borderRadius:"12px", padding:"2rem", width:"100%", maxWidth:"480px", animation:"popUp 0.2s ease", boxShadow:"0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:"1.2rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"#EFECE6", border:"none", width:28, height:28, borderRadius:"6px", cursor:"pointer", fontSize:"0.85rem", color:"#888" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Add subject modal ──────────────────────────────────────────────────── */
function AddModal({ open, onClose, data, onAdd }) {
  const [yearId, setYearId]     = useState(1);
  const [name, setName]         = useState("");
  const [corrList, setCorrList] = useState([]);
  const [corrSub, setCorrSub]   = useState("");
  const [corrType, setCorrType] = useState("regular");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (open) { setYearId(1); setName(""); setCorrList([]); setCorrSub(""); setCorrType("regular"); setError(""); }
  }, [open]);

  const allSubjects = data.years.flatMap(y => y.subjects);
  // Can correlate with ANY subject except itself (same year included)
  const availableForCorr = allSubjects.filter(s => !corrList.find(c => c.subjectId === s.id));

  const addCorr = () => {
    if (!corrSub) return;
    if (corrList.find(c => c.subjectId === corrSub)) { setError("Ya está en la lista."); return; }
    setCorrList(l => [...l, { subjectId: corrSub, type: corrType }]);
    setCorrSub(""); setError("");
  };

  const submit = () => {
    const t = name.trim();
    if (!t) { setError("El nombre no puede estar vacío."); return; }
    if (allSubjects.find(s => s.name.toLowerCase() === t.toLowerCase())) { setError("Ya existe esa materia."); return; }
    onAdd({ yearId, name: t, correlatives: corrList });
    onClose();
  };

  const lbl = { fontSize:"0.7rem", color:"#999", letterSpacing:"0.09em", textTransform:"uppercase", display:"block", marginBottom:"0.35rem" };

  // Group subjects by year for the correlative selector
  const subjectsByYear = data.years.map(y => ({
    ...y,
    subjects: y.subjects.filter(s => !corrList.find(c => c.subjectId === s.id))
  })).filter(y => y.subjects.length > 0);

  return (
    <Modal open={open} onClose={onClose} title="Nueva materia">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <div>
          <label style={lbl}>Año</label>
          <select className="select-field" value={yearId} onChange={e => setYearId(Number(e.target.value))}>
            {data.years.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Nombre de la materia</label>
          <input autoFocus className="input-field" value={name} placeholder="Ej: Álgebra I"
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {allSubjects.length > 0 && (
          <div>
            <label style={lbl}>Correlativas (opcional)</label>
            <div style={{ display:"flex", gap:"0.4rem" }}>
              <select className="select-field" style={{ flex:1 }} value={corrSub} onChange={e => setCorrSub(e.target.value)}>
                <option value="">Seleccionar materia...</option>
                {subjectsByYear.map(y => (
                  <optgroup key={y.id} label={y.label}>
                    {y.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                ))}
              </select>
              <select className="select-field" style={{ width:"auto", minWidth:110 }} value={corrType} onChange={e => setCorrType(e.target.value)}>
                <option value="regular">Regularizar</option>
                <option value="aprobada">Aprobar</option>
              </select>
              <button className="btn-primary" onClick={addCorr} disabled={!corrSub} style={{ padding:"0.65rem 0.85rem", opacity: corrSub ? 1 : 0.4 }}>+</button>
            </div>
            {corrList.length > 0 && (
              <div style={{ marginTop:"0.6rem", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                {corrList.map(c => {
                  const sub   = allSubjects.find(s => s.id === c.subjectId);
                  const isReg = c.type === "regular";
                  return (
                    <div key={c.subjectId} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#EFECE6", borderRadius:"6px", padding:"0.4rem 0.65rem" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ color: isReg ? "#D97706" : "#059669", fontSize:"0.85rem" }}>→</span>
                        <span style={{ fontSize:"0.73rem", color:"#555" }}>{isReg ? "Regularizar" : "Aprobar"} · {sub?.name}</span>
                      </div>
                      <button onClick={() => setCorrList(l => l.filter(x => x.subjectId !== c.subjectId))} style={{ background:"none", border:"none", color:"#bbb", cursor:"pointer", fontSize:"0.78rem" }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && <div style={{ fontSize:"0.73rem", color:"#b44" }}>{error}</div>}

        <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.25rem" }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex:1 }}>Cancelar</button>
          <button className="btn-primary" onClick={submit} style={{ flex:2 }}>Agregar materia</button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position:"fixed", bottom:"1.75rem", left:"50%", transform:"translateX(-50%)", background: type==="error" ? "#7f1d1d" : "#1a1a1a", color:"#F5F2EC", padding:"0.5rem 1.2rem", borderRadius:"20px", fontSize:"0.76rem", zIndex:1000, animation:"popUp 0.18s ease", whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.2)", letterSpacing:"0.02em" }}>
      {msg}
    </div>
  );
}

/* ─── Legend ─────────────────────────────────────────────────────────────── */
function Legend() {
  return (
    <div style={{ padding:"0.65rem 2rem", borderBottom:"1px solid #EAE6DF", fontSize:"0.68rem", color:"#999", display:"flex", gap:"1.25rem", flexWrap:"wrap", alignItems:"center" }}>
      {Object.entries(STATUS).map(([key, s]) => (
        <span key={key} style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
          <span style={{ color: s.color }}>{s.label}</span>
        </span>
      ))}
      <span style={{ marginLeft:"auto", display:"flex", gap:"1rem" }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ color:"#D97706", fontWeight:700 }}>→</span> Regularizar</span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ color:"#059669", fontWeight:700 }}>→</span> Aprobar</span>
      </span>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultData; }
    catch { return defaultData; }
  });
  // statusMap: { [subjectId]: "cursando" | "regular" | "aprobada" }
  // (bloqueada and disponible are computed, not stored)
  const [statusMap, setStatusMap] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY + "_status"); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });

  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [toast, setToast]           = useState(null);
  const [arrows, setArrows]         = useState([]);
  const [animKey, setAnimKey]       = useState(0);
  const [menuAnchor, setMenuAnchor] = useState({ subjectId: null, el: null });

  const cardRefs = useRef({});
  const gridRef  = useRef(null);
  const rafRef   = useRef(null);

  const registerRef = useCallback((id, el) => {
    if (el) cardRefs.current[id] = el;
    else    delete cardRefs.current[id];
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + "_status", JSON.stringify(statusMap)); }, [statusMap]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const allSubjects = data.years.flatMap(y => y.subjects);

  // Compute effective status for every subject
  const effectiveStatus = {};
  allSubjects.forEach(s => {
    effectiveStatus[s.id] = computeStatus(s, { ...effectiveStatus, ...statusMap });
  });

  // Selected subject
  const selectedSubject = allSubjects.find(s => s.id === selectedId) ?? null;
  const correlatives    = selectedSubject?.correlatives ?? [];

  // Highlight map: correlative subjects light up
  const highlightMap = {};
  correlatives.forEach(c => { highlightMap[c.subjectId] = { type: c.type }; });

  // Dim: subjects in same year as selected (not selected, not highlighted)
  const selectedYear = data.years.find(y => y.subjects.some(s => s.id === selectedId));
  const dimmedIds    = new Set();
  if (selectedYear) {
    selectedYear.subjects.forEach(s => {
      if (s.id !== selectedId && !highlightMap[s.id]) dimmedIds.add(s.id);
    });
  }

  /* ── Arrow computation ── */
  const computeArrows = useCallback(() => {
    if (!selectedId || correlatives.length === 0) { setArrows([]); return; }
    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) { setArrows([]); return; }
    const tRect = targetEl.getBoundingClientRect();

    const next = correlatives.map(c => {
      const el = cardRefs.current[c.subjectId];
      if (!el) return null;
      const r = el.getBoundingClientRect();

      const corrCenterX = r.left + r.width / 2;
      const targCenterX = tRect.left + tRect.width / 2;
      const SAME_THRESH = 40; // px — consider "same column"

      let x1, y1, x2, y2, dir;

      if (Math.abs(corrCenterX - targCenterX) < SAME_THRESH) {
        // MISMO AÑO → SIEMPRE LTR
        dir = "ltr";
      
        x1 = r.right; // sale por derecha de correlativa
        y1 = r.top + r.height / 2;
      
        x2 = tRect.left; // entra por izquierda del target
        y2 = tRect.top + tRect.height / 2;
      } else if (corrCenterX < targCenterX) {
        // Correlative is to the LEFT of target (normal flow)
        dir = "ltr";
        x1 = r.right;    y1 = r.top + r.height / 2;
        x2 = tRect.left; y2 = tRect.top + tRect.height / 2;
      } else {
        // Correlative is to the RIGHT of target (backwards flow) — arc below
        dir = "rtl";
        x1 = r.left;      y1 = r.top + r.height / 2;
        x2 = tRect.right; y2 = tRect.top + tRect.height / 2;
      }

      return { id:`${selectedId}-${c.subjectId}`, x1, y1, x2, y2, dir, type:c.type };
    }).filter(Boolean);
    setArrows(next);
  }, [selectedId, correlatives]);

  const recomputePositions = useCallback(() => {
    if (!selectedId || correlatives.length === 0) { setArrows([]); return; }
    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) return;
    const tRect = targetEl.getBoundingClientRect();

    setArrows(prev => prev.map(a => {
      const corrId = a.id.replace(`${selectedId}-`, "");
      const el     = cardRefs.current[corrId];
      if (!el) return a;
      const r = el.getBoundingClientRect();

      const corrCenterX = r.left + r.width / 2;
      const targCenterX = tRect.left + tRect.width / 2;
      const SAME_THRESH = 40;

      let x1, y1, x2, y2, dir;
      if (Math.abs(corrCenterX - targCenterX) < SAME_THRESH) {
        // MISMO AÑO → SIEMPRE LTR
        dir = "ltr";
      
        x1 = r.right; // sale por derecha de correlativa
        y1 = r.top + r.height / 2;
      
        x2 = tRect.left; // entra por izquierda del target
        y2 = tRect.top + tRect.height / 2;
      } else if (corrCenterX < targCenterX) {
        dir = "ltr";
        x1 = r.right;    y1 = r.top + r.height / 2;
        x2 = tRect.left; y2 = tRect.top + tRect.height / 2;
      } else {
        dir = "rtl";
        x1 = r.left;      y1 = r.top + r.height / 2;
        x2 = tRect.right; y2 = tRect.top + tRect.height / 2;
      }

      return { ...a, x1, y1, x2, y2, dir };
    }));
  }, [selectedId, correlatives]);

  useLayoutEffect(() => {
    if (!selectedId) { setArrows([]); return; }
    rafRef.current = requestAnimationFrame(() => { computeArrows(); setAnimKey(k => k+1); });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId, data]);

  useEffect(() => {
    const onResize = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(recomputePositions); };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions]);

  useEffect(() => {
    const fn = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(recomputePositions); };
    window.addEventListener("scroll", fn, { passive:true });
    document.querySelector("main")?.addEventListener("scroll", fn, { passive:true });
    return () => { window.removeEventListener("scroll", fn); document.querySelector("main")?.removeEventListener("scroll", fn); };
  }, [recomputePositions]);

  // Click outside → deselect (but not if clicking inside the portal menu)
  const menuPortalRef = useRef(null);
  useEffect(() => {
    const fn = e => {
      const inGrid = gridRef.current?.contains(e.target);
      const inMenu = menuPortalRef.current?.contains(e.target);
      if (!inGrid && !inMenu) { setSelectedId(null); setArrows([]); setMenuAnchor({ subjectId: null, el: null }); }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleCardClick = (id) => {
    setSelectedId(prev => {
      if (prev === id) { setMenuAnchor({ subjectId: null, el: null }); return null; }
      return id;
    });
  };

  const handleOpenMenu = (subjectId, el) => {
    setMenuAnchor({ subjectId, el });
  };

  const handleSetStatus = (subjectId, newStatus) => {
    setStatusMap(m => ({ ...m, [subjectId]: newStatus }));
    showToast(`${STATUS[newStatus].label} ✓`);
    setSelectedId(null);
    setArrows([]);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleAdd = ({ yearId, name, correlatives }) => {
    setData(d => ({ ...d, years: d.years.map(y => y.id === yearId ? { ...y, subjects:[...y.subjects, { id:uid(), name, correlatives }] } : y) }));
    showToast(`"${name}" agregada`);
  };

  const handleDelete = (yearId, subjectId) => {
    setData(d => ({
      ...d,
      years: d.years.map(y => ({
        ...y,
        subjects: y.id === yearId
          ? y.subjects.filter(s => s.id !== subjectId)
          : y.subjects.map(s => ({ ...s, correlatives:(s.correlatives||[]).filter(c => c.subjectId !== subjectId) }))
      }))
    }));
    setStatusMap(m => { const n = {...m}; delete n[subjectId]; return n; });
    setSelectedId(null);
    setArrows([]);
    setMenuAnchor({ subjectId: null, el: null });
    showToast("Materia eliminada", "error");
  };

  const exportJSON = () => {
    const payload = { ...data, statusMap };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "plan_de_estudios.json"; a.click();
    URL.revokeObjectURL(url);
    showToast("JSON exportado");
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!parsed.years || !Array.isArray(parsed.years)) throw new Error();
          const { statusMap: sm, ...rest } = parsed;
          setData(rest);
          setStatusMap(sm ?? {});
          setSelectedId(null); setArrows([]);
          showToast("Plan importado ✓");
        } catch { showToast("Archivo inválido", "error"); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Stats
  const counts = Object.values(effectiveStatus).reduce((acc, s) => { acc[s] = (acc[s]||0)+1; return acc; }, {});

  return (
    <>
      <GlobalStyles />
      <ArrowOverlay arrows={arrows} animKey={animKey} />

      <div style={{ minHeight:"100vh", background:"#F5F2EC" }}>
        {/* Header */}
        <header style={{ borderBottom:"1px solid #D5D0C8", padding:"1.5rem 2rem", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:"0.65rem", letterSpacing:"0.18em", color:"#bbb", textTransform:"uppercase", marginBottom:"0.3rem", fontFamily:"'DM Mono', monospace" }}>Gestión académica</div>
            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(1.6rem, 4vw, 2.2rem)", fontWeight:700, letterSpacing:"-0.02em", lineHeight:1 }}>Materias</h1>
          </div>
          {/* Progress mini-stats */}
          <div style={{ display:"flex", gap:"1.25rem", alignItems:"center", flexWrap:"wrap" }}>
            {[["aprobada","Aprobadas"],["regular","Regulares"],["cursando","Cursando"]].map(([k, label]) => (
              <div key={k} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:"1.3rem", fontWeight:500, color: STATUS[k].dot, lineHeight:1 }}>{counts[k]||0}</div>
                <div style={{ fontSize:"0.6rem", color:"#bbb", letterSpacing:"0.06em", textTransform:"uppercase" }}>{label}</div>
              </div>
            ))}
            <div style={{ width:1, height:32, background:"#D5D0C8" }} />
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button className="btn-ghost" onClick={importJSON} style={{ fontSize:"0.76rem", padding:"0.55rem 0.95rem" }}>↑ Importar</button>
              <button className="btn-ghost" onClick={exportJSON} style={{ fontSize:"0.76rem", padding:"0.55rem 0.95rem" }}>↓ Exportar</button>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Nueva materia</button>
            </div>
          </div>
        </header>

        <Legend />

        {/* Grid */}
        <main style={{ padding:"2rem", paddingBottom:"4rem" }}>
          <div style={{ overflowX:"auto" }}><div ref={gridRef} style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"1.75rem", width:"100%" }}>
            {data.years.map(year => (
              <YearColumn
                key={year.id}
                year={year}
                selectedId={selectedId}
                highlightMap={highlightMap}
                dimmedIds={dimmedIds}
                statusMap={effectiveStatus}
                onCardClick={handleCardClick}
                onOpenMenu={handleOpenMenu}
                onSetStatus={handleSetStatus}
                onDelete={handleDelete}
                registerRef={registerRef}
              />
            ))}
          </div></div>
        </main>
      </div>

      <AddModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} onAdd={handleAdd} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Status menu rendered as portal — escapes any transform/overflow context */}
      {menuAnchor.subjectId && menuAnchor.el && (() => {
        const sid = menuAnchor.subjectId;
        const st  = effectiveStatus[sid];
        const yearId = data.years.find(y => y.subjects.some(s => s.id === sid))?.id;
        const closeMenu = () => { setMenuAnchor({ subjectId: null, el: null }); setSelectedId(null); setArrows([]); };
        return createPortal(
          <div ref={menuPortalRef}>
            <StatusMenu
              anchor={menuAnchor.el}
              current={st === "bloqueada" ? null : st}
              onSelect={(s) => { handleSetStatus(sid, s); }}
              onDelete={() => { handleDelete(yearId, sid); }}
              onClose={closeMenu}
            />
          </div>,
          document.body
        );
      })()}
    </>
  );
}
