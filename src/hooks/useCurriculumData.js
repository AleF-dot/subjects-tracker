import { useEffect } from "react";
import { useLocalData } from "./useLocalData";
import { useSupabaseSync } from "./useSupabaseSync";

export function useCurriculumData({ onSyncError } = {}) {
  const local = useLocalData();

  const { syncStatus, mergePrompt, resolveMerge, scheduleSync } = useSupabaseSync({
    data:       local.data,
    statusMap:  local.statusMap,
    replaceAll: local.replaceAll,
    onSyncError,
  });

  // Cada vez que cambian los datos locales, disparar sync
  useEffect(() => { scheduleSync(); }, [local.data, local.statusMap, scheduleSync]);

  return {
    data:            local.data,
    statusMap:       local.statusMap,
    effectiveStatus: local.effectiveStatus,
    allSubjects:     local.allSubjects,
    syncStatus,
    mergePrompt,
    resolveMerge,
    addSubject:    local.addSubject,
    editSubject:   local.editSubject,
    deleteSubject: local.deleteSubject,
    setStatus:     local.setStatus,
    reorderSubjects: local.reorderSubjects,
    exportJSON:    local.exportJSON,
    importJSON:    local.importJSON,
  };
}
