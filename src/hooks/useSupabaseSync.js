import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { migrateData } from "./useLocalData";

const DEBOUNCE_MS    = 800;
const MAX_WAIT_MS    = 5000;
const RETRY_DELAYS   = [5_000, 15_000, 30_000];
const PENDING_KEY    = "_hasPendingLocalChanges";

// ── Helpers ────────────────────────────────────────────────────────────────

function snapshotEqual(a, b, smA, smB) {
  // Compara subjects estructuralmente
  const extractSubjects = d => d.years
    .flatMap(y => y.subjects.map(s => ({
      id: s.id, name: s.name, yearId: y.id,
      corr:  JSON.stringify(s.correlatives ?? []),
      final: JSON.stringify(s.correlativesParaFinal ?? []),
    })))
    .sort((x, y) => x.id.localeCompare(y.id));

  if (JSON.stringify(extractSubjects(a)) !== JSON.stringify(extractSubjects(b))) return false;

  // Fix: también comparar statusMap para detectar cambios de estado entre dispositivos
  const sortedSM = sm => JSON.stringify(Object.entries(sm).sort(([ka], [kb]) => ka.localeCompare(kb)));
  return sortedSM(smA) === sortedSM(smB);
}

async function upsert(userId, data, statusMap) {
  return supabase.from("curricula").upsert(
    { user_id: userId, data: { ...data, statusMap }, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useSupabaseSync({ data, statusMap, replaceAll, onSyncError, onSyncRecovered }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [syncStatus,  setSyncStatus]  = useState("idle");
  const [mergePrompt, setMergePrompt] = useState(null);

  // Refs — evitan dependencias stale en callbacks
  const ready        = useRef(false);
  const merging      = useRef(false);
  const retryCount   = useRef(0);
  const latestData   = useRef(data);
  const latestStatus = useRef(statusMap);
  const latestUserId      = useRef(userId);
  const latestAccessToken = useRef(session?.access_token ?? null);
  const syncTimer    = useRef(null);
  const maxTimer     = useRef(null);
  const retryTimer   = useRef(null);
  const lastSync     = useRef(0);
  const syncPending  = useRef(false);
  const onErrorRef     = useRef(onSyncError);
  const onRecoveredRef = useRef(onSyncRecovered);
  const mergeDataRef  = useRef(null);

  useEffect(() => { latestData.current        = data;                          }, [data]);
  useEffect(() => { latestStatus.current      = statusMap;                     }, [statusMap]);
  useEffect(() => { latestUserId.current      = userId;                        }, [userId]);
  useEffect(() => { latestAccessToken.current = session?.access_token ?? null; }, [session]);
  useEffect(() => { onErrorRef.current        = onSyncError;       }, [onSyncError]);
  useEffect(() => { onRecoveredRef.current    = onSyncRecovered;   }, [onSyncRecovered]);
  useEffect(() => { mergeDataRef.current      = mergePrompt;                   }, [mergePrompt]);

  // ── push ──────────────────────────────────────────────────────────────
  const push = useCallback(async () => {
    const uid = latestUserId.current;
    if (!uid) return;
    if (merging.current) return;

    setSyncStatus("pending");
    const { error } = await upsert(uid, latestData.current, latestStatus.current);

    if (error) {
      console.error("Sync error:", error);
      setSyncStatus("error");

      const delay = RETRY_DELAYS[retryCount.current] ?? null;
      const msg = delay
        ? `Error al guardar. Reintentando en ${delay / 1000}s...`
        : "Error al guardar. No se pudo sincronizar.";
      onErrorRef.current?.(msg);

      if (delay !== null) {
        retryCount.current += 1;
        retryTimer.current = setTimeout(push, delay);
      } else {
        retryCount.current = 0;
      }
    } else {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
      lastSync.current    = Date.now();
      retryCount.current  = 0;
      syncPending.current = false;
      localStorage.removeItem(PENDING_KEY);
      onRecoveredRef.current?.();
      setSyncStatus("idle");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doSync = useCallback(() => {
    clearTimeout(syncTimer.current); syncTimer.current = null;
    clearTimeout(maxTimer.current);  maxTimer.current  = null;
    push();
  }, [push]);

  // ── scheduleSync ──────────────────────────────────────────────────────
  const scheduleSync = useCallback(() => {
    if (!latestUserId.current || !ready.current || merging.current) return;

    clearTimeout(retryTimer.current);
    retryTimer.current = null;
    retryCount.current = 0;

    setSyncStatus("pending");
    syncPending.current = true;
    localStorage.setItem(PENDING_KEY, "1");
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(doSync, DEBOUNCE_MS);

    if (!maxTimer.current) {
      const elapsed   = Date.now() - lastSync.current;
      const remaining = Math.max(0, MAX_WAIT_MS - elapsed);
      maxTimer.current = setTimeout(doSync, remaining);
    }
  }, [doSync]);

  // ── Al loguearse / desloguearse ───────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      ready.current   = false;
      merging.current = false;
      setMergePrompt(null);
      setSyncStatus("idle");
      clearTimeout(syncTimer.current);
      clearTimeout(maxTimer.current);
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
      retryCount.current = 0;
      return;
    }

    ready.current   = false;
    merging.current = false;
    setSyncStatus("pending");

    clearTimeout(syncTimer.current);  syncTimer.current  = null;
    clearTimeout(maxTimer.current);   maxTimer.current   = null;
    clearTimeout(retryTimer.current); retryTimer.current = null;
    retryCount.current  = 0;
    syncPending.current = false;

    const loadingForUserId = userId;

    supabase
      .from("curricula")
      .select("user_id, data")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (latestUserId.current !== loadingForUserId) return;

        if (error) {
          console.error("Error cargando desde Supabase:", error);
          setSyncStatus("error");
          ready.current = true;
          return;
        }

        if (row && row.user_id !== latestUserId.current) {
          console.error("Supabase devolvió un row de otro usuario — abortando carga.");
          setSyncStatus("error");
          ready.current = true;
          return;
        }

        if (!row?.data) {
          ready.current = true;
          push();
          return;
        }

        const { statusMap: cloudSM, ...rest } = row.data;
        const cloudData      = migrateData(rest) ?? rest;
        const cloudStatusMap = cloudSM ?? {};

        // Fix: comparar también statusMap para detectar cambios de estado entre dispositivos
        const hasMismatch = !snapshotEqual(latestData.current, cloudData, latestStatus.current, cloudStatusMap);

        if (hasMismatch) {
          const hadPendingChanges = localStorage.getItem(PENDING_KEY);
          if (hadPendingChanges) {
            // Los datos locales son más nuevos (el usuario hizo cambios y recargó
            // antes de que el sync terminara). Confiamos en lo local y subimos.
            localStorage.removeItem(PENDING_KEY);
            ready.current = true;
            push();
          } else {
            // Diferencia genuina (ej: otro dispositivo guardó datos distintos).
            // Preguntar al usuario con cuál versión se queda.
            merging.current = true;
            setMergePrompt({ cloudData, cloudStatusMap });
            setSyncStatus("idle");
          }
        } else {
          ready.current = true;
          setSyncStatus("idle");
        }
      });
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolveMerge = useCallback((choice) => {
    const { cloudData, cloudStatusMap } = mergeDataRef.current ?? {};
    if (!cloudData) return;

    merging.current = false;
    ready.current   = true;
    setMergePrompt(null);
    mergeDataRef.current = null;

    if (choice === "cloud") {
      replaceAll(cloudData, cloudStatusMap);
      setSyncStatus("idle");
    } else {
      push();
    }
  }, [replaceAll, push]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onUnload = () => {
      if (!syncPending.current) return;
      if (!latestUserId.current || !ready.current) return;

      clearTimeout(syncTimer.current); syncTimer.current = null;
      clearTimeout(maxTimer.current);  maxTimer.current  = null;

      const url        = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/curricula`;
      const anonKey    = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const authToken  = latestAccessToken.current ?? anonKey;

      fetch(`${url}?on_conflict=user_id`, {
        method: "POST", keepalive: true,
        headers: {
          "Content-Type":  "application/json",
          "apikey":        anonKey,
          "Authorization": `Bearer ${authToken}`,
          "Prefer":        "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          user_id:    latestUserId.current,
          data:       { ...latestData.current, statusMap: latestStatus.current },
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { syncStatus, mergePrompt, resolveMerge, scheduleSync };
}
