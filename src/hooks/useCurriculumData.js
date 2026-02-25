import { useState, useEffect } from "react";
import { STORAGE_KEY, defaultData } from "../utils/constants";
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

export function useCurriculumData() {
  const [data, setData] = useState(() => loadFromStorage(STORAGE_KEY, defaultData));
  const [statusMap, setStatusMap] = useState(() => loadFromStorage(STORAGE_KEY + "_status", {}));

  // Persist on change
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY + "_status", JSON.stringify(statusMap)); }, [statusMap]);

  const allSubjects = data.years.flatMap(y => y.subjects);

  // Compute effective (displayed) status for every subject
  const effectiveStatus = {};
  allSubjects.forEach(s => {
    effectiveStatus[s.id] = computeStatus(s, { ...effectiveStatus, ...statusMap });
  });

  const addSubject = ({ yearId, name, correlatives }) => {
    setData(d => ({
      ...d,
      years: d.years.map(y =>
        y.id === yearId
          ? { ...y, subjects: [...y.subjects, { id: uid(), name, correlatives }] }
          : y
      ),
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
              correlatives: (s.correlatives || []).filter(c => c.subjectId !== subjectId),
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
          setData(rest);
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
    deleteSubject,
    setStatus,
    exportJSON,
    importJSON,
  };
}
