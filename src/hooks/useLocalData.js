import { useState } from "react";
import { STORAGE_KEY, PREV_STORAGE_KEY, defaultData } from "../utils/constants";
import { computeStatus } from "../utils/statusLogic";
import { uid } from "../utils/constants";

// ── Helpers ────────────────────────────────────────────────────────────────

function loadFromStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export function migrateData(raw) {
  if (!raw || !Array.isArray(raw.years)) return null;
  return {
    ...raw,
    years: raw.years.map(y => ({
      ...y,
      subjects: (y.subjects ?? []).map(s => ({ correlativesParaFinal: [], ...s })),
    })),
  };
}

export function loadLocalData() {
  const v6 = loadFromStorage(STORAGE_KEY, null);
  if (v6) return migrateData(v6) ?? defaultData;
  const v5 = loadFromStorage(PREV_STORAGE_KEY, null);
  if (v5) { const m = migrateData(v5); if (m) return m; }
  return defaultData;
}

export function loadLocalStatus() {
  const v6 = loadFromStorage(STORAGE_KEY + "_status", null);
  if (v6) return v6;
  return loadFromStorage(PREV_STORAGE_KEY + "_status", {});
}

export function hasLocalData() {
  return loadLocalData().years.some(y => y.subjects.length > 0);
}

function computeEffectiveStatus(allSubjects, statusMap) {
  const subjectMap = Object.fromEntries(allSubjects.map(s => [s.id, s]));

  // Orden topológico: deps primero
  const visited = new Set();
  const result  = [];
  const visit = (s) => {
    if (visited.has(s.id)) return;
    visited.add(s.id);
    for (const c of [...(s.correlatives ?? []), ...(s.correlativesParaFinal ?? [])]) {
      if (subjectMap[c.subjectId]) visit(subjectMap[c.subjectId]);
    }
    result.push(s);
  };
  allSubjects.forEach(visit);

  // Primera pasada: aplicar statusMap manual como punto de partida
  const effectiveStatus = {};
  result.forEach(s => { effectiveStatus[s.id] = statusMap[s.id] ?? "disponible"; });

  // Segunda pasada: propagar bloqueos y degradaciones en orden topológico
  // Se repite hasta que no haya más cambios (necesario para cadenas largas)
  let changed = true;
  let iterations = 0;
  while (changed && iterations < allSubjects.length) {
    changed = false;
    iterations++;
    result.forEach(s => {
      const prev = effectiveStatus[s.id];
      const next = computeStatus(s, effectiveStatus);
      if (next !== prev) {
        effectiveStatus[s.id] = next;
        changed = true;
      }
    });
  }

  return effectiveStatus;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useLocalData() {
  const [data, setData]           = useState(() => loadLocalData());
  const [statusMap, setStatusMap] = useState(() => loadLocalStatus());

  const setDataAndSave = (updater) => {
    setData(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const setStatusAndSave = (updater) => {
    setStatusMap(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY + "_status", JSON.stringify(next));
      return next;
    });
  };

  const replaceAll = (newData, newStatusMap) => {
    setDataAndSave(newData);
    setStatusAndSave(newStatusMap ?? {});
  };

  const allSubjects    = data.years.flatMap(y => y.subjects);
  const effectiveStatus = computeEffectiveStatus(allSubjects, statusMap);

  const addSubject = ({ yearId, name, correlatives, correlativesParaFinal }) => {
    const newId = uid();
    setDataAndSave(d => ({
      ...d,
      years: d.years.map(y =>
        y.id === yearId
          ? { ...y, subjects: [...y.subjects, { id: newId, name, correlatives, correlativesParaFinal: correlativesParaFinal ?? [] }] }
          : y
      ),
    }));
    return newId;
  };

  const editSubject = ({ subjectId, name, correlatives, correlativesParaFinal }) => {
    setDataAndSave(d => ({
      ...d,
      years: d.years.map(y => ({
        ...y,
        subjects: y.subjects.map(s =>
          s.id === subjectId
            ? { ...s, name, correlatives, correlativesParaFinal: correlativesParaFinal ?? [] }
            : s
        ),
      })),
    }));
  };

  const deleteSubject = (yearId, subjectId) => {
    setDataAndSave(d => ({
      ...d,
      years: d.years.map(y => ({
        ...y,
        subjects: y.id === yearId
          ? y.subjects.filter(s => s.id !== subjectId)
          : y.subjects.map(s => ({
              ...s,
              correlatives: (s.correlatives ?? []).filter(c => c.subjectId !== subjectId),
              correlativesParaFinal: (s.correlativesParaFinal ?? []).filter(c => c.subjectId !== subjectId),
            })),
      })),
    }));
    setStatusAndSave(m => { const n = { ...m }; delete n[subjectId]; return n; });
  };

  const setStatus = (subjectId, newStatus) => {
    setStatusAndSave(m => {
      const n = { ...m };
      if (newStatus === "disponible") {
        delete n[subjectId]; // disponible es el default, no hace falta guardarlo
      } else {
        n[subjectId] = newStatus;
      }
      return n;
    });
  };

  const exportJSON = () => {
    const payload = { ...data, statusMap };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plan_de_estudios.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (onSuccess, onError) => {
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
          replaceAll(migrateData(rest) ?? rest, sm ?? {});
          onSuccess?.();
        } catch { onError?.(); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return {
    data, statusMap, effectiveStatus, allSubjects,
    replaceAll, addSubject, editSubject, deleteSubject, setStatus,
    exportJSON, importJSON,
  };
}
