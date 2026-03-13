import React from 'react';
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
import EmptyState    from "./components/EmptyState";
import InfoModal     from "./components/InfoModal";
import AuthButton    from "./components/AuthButton";
import MergePromptModal from "./components/MergePromptModal";
import PlanSelectorModal from "./components/PlanSelectorModal";

import { useCurriculumData } from "./hooks/useCurriculumData";
import { useAuth } from "./context/AuthContext";
import { useArrows }         from "./hooks/useArrows";
import { useToast }          from "./hooks/useToast";
import { computeAllowedStatuses } from "./utils/statusLogic";
import { defaultData, STATUS } from "./utils/constants";

export default function App() {
  const { passwordRecovery } = useAuth();
  const { toast, showToast, dismissToast } = useToast();

  const {
    data, effectiveStatus, allSubjects, syncStatus,
    mergePrompt, resolveMerge,
    addSubject, editSubject, deleteSubject, setStatus,
    reorderSubjects, exportJSON, importJSON, replaceAll,
  } = useCurriculumData({
    onSyncError: (msg) => showToast(msg, "error", true),
    onSyncRecovered: () => dismissToast(),
  });

  const [selectedId, setSelectedId] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [planSelectorOpen, setPlanSelectorOpen] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState({ subjectId: null, el: null });
  const [arrowFilter, setArrowFilter] = useState("T");
  const [newIds, setNewIds]         = useState(() => new Set());
  const [exitingIds, setExitingIds] = useState(() => new Set());
  // Fix: estado para confirmación de eliminar materia
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { yearId, subjectId, name }

  useEffect(() => { if (passwordRecovery) setAuthModalOpen(true); }, [passwordRecovery]);

  const cardRefs           = useRef({});
  const dotRefs            = useRef({});
  const gridRef            = useRef(null);
  const scrollContainerRef = useRef(null);

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
    const finalItems = correlativesParaFinal.map(c => ({
      ...c,
      forFinal: true,
    }));
    return [
      ...correlatives.map(c => ({ ...c, forFinal: false })),
      ...finalItems,
    ];
  })();

  const filteredCorrelatives = allCorrelatives.filter(c => {
    if (arrowFilter === "C") return !c.forFinal;
    if (arrowFilter === "A") return c.forFinal;
    return true;
  });

  const { arrows, animKey, exiting, svgRef } = useArrows({
    selectedId,
    correlatives: filteredCorrelatives,
    cardRefs,
    dotRefs,
    gridRef,
    scrollContainerRef,
  });

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

  const menuPortalRef = useRef(null);

  useEffect(() => {
    const fn = e => {
      const inMenu = menuPortalRef.current?.contains(e.target);
      if (inMenu) return;
      setMenuAnchor({ subjectId: null, el: null });
      setSelectedId(null);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  /* ── Handlers ── */

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

  const handleChevronToggle = (subjectId, cardEl) => {
    setMenuAnchor(prev =>
      prev.subjectId === subjectId
        ? { subjectId: null, el: null }
        : { subjectId, el: cardEl }
    );
  };

  const handleSetStatus = (subjectId, newStatus) => {
    if (newStatus === "bloqueada") return;
    setStatus(subjectId, newStatus);
    // Fix: toast con nombre de materia + status
    const subjectName = allSubjects.find(s => s.id === subjectId)?.name ?? "";
    const statusLabel = STATUS[newStatus]?.label ?? newStatus;
    showToast(`${subjectName} → ${statusLabel}`);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  // Fix: delete pide confirmación antes de ejecutar
  const handleDeleteRequest = (yearId, subjectId) => {
    const subject = allSubjects.find(s => s.id === subjectId);
    setDeleteConfirm({ yearId, subjectId, name: subject?.name ?? "esta materia" });
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirm) return;
    const { yearId, subjectId } = deleteConfirm;
    setDeleteConfirm(null);
    setExitingIds(s => new Set([...s, subjectId]));
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
    showToast(`"${payload.name}" actualizada`);
  };

  const handleOpenEdit = (subjectId) => {
    const subject = allSubjects.find(s => s.id === subjectId);
    setEditingSubject(subject ?? null);
    setModalOpen(true);
    setSelectedId(null);
    setMenuAnchor({ subjectId: null, el: null });
  };

  const handleImport = () => importJSON(
    () => { setSelectedId(null); showToast("Plan importado"); },
    () => showToast("Archivo inválido", "error")
  );

  const handleExport = () => { exportJSON(); showToast("Plan exportado"); };

  const counts = Object.values(effectiveStatus).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1; return acc;
  }, {});

  return (
    <>
      <GlobalStyles />

      <div style={{ minHeight: "100vh", background: "var(--bg-card)" }}>
        <Header
          counts={counts}
          onSelectPlan={() => setPlanSelectorOpen(true)}
          onNewSubject={() => { setEditingSubject(null); setModalOpen(true); }}
        />

        <Legend showLegend={showLegend} onToggleLegend={() => setShowLegend(v => !v)} allSubjects={allSubjects} />

        <main style={{ padding: "2rem", paddingBottom: "4rem" }}>
          {allSubjects.length === 0 ? (
            <EmptyState onSelectPlan={() => setPlanSelectorOpen(true)} onNewSubject={() => { setEditingSubject(null); setModalOpen(true); }} />
          ) : (
          <div ref={scrollContainerRef} style={{ overflowX: "auto", overflowY: "visible", padding: "4px 4px", WebkitOverflowScrolling: "touch", position: "relative" }}>
            <ArrowOverlay arrows={arrows} animKey={animKey} exiting={exiting} svgRef={svgRef} containerRef={scrollContainerRef} />
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: `repeat(${data.years.filter(y => y.subjects.length > 0).length}, minmax(160px, 1fr))`, gap: "1.75rem", minWidth: `${data.years.filter(y => y.subjects.length > 0).length * 180}px`, animation: "gridFadeIn 0.35s ease both" }}>
              {data.years.filter(y => y.subjects.length > 0).map((year) => (
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
                  onDelete={handleDeleteRequest}
                  registerRef={registerRef}
                  registerDotRef={registerDotRef}
                  arrowFilter={arrowFilter}
                  onArrowFilterChange={setArrowFilter}
                  selectedSubject={selectedSubject}
                  menuOpenId={menuAnchor.subjectId}
                  newIds={newIds}
                  exitingIds={exitingIds}
                  onReorder={(fromIndex, toIndex) => reorderSubjects(year.id, fromIndex, toIndex)}
                  onDragStart={() => { setMenuAnchor({ subjectId: null, el: null }); setSelectedId(null); }}
                />
              ))}
            </div>
          </div>
          )}
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

      {toast && <Toast msg={toast.msg} type={toast.type} animKey={toast.key} />}

      <AuthButton showToast={showToast} syncStatus={syncStatus} forceOpen={authModalOpen} onForceOpenHandled={() => setAuthModalOpen(false)} />

      <MergePromptModal
        open={!!mergePrompt}
        onResolve={(choice) => {
          resolveMerge(choice);
          showToast(choice === "local" ? "Usando plan local" : "Usando plan de la nube");
        }}
      />

      {/* Fix: eliminado el footer con gradient no-op — InfoModal va directo */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "flex-end",
        padding: "3rem 0 0",
        zIndex: 400, pointerEvents: "none",
        overflow: "visible",
      }}>
        <div style={{ pointerEvents: "auto" }}>
          <InfoModal />
        </div>
      </div>

      {menuAnchor.subjectId && menuAnchor.el && scrollContainerRef.current && (() => {
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
              onDelete={() => handleDeleteRequest(yearId, sid)}
              onClose={closeMenu}
              allowedStatuses={allowedStatuses}
              scrollContainerRef={scrollContainerRef}
            />
          </div>,
          scrollContainerRef.current
        );
      })()}

      <PlanSelectorModal
        open={planSelectorOpen}
        onClose={() => setPlanSelectorOpen(false)}
        onImport={() => { setPlanSelectorOpen(false); handleImport(); }}
        onExport={() => { handleExport(); }}
        onLoadPlan={(plan) => { replaceAll(plan.data, {}); showToast("Plan cargado"); }}
        onClearPlan={() => { replaceAll(defaultData, {}); showToast("Plan eliminado"); }}
        hasData={allSubjects.length > 0}
      />

      {/* Fix: modal de confirmación para eliminar materia */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1200,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          animation: "fadeIn 0.15s ease",
        }}>
          <div
            onClick={() => setDeleteConfirm(null)}
            style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }}
          />
          <div style={{
            position: "relative", zIndex: 1,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "1.5rem",
            width: "100%", maxWidth: "320px",
            animation: "popUp 0.2s ease",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600, margin: "0 0 0.5rem" }}>
              ¿Eliminar materia?
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
              Se va a eliminar <strong>"{deleteConfirm.name}"</strong> y todas sus correlativas asociadas. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Cancelar</button>
              <button
                onClick={handleDeleteConfirmed}
                style={{
                  flex: 1, padding: "0.6rem 1rem",
                  background: "var(--status-bloqueada-dot)", border: "none",
                  borderRadius: "8px", cursor: "pointer",
                  color: "#fff", fontSize: "0.78rem", fontFamily: "inherit",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
