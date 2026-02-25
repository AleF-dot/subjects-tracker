import { useState, useEffect } from "react";
import Modal from "./Modal";

const lbl = {
  fontSize: "0.7rem", color: "#999", letterSpacing: "0.09em",
  textTransform: "uppercase", display: "block", marginBottom: "0.35rem",
};

export default function AddModal({ open, onClose, data, onAdd }) {
  const [yearId, setYearId]     = useState(1);
  const [name, setName]         = useState("");
  const [corrList, setCorrList] = useState([]);
  const [corrSub, setCorrSub]   = useState("");
  const [corrType, setCorrType] = useState("regular");
  const [error, setError]       = useState("");

  useEffect(() => {
    if (open) {
      setYearId(1); setName(""); setCorrList([]);
      setCorrSub(""); setCorrType("regular"); setError("");
    }
  }, [open]);

  const allSubjects = data.years.flatMap(y => y.subjects);

  const subjectsByYear = data.years.map(y => ({
    ...y,
    subjects: y.subjects.filter(s => !corrList.find(c => c.subjectId === s.id)),
  })).filter(y => y.subjects.length > 0);

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

  return (
    <Modal open={open} onClose={onClose} title="Nueva materia">
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
          <input
            autoFocus className="input-field" value={name} placeholder="Ej: Álgebra I"
            onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>

        {/* Correlativas */}
        {allSubjects.length > 0 && (
          <div>
            <label style={lbl}>Correlativas (opcional)</label>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <select className="select-field" style={{ flex: 1 }} value={corrSub} onChange={e => setCorrSub(e.target.value)}>
                <option value="">Seleccionar materia...</option>
                {subjectsByYear.map(y => (
                  <optgroup key={y.id} label={y.label}>
                    {y.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </optgroup>
                ))}
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
                  const sub   = allSubjects.find(s => s.id === c.subjectId);
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

        {error && <div style={{ fontSize: "0.73rem", color: "#b44" }}>{error}</div>}

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.25rem" }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
          <button className="btn-primary" onClick={submit} style={{ flex: 2 }}>Agregar materia</button>
        </div>
      </div>
    </Modal>
  );
}
