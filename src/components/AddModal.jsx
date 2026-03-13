import React from 'react';
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { wouldCreateCycle } from "../utils/statusLogic";

const lbl = {
  fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.09em",
  textTransform: "uppercase", display: "block", marginBottom: "0.35rem",
};

const corrItemStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: "var(--bg-elevated)", borderRadius: "6px", padding: "0.4rem 0.65rem",
};

// Colores consistentes con ArrowOverlay
// Colores leídos desde CSS vars para respetar modo daltonismo
function getCorrelativeColors() {
  const s = typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const cv = (n) => s?.getPropertyValue(n).trim() || "#888";
  return {
    cursar: { regular: cv("--arrow-regular-cursar"), aprobada: cv("--arrow-aprobada-cursar") },
    final:  { regular: cv("--arrow-regular-final"),  aprobada: cv("--arrow-aprobada-final") },
  };
}

function CorrSection({ allSubjects, subjectsByYear, list, setList, forFinal }) {
  const [corrSub, setCorrSub] = useState("");
  const [corrType, setCorrType] = useState("regular");

  const available = subjectsByYear.map(y => ({
    ...y,
    subjects: y.subjects.filter(s => !list.find(c => c.subjectId === s.id)),
  })).filter(y => y.subjects.length > 0);

  const addCorr = () => {
    if (!corrSub) return;
    setList(l => [...l, { subjectId: corrSub, type: corrType }]);
    setCorrSub("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <select className="select-field" style={{ flex: 1 }} value={corrSub} onChange={e => setCorrSub(e.target.value)}>
          <option value="">Seleccionar materia...</option>
          {available.map(y => (
            <optgroup key={y.id} label={y.label}>
              {y.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </optgroup>
          ))}
        </select>
        <select className="select-field" style={{ width: "auto", minWidth: 110 }} value={corrType} onChange={e => setCorrType(e.target.value)}>
          <option value="regular">Regular</option>
          <option value="aprobada">Aprobada</option>
        </select>
        <button className="btn-primary" onClick={addCorr} disabled={!corrSub} style={{ padding: "0.65rem 0.85rem", opacity: corrSub ? 1 : 0.4 }}>+</button>
      </div>

      {list.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {list.map(c => {
            const sub = allSubjects.find(s => s.id === c.subjectId);
            const isReg = c.type === "regular";
            const cc = getCorrelativeColors(); const colors = forFinal ? cc.final : cc.cursar;
            const arrowColor = colors[c.type];
            return (
              <div key={c.subjectId} style={corrItemStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {forFinal ? (
                    // Flecha punteada SVG para final, igual que en ArrowOverlay
                    <svg width="18" height="10" viewBox="0 0 18 10" style={{ flexShrink: 0 }}>
                      <line x1="0" y1="5" x2="11" y2="5"
                        stroke={arrowColor} strokeWidth="1.8"
                        strokeDasharray="3 2.5" strokeLinecap="round" />
                      <polygon points="11,2 18,5 11,8" fill={arrowColor} />
                    </svg>
                  ) : (
                    <svg width="18" height="10" viewBox="0 0 18 10" style={{ flexShrink: 0 }}>
                      <line x1="0" y1="5" x2="11" y2="5"
                        stroke={arrowColor} strokeWidth="1.8" strokeLinecap="round" />
                      <polygon points="11,2 18,5 11,8" fill={arrowColor} />
                    </svg>
                  )}
                  <span style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>
                    {isReg ? "Regular" : "Aprobada"} · {sub?.name}
                  </span>
                </div>
                <button onClick={() => setList(l => l.filter(x => x.subjectId !== c.subjectId))}
                  style={{ background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", fontSize: "0.78rem" }}>✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AddModal({ open, onClose, data, onAdd, editSubject, onEdit }) {
  const isEdit = !!editSubject;

  const [yearId, setYearId]               = useState(1);
  const [name, setName]                   = useState("");
  const [corrList, setCorrList]           = useState([]);
  const [corrFinalList, setCorrFinalList] = useState([]);
  const [error, setError]                 = useState("");

  // Ref para detectar cambios en editSubject sin usar JSON.stringify como dep
  const prevEditSubjectRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const prev = prevEditSubjectRef.current;
    const changed = editSubject?.id !== prev?.id
      || editSubject?.name !== prev?.name
      || JSON.stringify(editSubject?.correlatives) !== JSON.stringify(prev?.correlatives)
      || JSON.stringify(editSubject?.correlativesParaFinal) !== JSON.stringify(prev?.correlativesParaFinal);

    prevEditSubjectRef.current = editSubject ?? null;

    if (isEdit && changed) {
      const year = data.years.find(y => y.subjects.some(s => s.id === editSubject.id));
      setYearId(year?.id ?? 1);
      setName(editSubject.name);
      setCorrList(editSubject.correlatives ?? []);
      setCorrFinalList(editSubject.correlativesParaFinal ?? []);
    } else if (!isEdit) {
      setYearId(1); setName(""); setCorrList([]); setCorrFinalList([]);
    }
    setError("");
  }, [open, editSubject?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // Intencional: la comparacion profunda de correlativas se hace manualmente via ref
  // para evitar JSON.stringify como dep de useEffect (anti-patron: crea un string nuevo
  // en cada render aunque los datos no hayan cambiado).

  const allSubjects = data.years.flatMap(y => y.subjects).filter(s =>
    !isEdit || s.id !== editSubject?.id
  );

  const subjectsByYear = data.years.map(y => ({
    ...y,
    subjects: y.subjects.filter(s => !isEdit || s.id !== editSubject?.id),
  })).filter(y => y.subjects.length > 0);

  const submit = () => {
    const t = name.trim();
    if (!t) { setError("El nombre no puede estar vacío."); return; }
    const allSubjectsIncludingSelf = data.years.flatMap(y => y.subjects);
    const duplicate = allSubjectsIncludingSelf.find(
      s => s.name.toLowerCase() === t.toLowerCase() && (!isEdit || s.id !== editSubject?.id)
    );
    if (duplicate) { setError("Ya existe una materia con ese nombre."); return; }

    const subjectId = isEdit ? editSubject.id : "__new__";
    const allForCycleCheck = isEdit
      ? allSubjectsIncludingSelf
      : [...allSubjectsIncludingSelf, { id: "__new__", correlatives: [], correlativesParaFinal: [] }];

    if (wouldCreateCycle(subjectId, corrList, corrFinalList, allForCycleCheck)) {
      setError("Las correlatividades crearían una dependencia circular. Revisá la configuración.");
      return;
    }

    if (isEdit) {
      onEdit({ subjectId: editSubject.id, yearId, name: t, correlatives: corrList, correlativesParaFinal: corrFinalList });
    } else {
      onAdd({ yearId, name: t, correlatives: corrList, correlativesParaFinal: corrFinalList });
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar materia" : "Nueva materia"}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Año */}
        <div>
          <label style={lbl}>Año</label>
          <select className="select-field" value={yearId} onChange={e => setYearId(Number(e.target.value))}>
            {data.years.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
          </select>
        </div>

        {/* Nombre */}
        <div>
          <label style={lbl}>Nombre de la materia</label>
          <input autoFocus className="input-field" value={name} placeholder="Ej: Álgebra I"
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {/* Correlativas para cursar */}
        {allSubjects.length > 0 && (
          <div style={{ borderTop: "1px solid #E0DAD0", paddingTop: "0.85rem" }}>
            <label style={{ ...lbl, color: "var(--text-muted)", marginBottom: "0.6rem" }}>
              Para <strong>cursar / regularizar</strong>
            </label>
            <CorrSection allSubjects={allSubjects} subjectsByYear={subjectsByYear} list={corrList} setList={setCorrList} />
          </div>
        )}

        {/* Correlativas para final */}
        {allSubjects.length > 0 && (
          <div style={{ borderTop: "1px solid #E0DAD0", paddingTop: "0.85rem" }}>
            <label style={{ ...lbl, color: "var(--text-muted)", marginBottom: "0.6rem" }}>
              Para <strong>aprobar</strong>
            </label>
            <CorrSection allSubjects={allSubjects} subjectsByYear={subjectsByYear} list={corrFinalList} setList={setCorrFinalList} forFinal />
          </div>
        )}

        {error && <div style={{ fontSize: "0.73rem", color: "var(--status-bloqueada-dot)" }}>{error}</div>}

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.25rem" }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
          <button className="btn-primary" onClick={submit} style={{ flex: 2 }}>
            {isEdit ? "Guardar cambios" : "Agregar materia"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
