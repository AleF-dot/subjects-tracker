import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { migrateData } from "./useLocalData";

const DEBOUNCE_MS    = 800;
const MAX_WAIT_MS    = 5000;
const RETRY_DELAYS   = [5_000, 15_000, 30_000];

// ── Helpers ────────────────────────────────────────────────────────────────

function subjectsEqual(a, b) {
  const extract = d => d.years
    .flatMap(y => y.subjects.map(s => ({
      id: s.id, name: s.name, yearId: y.id,
      corr:  JSON.stringify(s.correlatives ?? []),
      final: JSON.stringify(s.correlativesParaFinal ?? []),
    })))
    .sort((x, y) => x.id.localeCompare(y.id));
  return JSON.stringify(extract(a)) === JSON.stringify(extract(b));
}

async function upsert(userId, data, statusMap) {
  return supabase.from("curricula").upsert(
    { user_id: userId, data: { ...data, statusMap }, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useSupabaseSync({ data, statusMap, replaceAll, onSyncError }) {
  const { session, isFreshLogin } = useAuth();
  const userId = session?.user?.id ?? null;

  const [syncStatus,  setSyncStatus]  = useState("idle");
  const [mergePrompt, setMergePrompt] = useState(null);

  // Refs — evitan dependencias stale en callbacks
  const ready        = useRef(false);   // carga inicial terminada
  const merging      = useRef(false);   // esperando que el user resuelva el merge
  const retryCount   = useRef(0);
  const latestData   = useRef(data);
  const latestStatus = useRef(statusMap);
  const latestUserId      = useRef(userId);
  const latestAccessToken = useRef(session?.access_token ?? null);
  const isFreshLoginRef   = useRef(isFreshLogin); // ref para evitar stale closure en el efecto de login
  const syncTimer    = useRef(null);
  const maxTimer     = useRef(null);
  const retryTimer   = useRef(null);
  const lastSync     = useRef(0);
  const syncPending  = useRef(false); // true cuando hay cambios sin confirmar en supabase
  const onErrorRef    = useRef(onSyncError);
  const mergeDataRef  = useRef(null); // { cloudData, cloudStatusMap }

  useEffect(() => { latestData.current        = data;                          }, [data]);
  useEffect(() => { latestStatus.current      = statusMap;                     }, [statusMap]);
  useEffect(() => { latestUserId.current      = userId;                        }, [userId]);
  useEffect(() => { latestAccessToken.current = session?.access_token ?? null; }, [session]);
  useEffect(() => { isFreshLoginRef.current   = isFreshLogin;                  }, [isFreshLogin]);
  useEffect(() => { onErrorRef.current        = onSyncError;                   }, [onSyncError]);
  useEffect(() => { mergeDataRef.current      = mergePrompt;                   }, [mergePrompt]);

  // ── push: envía a Supabase, maneja error/retry/recovery ──────────────
  const push = useCallback(async () => {
    const uid = latestUserId.current;
    if (!uid) return;
    if (merging.current) return; // no pisar la nube mientras el usuario resuelve un merge

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
        retryCount.current = 0; // se rindió — queda el botón manual
      }
    } else {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
      lastSync.current    = Date.now();
      retryCount.current  = 0;
      syncPending.current = false;

      setSyncStatus("idle");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Intencional: push accede a datos siempre frescos via refs (latestData, latestStatus,
  // latestUserId, onErrorRef). Incluirlos como deps provocaría recrear push en cada cambio
  // de datos, reiniciando los timers de retry en curso.
  const doSync = useCallback(() => {
    clearTimeout(syncTimer.current); syncTimer.current = null;
    clearTimeout(maxTimer.current);  maxTimer.current  = null;
    push();
  }, [push]);

  // ── scheduleSync: debounce + maxWait ─────────────────────────────────
  const scheduleSync = useCallback(() => {
    if (!latestUserId.current || !ready.current || merging.current) return;

    // Cambio manual cancela retry pendiente y arranca desde cero
    clearTimeout(retryTimer.current);
    retryTimer.current = null;
    retryCount.current = 0;

    setSyncStatus("pending");
    syncPending.current = true;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(doSync, DEBOUNCE_MS);

    if (!maxTimer.current) {
      const elapsed   = Date.now() - lastSync.current;
      const remaining = Math.max(0, MAX_WAIT_MS - elapsed);
      maxTimer.current = setTimeout(doSync, remaining);
    }
  }, [doSync]);

  // ── Al loguearse ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      ready.current   = false;
      merging.current = false;
      setMergePrompt(null);
      setSyncStatus("idle");
      clearTimeout(syncTimer.current);
      clearTimeout(maxTimer.current);
      clearTimeout(retryTimer.current); // fix: cancelar retry pendiente al desloguearse
      retryTimer.current = null;
      retryCount.current = 0;
      return;
    }

    ready.current   = false;
    merging.current = false;
    setSyncStatus("pending");

    // Cancelar cualquier sync pendiente — la carga desde cloud tiene prioridad.
    // Si había cambios locales sin guardar, el merge prompt o el push post-carga los maneja.
    clearTimeout(syncTimer.current);  syncTimer.current  = null;
    clearTimeout(maxTimer.current);   maxTimer.current   = null;
    clearTimeout(retryTimer.current); retryTimer.current = null;
    retryCount.current  = 0;
    syncPending.current = false;

    // Token de cancelación: si el usuario cambia antes de que termine
    // la query, el .then() detecta que ya no es el usuario activo y aborta.
    const loadingForUserId = userId;

    supabase
      .from("curricula")
      .select("user_id, data")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data: row, error }) => {
        // Abortar si el usuario cambió mientras la query estaba en vuelo
        if (latestUserId.current !== loadingForUserId) {
          // El bloque de logout ya limpió los timers y el estado — nada más que hacer
          return;
        }

        if (error) {
          console.error("Error cargando desde Supabase:", error);
          setSyncStatus("error");
          ready.current = true;
          return;
        }

        // Defensa extra: verificar que el row pertenece al usuario activo
        if (row && row.user_id !== latestUserId.current) {
          console.error("Supabase devolvió un row de otro usuario — abortando carga.");
          setSyncStatus("error");
          ready.current = true;
          return;
        }

        if (!row?.data) {
          // Cuenta nueva — subir local directo
          ready.current = true;
          push();
          return;
        }

        const { statusMap: cloudSM, ...rest } = row.data;
        const cloudData      = migrateData(rest) ?? rest;
        const cloudStatusMap = cloudSM ?? {};

        const hasMismatch = !subjectsEqual(latestData.current, cloudData);

        if (isFreshLoginRef.current && hasMismatch) {
          // Login real con diferencias — preguntar al usuario
          merging.current = true;
          setMergePrompt({ cloudData, cloudStatusMap });
          setSyncStatus("idle");
        } else if (hasMismatch) {
          // Restauración de sesión con diferencias — cloud gana silenciosamente
          replaceAll(cloudData, cloudStatusMap);
          ready.current = true;
          setSyncStatus("idle");
        } else {
          // Sin diferencias — no hace falta reemplazar nada, solo marcar ready
          ready.current = true;
          setSyncStatus("idle");
        }
      });
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Intencional: el efecto solo debe re-ejecutarse cuando cambia el usuario (login/logout).
  // push, replaceAll e isFreshLogin son estables o se leen via ref; incluirlos causaría
  // recargas innecesarias desde Supabase ante cada cambio de datos local.
  const resolveMerge = useCallback((choice) => {
    const { cloudData, cloudStatusMap } = mergeDataRef.current ?? {};
    if (!cloudData) return;

    if (choice === "cloud") replaceAll(cloudData, cloudStatusMap);

    merging.current = false;
    ready.current   = true;
    setMergePrompt(null);
    mergeDataRef.current = null;
    push();
  }, [replaceAll, push]); // eslint-disable-line react-hooks/exhaustive-deps
  // Intencional: mergeDataRef.current se lee en el momento de ejecución; no es una dep
  // de useCallback porque es un ref mutable, no estado React.
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
  // Intencional: el listener se registra una sola vez. Todos los valores necesarios
  // (syncPending, latestUserId, latestAccessToken, latestData, latestStatus) se leen
  // via refs, por lo que siempre están frescos sin necesidad de re-registrar el listener.

  return { syncStatus, mergePrompt, resolveMerge, scheduleSync };
}
