import { useState, useEffect } from "react";
import { STORAGE_KEY, PREV_STORAGE_KEY, defaultData } from "../utils/constants";
import { computeStatus } from "../utils/statusLogic";
import { uid } from "../utils/constants";

function loadFromStorage(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Migración suave: agrega campos nuevos a materias existentes sin tocar
 * lo que el usuario ya tenía configurado.
 */
function migrateData(raw) {
  if (!raw || !Array.isArray(raw.years)) return null;
  return {
    ...raw,
    years: raw.years.map(y => ({
      ...y,
      subjects: (y.subjects ?? []).map(s => ({
        correlativesParaFinal: [],   // nuevo campo — safe default
        ...s,                         // datos del usuario sobrescriben el default
      })),
    })),
  };
}

function loadData() {
  // Intentar cargar v6 primero
  const v6 = loadFromStorage(STORAGE_KEY, null);
  if (v6) return migrateData(v6) ?? defaultData;

  // Si no hay v6, intentar migrar desde v5
  const v5 = loadFromStorage(PREV_STORAGE_KEY, null);
  if (v5) {
    const migrated = migrateData(v5);
    if (migrated) return migrated;
  }

  return defaultData;
}

function loadStatusMap() {
  // Intentar v6 primero, luego v5 como fallback
  const v6 = loadFromStorage(STORAGE_KEY + "_status", null);
  if (v6) return v6;
  return loadFromStorage(PREV_STORAGE_KEY + "_status", {});
}

export function useCurriculumData() {
  const [data, setData] = useState(() => loadData());
  const [statusMap, setStatusMap] = useState(() => loadStatusMap());

  // Persist on change
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + "_status", JSON.stringify(statusMap)); }, [statusMap]);

  const allSubjects = data.years.flatMap(y => y.subjects);

  // Compute effective (displayed) status for every subject.
  // Sort topologically so dependencies are resolved before dependents.
  // Any cycle or unresolvable node falls back to end of list.
  const topoSorted = (() => {
    const subjectMap = Object.fromEntries(allSubjects.map(s => [s.id, s]));
    const visited = new Set();
    const result = [];
    const visit = (s) => {
      if (visited.has(s.id)) return;
      visited.add(s.id);
      const deps = [
        ...(s.correlatives ?? []),
        ...(s.correlativesParaFinal ?? []),
      ];
      for (const c of deps) {
        if (subjectMap[c.subjectId]) visit(subjectMap[c.subjectId]);
      }
      result.push(s);
    };
    allSubjects.forEach(visit);
    return result;
  })();

  const effectiveStatus = {};
  topoSorted.forEach(s => {
    effectiveStatus[s.id] = computeStatus(s, { ...effectiveStatus, ...statusMap });
  });

  const addSubject = ({ yearId, name, correlatives, correlativesParaFinal }) => {
    const newId = uid();
    setData(d => ({
      ...d,
      years: d.years.map(y =>
        y.id === yearId
          ? { ...y, subjects: [...y.subjects, { id: newId, name, correlatives, correlativesParaFinal: correlativesParaFinal ?? [] }] }
          : y
      ),
    }));
    return newId;
  };

  const editSubject = ({ subjectId, yearId, name, correlatives, correlativesParaFinal }) => {
    setData(d => ({
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
    setData(d => ({
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
    setStatusMap(m => { const n = { ...m }; delete n[subjectId]; return n; });
  };

  const setStatus = (subjectId, newStatus) => {
    setStatusMap(m => ({ ...m, [subjectId]: newStatus }));
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
          const migrated = migrateData(rest);
          setData(migrated ?? rest);
          setStatusMap(sm ?? {});
          onSuccess?.();
        } catch { onError?.(); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return {
    data,
    statusMap,
    effectiveStatus,
    allSubjects,
    addSubject,
    editSubject,
    deleteSubject,
    setStatus,
    exportJSON,
    importJSON,
  };
}
