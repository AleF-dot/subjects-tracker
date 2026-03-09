import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import GlobalStyles  from "./components/GlobalStyles";
import Header        from "./components/Header";
import Legend        from "./components/Legend";
import YearColumn    from "./components/YearColumn";
import ArrowOverlay  from "./components/ArrowOverlay";
import StatusMenu    from "./components/StatusMenu";
import AddModal      from "./components/AddModal";
import Toast         from "./components/Toast";
import InfoModal     from "./components/InfoModal";

import { useCurriculumData } from "./hooks/useCurriculumData";
import { useArrows }         from "./hooks/useArrows";
import { useToast }          from "./hooks/useToast";
import { canAprobar, computeAllowedStatuses } from "./utils/statusLogic";

export default function App() {
  const {
    data, effectiveStatus, allSubjects,
    addSubject, editSubject, deleteSubject, setStatus,
    exportJSON, importJSON,
  } = useCurriculumData();

  const { toast, showToast } = useToast();

  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState({ subjectId: null, el: null });
  const [arrowFilter, setArrowFilter] = useState("T");
  const [newIds, setNewIds]         = useState(() => new Set());
  const [exitingIds, setExitingIds] = useState(() => new Set());

  const cardRefs = useRef({});
  const dotRefs  = useRef({});
  const gridRef  = useRef(null);

  const registerRef = useCallback((id, el) => {
    if (el) cardRefs.current[id] = el;
    else    delete cardRefs.current[id];
  }, []);

  const registerDotRef = useCallback((id, el) => {
    if (el) dotRefs.current[id] = el;
    else    delete dotRefs.current[id];
  }, []);

  const selectedSubject = allSubjects.find(s => s.id === selectedId) ?? null;
  const correlatives    = selectedSubject?.correlatives ?? [];
  const correlativesParaFinal = selectedSubject?.correlativesParaFinal ?? [];
  const allCorrelatives = (() => {
    const cursarIds = new Set(correlatives.map(c => c.subjectId));
    const finalItems = correlativesParaFinal.map(c => ({
      ...c,
      forFinal: true,
      offsetSide: cursarIds.has(c.subjectId) ? 1 : 0,
    }));
    return [
      ...correlatives.map(c => ({ ...c, forFinal: false, offsetSide: 0 })),
      ...finalItems,
    ];
  })();

  const filteredCorrelatives = allCorrelatives.filter(c => {
    if (arrowFilter === "C") return !c.forFinal;
    if (arrowFilter === "A") return c.forFinal;
    return true;
  });

  const { arrows, animKey } = useArrows({ selectedId, correlatives: filteredCorrelatives, cardRefs, dotRefs, gridRef });

  const highlightMap = {};
  correlatives.forEach(c => { highlightMap[c.subjectId] = { type: c.type }; });
  correlativesParaFinal.forEach(c => {
    if (!highlightMap[c.subjectId]) {
      highlightMap[c.subjectId] = { type: c.type, forFinal: true };
    }
  });

  const dimmedIds = new Set();
  if (selectedId) {
    data.years.forEach(y => {
      y.subjects.forEach(s => {
        if (s.id !== selectedId && !highlightMap[s.id]) dimmedIds.add(s.id);
      });
    });
  }

  // Listener global en "click" (no mousedown) para no competir con stopPropagation de React.
  // Cualquier click que no fue detenido por una card/chevron/menú → cierra todo.
  const menuPortalRef = useRef(null);

  useEffect(() => {
    const fn = e => {
      const inMenu = menuPortalRef.current?.contains(e.target);
      if (inMenu) return;
      // Llegó acá → el click no fue stopPropagation'd por ninguna card ni chevron
      setMenuAnchor({ subjectId: null, el: null });
      setSelectedId(null);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  /* ── Handlers ── */

  // Llamado por card click (no chevron).
  // - Card nueva (o distinta) → seleccionar + abrir menú
  // - Card ya seleccionada → deseleccionar + cerrar menú
  const handleCardClick = (id, cardEl) => {
    setSelectedId(prev => {
      if (prev === id) {
        setMenuAnchor({ subjectId: null, el: null });
        return null;
      }
      setArrowFilter("T");
      setMenuAnchor({ subjectId: id, el: cardEl });
      return id;
    });
  };

  // Llamado exclusivamente por el chevron: toggle del menú, selección intacta.
  const handleChevronToggle = (subjectId, cardEl) => {
    setMenuAnchor(prev =>
      prev.subjectId === subjectId
        ? { subjectId: null, el: null }
        : { subjectId, el: cardEl }
    );
  };

  const handleSetStatus = (subjectId, newStatus) => {
    setStatus(subjectId, newStatus);
    showToast(`${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} ✓`);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleDelete = (yearId, subjectId) => {
    setExitingIds(s => new Set([...s, subjectId]));
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
    setTimeout(() => {
      deleteSubject(yearId, subjectId);
      setExitingIds(s => { const n = new Set(s); n.delete(subjectId); return n; });
      showToast("Materia eliminada", "error");
    }, 280);
  };

  const handleAdd = (payload) => {
    const newId = addSubject(payload);
    showToast(`"${payload.name}" agregada`);
    setNewIds(s => new Set([...s, newId]));
    setTimeout(() => setNewIds(s => { const n = new Set(s); n.delete(newId); return n; }), 400);
  };

  const handleEdit = (payload) => {
    editSubject(payload);
    showToast(`"${payload.name}" actualizada ✓`);
  };

  const handleOpenEdit = (subjectId) => {
    const subject = allSubjects.find(s => s.id === subjectId);
    setEditingSubject(subject ?? null);
    setModalOpen(true);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleImport = () => importJSON(
    () => { setSelectedId(null); showToast("Plan importado ✓"); },
    () => showToast("Archivo inválido", "error")
  );

  const handleExport = () => { exportJSON(); showToast("JSON exportado"); };

  const counts = Object.values(effectiveStatus).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1; return acc;
  }, {});

  return (
    <>
      <GlobalStyles />
      <ArrowOverlay arrows={arrows} animKey={animKey} />

      <div style={{ minHeight: "100vh", background: "#F5F2EC" }}>
        <Header
          counts={counts}
          onImport={handleImport}
          onExport={handleExport}
          onNewSubject={() => { setEditingSubject(null); setModalOpen(true); }}
        />

        <Legend />

        <main style={{ padding: "2rem", paddingBottom: "4rem" }}>
          <div style={{ overflowX: "auto", overflowY: "visible", padding: "4px 4px", WebkitOverflowScrolling: "touch" }}>
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(160px, 1fr))", gap: "1.75rem", minWidth: "860px" }}>
              {data.years.map((year) => (
                <YearColumn
                  key={year.id}
                  year={year}
                  selectedId={selectedId}
                  highlightMap={highlightMap}
                  dimmedIds={dimmedIds}
                  statusMap={effectiveStatus}
                  onCardClick={handleCardClick}
                  onChevronToggle={handleChevronToggle}
                  onSetStatus={handleSetStatus}
                  onDelete={handleDelete}
                  registerRef={registerRef}
                  registerDotRef={registerDotRef}
                  arrowFilter={arrowFilter}
                  onArrowFilterChange={setArrowFilter}
                  selectedSubject={selectedSubject}
                  menuOpenId={menuAnchor.subjectId}
                  newIds={newIds}
                  exitingIds={exitingIds}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <AddModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSubject(null); }}
        data={data}
        onAdd={handleAdd}
        editSubject={editingSubject}
        onEdit={handleEdit}
      />

      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <footer style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "0.4rem",
        background: "linear-gradient(to top, #F5F2EC 60%, transparent)",
        zIndex: 400, pointerEvents: "none",
      }}>
        <div style={{ pointerEvents: "auto" }}>
          <InfoModal />
        </div>
      </footer>

      {menuAnchor.subjectId && menuAnchor.el && (() => {
        const sid     = menuAnchor.subjectId;
        const st      = effectiveStatus[sid];
        const yearId  = data.years.find(y => y.subjects.some(s => s.id === sid))?.id;
        const subject = allSubjects.find(s => s.id === sid);
        const allowedStatuses = subject
          ? computeAllowedStatuses(subject, effectiveStatus)
          : { disponible: true, cursando: true, regular: true, aprobada: true };
        const closeMenu = () => setMenuAnchor({ subjectId: null, el: null });
        return createPortal(
          <div ref={menuPortalRef} onClick={e => e.stopPropagation()}>
            <StatusMenu
              anchor={menuAnchor.el}
              current={st === "bloqueada" ? null : st}
              onSelect={s => handleSetStatus(sid, s)}
              onEdit={() => handleOpenEdit(sid)}
              onDelete={() => handleDelete(yearId, sid)}
              onClose={closeMenu}
              allowedStatuses={allowedStatuses}
            />
          </div>,
          document.body
        );
      })()}
    </>
  );
}
