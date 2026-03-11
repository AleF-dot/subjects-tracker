/**
 * Computes the effective display status of a subject.
 *
 * correlatives          → bloquean la card si no satisfechas (bloqueo duro)
 * correlativesParaFinal → solo restringen el menú, nunca la card
 *
 * IMPORTANTE: statusMap contiene los estados manuales declarados por el usuario.
 * effectiveStatus es el resultado de aplicar la lógica de bloqueo sobre statusMap.
 * computeStatus SIEMPRE debe recibir effectiveStatus (ya calculado para las deps),
 * nunca statusMap crudo — de lo contrario una materia bloqueada puede "pasar" su
 * estado manual a sus dependientes, causando el bug de propagación incorrecta.
 */
export function computeStatus(subject, effectiveStatus) {
  const manual = effectiveStatus[subject.id] ?? null;
  const corrs  = subject.correlatives ?? [];

  // ── 1. Bloqueo duro: correlativas para cursar ─────────────────────────────
  for (const c of corrs) {
    const dep = effectiveStatus[c.subjectId] ?? "disponible";
    if (c.type === "regular"  && dep !== "regular"  && dep !== "aprobada") return "bloqueada";
    if (c.type === "aprobada" && dep !== "aprobada")                        return "bloqueada";
  }

  // Sin estado manual → disponible
  if (!manual || manual === "bloqueada") return "disponible";

  // ── 2. Validar que el estado manual siga siendo alcanzable ────────────────
  if (manual === "aprobada" && !canAprobar(subject, effectiveStatus)) {
    // No puede estar aprobada — degradar a regular
    // (las corrs para cursar ya están ok porque pasamos el bloqueo duro)
    return "regular";
  }

  return manual;
}

/**
 * Checks if a subject can be marked as "aprobada" given correlativesParaFinal.
 * Recibe effectiveStatus, no statusMap crudo.
 */
export function canAprobar(subject, effectiveStatus) {
  for (const c of (subject.correlativesParaFinal ?? [])) {
    const dep = effectiveStatus[c.subjectId] ?? "disponible";
    if (c.type === "regular"  && dep !== "regular"  && dep !== "aprobada") return false;
    if (c.type === "aprobada" && dep !== "aprobada")                        return false;
  }
  return true;
}

/**
 * Returns which statuses are selectable in the menu for a given subject.
 * Recibe effectiveStatus para que el menú refleje la realidad actual.
 */
export function computeAllowedStatuses(subject, effectiveStatus) {
  let cursarOk = true;
  for (const c of (subject.correlatives ?? [])) {
    const dep = effectiveStatus[c.subjectId] ?? "disponible";
    if (c.type === "regular"  && dep !== "regular"  && dep !== "aprobada") { cursarOk = false; break; }
    if (c.type === "aprobada" && dep !== "aprobada")                        { cursarOk = false; break; }
  }

  if (!cursarOk) return { disponible: false, cursando: false, regular: false, aprobada: false };

  return {
    disponible: true,
    cursando:   true,
    regular:    true,
    aprobada:   canAprobar(subject, effectiveStatus),
  };
}
