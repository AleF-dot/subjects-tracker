import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";

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
    @keyframes drawPath  { to { stroke-dashoffset: 0 } }

    .subject-card {
      cursor: pointer; user-select: none;
      transition: background 0.16s, border-color 0.16s, box-shadow 0.16s, opacity 0.2s, transform 0.2s;
    }
    .subject-card:not(.selected):not(.dimmed):not(.highlighted):hover { background: #EAE6DF !important; }

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
const STORAGE_KEY = "curriculum_v4";
const YEAR_LABELS = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];
const defaultData = { years: YEAR_LABELS.map((label, i) => ({ id: i + 1, label, subjects: [] })) };
const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Arrow path math ────────────────────────────────────────────────────── */
// Returns an SVG path string for a smooth curve from (x1,y1) → (x2,y2).
// Always curves "outward" — if source is to the left, arc gently above/below
// so it never collapses into itself regardless of proximity.
function buildPath(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Horizontal control point distance: at least 60px, scales with distance
  const cpx = Math.max(Math.abs(dx) * 0.5, 60);

  // Vertical bow: adds a slight arc so close/parallel arrows don't look flat.
  // Direction alternates based on which side the source is on.
  const bow = dy === 0 ? -30 : 0; // only add bow when perfectly horizontal

  const cx1 = x1 + cpx;
  const cy1 = y1 + bow;
  const cx2 = x2 - cpx;
  const cy2 = y2 + bow;

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

// Rough path length estimation for dash animation (avoids getPathLength() which requires DOM)
function estimateLength(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Cubic bezier length ≈ chord + a bit for curvature
  return Math.sqrt(dx * dx + dy * dy) * 1.15 + 40;
}

/* ─── SVG Arrow Overlay ──────────────────────────────────────────────────── */
function ArrowOverlay({ arrows, animKey }) {
  if (!arrows.length) return null;
  return (
    <svg
      key={animKey}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 500, overflow: "visible" }}
    >
      <defs>
        <marker id="mAmber"   markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L7,3.5 z" fill="#D97706" />
        </marker>
        <marker id="mEmerald" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L7,3.5 z" fill="#059669" />
        </marker>
      </defs>

      {arrows.map((a, i) => {
        const isReg  = a.type === "regular";
        const stroke = isReg ? "#D97706" : "#059669";
        const marker = isReg ? "url(#mAmber)" : "url(#mEmerald)";
        const d      = buildPath(a.x1, a.y1, a.x2, a.y2);
        const len    = estimateLength(a.x1, a.y1, a.x2, a.y2);
        const delay  = i * 0.07;

        return (
          <path
            key={a.id}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len}
            markerEnd={marker}
            style={{
              animation: `drawPath 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s forwards`,
            }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Subject card ───────────────────────────────────────────────────────── */
const SubjectCard = ({ subject, isSelected, isFirst, highlighted, highlightType, dimmed, onSelect, cardRef }) => {
  const bg =
    isSelected  ? "#1a1a1a" :
    highlighted ? (highlightType === "regular" ? "#FEF3C7" : "#D1FAE5") :
    "#F5F2EC";
  const border =
    isSelected  ? "#1a1a1a" :
    highlighted ? (highlightType === "regular" ? "#F59E0B" : "#10B981") :
    "#D5D0C8";

  return (
    <div
      ref={cardRef}
      data-subject-id={subject.id}
      className={`subject-card${isSelected ? " selected" : ""}${dimmed ? " dimmed" : ""}${highlighted ? " highlighted" : ""}`}
      style={{
        background: bg,
        color: isSelected ? "#F5F2EC" : "#1a1a1a",
        border: `1px solid ${border}`,
        borderRadius: "8px",
        padding: "0.7rem 0.85rem",
        opacity:   dimmed ? 0.28 : 1,
        transform: dimmed ? "scale(0.97)" : "scale(1)",
        boxShadow: isSelected  ? "0 3px 14px rgba(0,0,0,0.16)" :
                   highlighted ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}
      onClick={() => onSelect(subject.id)}
    >
      <div style={{ fontSize: "0.83rem", fontWeight: isSelected || highlighted ? 500 : 400, lineHeight: 1.3 }}>
        {subject.name}
      </div>
      {isSelected && (
        <div style={{ marginTop: "0.4rem", animation: "slideDown 0.16s ease" }}>
          {isFirst ? (
            <span style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Sin correlativas — 1er año</span>
          ) : subject.correlatives?.length > 0 ? (
            <span style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.45)" }}>
              {subject.correlatives.length} correlativa{subject.correlatives.length > 1 ? "s" : ""}
            </span>
          ) : (
            <span style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Sin correlativas</span>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Year column ────────────────────────────────────────────────────────── */
function YearColumn({ year, isFirst, selectedId, highlightMap, dimmedIds, onSelect, onDelete, registerRef }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0, flex: 1 }}>
      <div style={{ paddingBottom: "0.5rem", borderBottom: "1px solid #D5D0C8", marginBottom: "0.25rem" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600 }}>{year.label}</div>
        <div style={{ fontSize: "0.65rem", color: "#bbb", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          {year.subjects.length} materia{year.subjects.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {year.subjects.length === 0 && (
          <div style={{ fontSize: "0.72rem", color: "#ccc", fontStyle: "italic", padding: "0.4rem 0" }}>Sin materias</div>
        )}
        {year.subjects.map(s => {
          const isSel   = s.id === selectedId;
          const hlEntry = highlightMap[s.id];
          return (
            <div key={s.id}>
              <SubjectCard
                subject={s}
                isSelected={isSel}
                isFirst={isFirst}
                highlighted={!!hlEntry}
                highlightType={hlEntry?.type}
                dimmed={dimmedIds.has(s.id)}
                onSelect={onSelect}
                cardRef={el => registerRef(s.id, el)}
              />
              {isSel && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(year.id, s.id); }}
                    style={{ background: "none", border: "none", color: "#b44", fontSize: "0.68rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2, padding: "2px 0" }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
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
    <div style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "fadeIn 0.15s ease" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,18,14,0.5)", backdropFilter: "blur(3px)" }} />
      <div style={{ position: "relative", background: "#F5F2EC", border: "1px solid #D5D0C8", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "460px", animation: "popUp 0.2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#EFECE6", border: "none", width: 28, height: 28, borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", color: "#888" }}>✕</button>
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

  const isFirst      = yearId === 1;
  const allSubjects  = data.years.flatMap(y => y.subjects);
  const prevSubjects = data.years.filter(y => y.id < yearId).flatMap(y => y.subjects);

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
    onAdd({ yearId, name: t, correlatives: isFirst ? [] : corrList });
    onClose();
  };

  const lbl = { fontSize: "0.7rem", color: "#999", letterSpacing: "0.09em", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" };

  return (
    <Modal open={open} onClose={onClose} title="Nueva materia">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={lbl}>Año</label>
          <select className="select-field" value={yearId} onChange={e => { setYearId(Number(e.target.value)); setCorrList([]); setCorrSub(""); }}>
            {data.years.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Nombre de la materia</label>
          <input autoFocus className="input-field" value={name} placeholder="Ej: Álgebra I"
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {!isFirst && prevSubjects.length > 0 && (
          <div>
            <label style={lbl}>Correlativas (opcional)</label>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <select className="select-field" style={{ flex: 1 }} value={corrSub} onChange={e => setCorrSub(e.target.value)}>
                <option value="">Seleccionar materia...</option>
                {prevSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="select-field" style={{ width: "auto", minWidth: 110 }} value={corrType} onChange={e => setCorrType(e.target.value)}>
                <option value="regular">Regularizar</option>
                <option value="aprobada">Aprobar</option>
              </select>
              <button className="btn-primary" onClick={addCorr} disabled={!corrSub} style={{ padding: "0.65rem 0.85rem", opacity: corrSub ? 1 : 0.4 }}>+</button>
            </div>
            {corrList.length > 0 && (
              <div style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {corrList.map(c => {
                  const sub = allSubjects.find(s => s.id === c.subjectId);
                  const isReg = c.type === "regular";
                  return (
                    <div key={c.subjectId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EFECE6", borderRadius: "6px", padding: "0.4rem 0.65rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: isReg ? "#D97706" : "#059669", fontSize: "0.85rem" }}>→</span>
                        <span style={{ fontSize: "0.73rem", color: "#555" }}>{isReg ? "Regularizar" : "Aprobar"} · {sub?.name}</span>
                      </div>
                      <button onClick={() => setCorrList(l => l.filter(x => x.subjectId !== c.subjectId))} style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", fontSize: "0.78rem" }}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {isFirst && (
          <div style={{ fontSize: "0.73rem", color: "#bbb", fontStyle: "italic", background: "#EFECE6", padding: "0.6rem 0.8rem", borderRadius: "6px" }}>
            Las materias de 1er año no tienen correlativas.
          </div>
        )}

        {error && <div style={{ fontSize: "0.73rem", color: "#b44" }}>{error}</div>}

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.25rem" }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
          <button className="btn-primary" onClick={submit} style={{ flex: 2 }}>Agregar materia</button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)", background: type === "error" ? "#7f1d1d" : "#1a1a1a", color: "#F5F2EC", padding: "0.5rem 1.2rem", borderRadius: "20px", fontSize: "0.76rem", zIndex: 1000, animation: "popUp 0.18s ease", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", letterSpacing: "0.02em" }}>
      {msg}
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [data, setData]           = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : defaultData; }
    catch { return defaultData; }
  });
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [toast, setToast]           = useState(null);
  const [arrows, setArrows]         = useState([]);
  const [animKey, setAnimKey]       = useState(0);

  const cardRefs  = useRef({});
  const gridRef   = useRef(null);
  const rafRef    = useRef(null);

  const registerRef = useCallback((id, el) => {
    if (el) cardRefs.current[id] = el;
    else    delete cardRefs.current[id];
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2000);
  };

  const allSubjects = data.years.flatMap(y => y.subjects);
  const selectedSubject = allSubjects.find(s => s.id === selectedId) ?? null;
  const correlatives    = selectedSubject?.correlatives ?? [];

  const highlightMap = {};
  correlatives.forEach(c => { highlightMap[c.subjectId] = { type: c.type }; });

  const selectedYear = data.years.find(y => y.subjects.some(s => s.id === selectedId));
  const dimmedIds    = new Set();
  if (selectedYear) {
    selectedYear.subjects.forEach(s => {
      if (s.id !== selectedId && !highlightMap[s.id]) dimmedIds.add(s.id);
    });
  }

  /* ── Compute arrows from current DOM positions ── */
  const computeArrows = useCallback(() => {
    if (!selectedId || correlatives.length === 0) { setArrows([]); return; }

    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) { setArrows([]); return; }

    const tRect = targetEl.getBoundingClientRect();
    // Entry point: left-center of the selected card
    const tx = tRect.left;
    const ty = tRect.top + tRect.height / 2;

    const next = correlatives.map((c, i) => {
      const srcEl = cardRefs.current[c.subjectId];
      if (!srcEl) return null;
      const sRect = srcEl.getBoundingClientRect();
      return {
        id:    `${selectedId}-${c.subjectId}`,
        // Exit point: right-center of the correlative card
        x1:    sRect.right,
        y1:    sRect.top + sRect.height / 2,
        x2:    tx,
        y2:    ty,
        type:  c.type,
        delay: i * 0.07,
      };
    }).filter(Boolean);

    setArrows(next);
  }, [selectedId, correlatives]);

  /* ── Recompute WITHOUT re-triggering animation (for resize/scroll) ── */
  const recomputePositions = useCallback(() => {
    if (!selectedId || correlatives.length === 0) { setArrows([]); return; }

    const targetEl = cardRefs.current[selectedId];
    if (!targetEl) return;

    const tRect = targetEl.getBoundingClientRect();
    const tx = tRect.left;
    const ty = tRect.top + tRect.height / 2;

    setArrows(prev => prev.map(a => {
      const srcEl = cardRefs.current[a.id.split("-")[1]] ??
                    // id is `${selectedId}-${corrId}` — extract corrId
                    cardRefs.current[a.id.replace(`${selectedId}-`, "")];

      // Re-find source element by correlative id
      const corrId = a.id.replace(`${selectedId}-`, "");
      const el     = cardRefs.current[corrId];
      if (!el) return a;
      const sRect = el.getBoundingClientRect();
      return { ...a, x1: sRect.right, y1: sRect.top + sRect.height / 2, x2: tx, y2: ty };
    }));
  }, [selectedId, correlatives]);

  /* ── Run computeArrows after paint when selection changes ── */
  useLayoutEffect(() => {
    if (!selectedId) { setArrows([]); return; }
    // Wait one frame so card transitions have started
    rafRef.current = requestAnimationFrame(() => {
      computeArrows();
      setAnimKey(k => k + 1);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedId, data]); // re-run if data changes too (delete, add)

  /* ── Reactive: resize ── */
  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recomputePositions);
    };
    const ro = new ResizeObserver(onResize);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener("resize", onResize);
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); };
  }, [recomputePositions]);

  /* ── Reactive: scroll ── */
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(recomputePositions);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Also watch any scrollable parent
    const main = document.querySelector("main");
    if (main) main.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (main) main.removeEventListener("scroll", onScroll);
    };
  }, [recomputePositions]);

  /* ── Click outside → deselect ── */
  useEffect(() => {
    const fn = e => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setSelectedId(null);
        setArrows([]);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSelect = id => {
    setSelectedId(prev => {
      if (prev === id) { setArrows([]); return null; }
      return id;
    });
  };

  const handleAdd = ({ yearId, name, correlatives }) => {
    setData(d => ({ ...d, years: d.years.map(y => y.id === yearId ? { ...y, subjects: [...y.subjects, { id: uid(), name, correlatives }] } : y) }));
    showToast(`"${name}" agregada`);
  };

  const handleDelete = (yearId, subjectId) => {
    setData(d => ({
      ...d,
      years: d.years.map(y => ({
        ...y,
        subjects: y.id === yearId
          ? y.subjects.filter(s => s.id !== subjectId)
          : y.subjects.map(s => ({ ...s, correlatives: (s.correlatives || []).filter(c => c.subjectId !== subjectId) }))
      }))
    }));
    setSelectedId(null);
    setArrows([]);
    showToast("Materia eliminada", "error");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "plan_de_estudios.json"; a.click();
    URL.revokeObjectURL(url);
    showToast("JSON exportado");
  };

  const importJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          // Basic validation
          if (!parsed.years || !Array.isArray(parsed.years)) throw new Error("Formato inválido");
          setData(parsed);
          setSelectedId(null);
          setArrows([]);
          showToast("Plan importado ✓");
        } catch {
          showToast("Archivo inválido", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <GlobalStyles />

      <ArrowOverlay arrows={arrows} animKey={animKey} />

      <div style={{ minHeight: "100vh", background: "#F5F2EC" }}>
        {/* Header */}
        <header style={{ borderBottom: "1px solid #D5D0C8", padding: "1.5rem 2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#bbb", textTransform: "uppercase", marginBottom: "0.3rem", fontFamily: "'DM Mono', monospace" }}>Gestión académica</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>Materias</h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button className="btn-ghost" onClick={importJSON} style={{ fontSize: "0.76rem", padding: "0.55rem 0.95rem" }}>↑ Importar</button>
            <button className="btn-ghost" onClick={exportJSON} style={{ fontSize: "0.76rem", padding: "0.55rem 0.95rem" }}>↓ Exportar</button>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Nueva materia</button>
          </div>
        </header>

        {/* Hint */}
        <div style={{ padding: "0.65rem 2rem", borderBottom: "1px solid #EAE6DF", fontSize: "0.68rem", color: "#bbb", letterSpacing: "0.03em", display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          <span>Clic en una materia para ver sus correlativas</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "#D97706", fontWeight: 700 }}>→</span> Regularizar</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "#059669", fontWeight: 700 }}>→</span> Aprobar</span>
        </div>

        {/* Grid */}
        <main ref={gridRef} style={{ padding: "2rem", overflowX: "auto", paddingBottom: "4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(175px, 1fr))", gap: "1.75rem", minWidth: 900 }}>
            {data.years.map(year => (
              <YearColumn
                key={year.id}
                year={year}
                isFirst={year.id === 1}
                selectedId={selectedId}
                highlightMap={highlightMap}
                dimmedIds={dimmedIds}
                onSelect={handleSelect}
                onDelete={handleDelete}
                registerRef={registerRef}
              />
            ))}
          </div>
        </main>
      </div>

      <AddModal open={modalOpen} onClose={() => setModalOpen(false)} data={data} onAdd={handleAdd} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}
