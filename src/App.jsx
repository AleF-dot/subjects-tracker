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

import { useCurriculumData } from "./hooks/useCurriculumData";
import { useArrows }         from "./hooks/useArrows";
import { useToast }          from "./hooks/useToast";
import { canAprobar, computeAllowedStatuses }        from "./utils/statusLogic";

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

  const cardRefs = useRef({});
  const gridRef  = useRef(null);

  const registerRef = useCallback((id, el) => {
    if (el) cardRefs.current[id] = el;
    else    delete cardRefs.current[id];
  }, []);

  // Correlatives of the selected subject
  const selectedSubject = allSubjects.find(s => s.id === selectedId) ?? null;
  const correlatives    = selectedSubject?.correlatives ?? [];
  const correlativesParaFinal = selectedSubject?.correlativesParaFinal ?? [];
  const allCorrelatives = (() => {
    // Armamos la lista combinada con IDs únicos para que el arrow hook
    // no duplique y para poder diferenciar cursar vs final cuando apuntan
    // a la misma materia.
    const cursarIds = new Set(correlatives.map(c => c.subjectId));
    const finalItems = correlativesParaFinal.map(c => ({
      ...c,
      forFinal: true,
      // Si esta materia YA aparece en correlatives (cursar), marcamos offset
      // para que arrowHelpers pueda separar los trazos lateralmente.
      offsetSide: cursarIds.has(c.subjectId) ? 1 : 0,
    }));
    return [
      ...correlatives.map(c => ({ ...c, forFinal: false, offsetSide: 0 })),
      ...finalItems,
    ];
  })();

  const { arrows, animKey } = useArrows({ selectedId, correlatives: allCorrelatives, cardRefs, gridRef });

  // Highlight map: subjects required by the selected one
  const highlightMap = {};
  correlatives.forEach(c => { highlightMap[c.subjectId] = { type: c.type }; });
  correlativesParaFinal.forEach(c => {
    if (!highlightMap[c.subjectId]) {
      highlightMap[c.subjectId] = { type: c.type, forFinal: true };
    }
  });

  // Dim other subjects in the same year
  const selectedYear = data.years.find(y => y.subjects.some(s => s.id === selectedId));
  const dimmedIds    = new Set();
  if (selectedYear) {
    selectedYear.subjects.forEach(s => {
      if (s.id !== selectedId && !highlightMap[s.id]) dimmedIds.add(s.id);
    });
  }

  // Click outside grid/menu → deselect
  const menuPortalRef = useRef(null);
  useEffect(() => {
    const fn = e => {
      const inGrid = gridRef.current?.contains(e.target);
      const inMenu = menuPortalRef.current?.contains(e.target);
      if (!inGrid && !inMenu) {
        setSelectedId(null);
        setMenuAnchor({ subjectId: null, el: null });
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ── Handlers ── */
  const handleCardClick = (id) => {
    setSelectedId(prev => {
      if (prev === id) { setMenuAnchor({ subjectId: null, el: null }); return null; }
      return id;
    });
  };

  const handleOpenMenu = (subjectId, el) => setMenuAnchor({ subjectId, el });

  const handleSetStatus = (subjectId, newStatus) => {
    setStatus(subjectId, newStatus);
    showToast(`${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} ✓`);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleDelete = (yearId, subjectId) => {
    deleteSubject(yearId, subjectId);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
    showToast("Materia eliminada", "error");
  };

  const handleAdd = (payload) => {
    addSubject(payload);
    showToast(`"${payload.name}" agregada`);
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

  // Stats for header
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
          <div style={{ overflowX: "auto" }}>
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.75rem", width: "100%" }}>
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

      {/* Status menu rendered as portal to escape overflow/transform contexts */}
      {menuAnchor.subjectId && menuAnchor.el && (() => {
        const sid    = menuAnchor.subjectId;
        const st     = effectiveStatus[sid];
        const yearId = data.years.find(y => y.subjects.some(s => s.id === sid))?.id;
        const subject = allSubjects.find(s => s.id === sid);
        const allowedStatuses = subject ? computeAllowedStatuses(subject, effectiveStatus) : { cursando: true, regular: true, aprobada: true };
        const closeMenu = () => { setMenuAnchor({ subjectId: null, el: null }); setSelectedId(null); };
        return createPortal(
          <div ref={menuPortalRef}>
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
