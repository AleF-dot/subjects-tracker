/**
 * Computes the effective display status of a subject.
 *
 * correlatives        → bloquean la card si no satisfechas (bloqueo duro)
 * correlativesParaFinal → solo restringen el menú, nunca la card
 *
 * Si hay un status manual guardado, se valida que siga siendo consistente
 * con las correlativas actuales. Si no lo es, se degrada al status más alto
 * que sí sea válido dado el estado actual de las dependencias.
 */
export function computeStatus(subject, statusMap) {
  const manual = statusMap[subject.id] ?? null;
  const corrs = subject.correlatives ?? [];

  // ── 1. Verificar bloqueo duro (correlativas para cursar) ──────────────────
  for (const c of corrs) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular" && !(depStatus === "regular" || depStatus === "aprobada")) return "bloqueada";
    if (c.type === "aprobada" && depStatus !== "aprobada") return "bloqueada";
  }

  // Sin status manual → disponible
  if (!manual || manual === "bloqueada") return "disponible";

  // ── 2. Validar que el status manual sea alcanzable con las correlativas
  //       actuales. Si se editaron las correlativas, puede que el status
  //       manual ya no sea válido.
  // ── "cursando" y "regular" requieren que las correlativas para cursar
  //    estén ok (ya pasó el check de bloqueo duro si llegamos aquí).
  // ── "aprobada" requiere además que las correlativesParaFinal estén ok.
  if (manual === "aprobada") {
    if (!canAprobar(subject, statusMap)) {
      // No puede estar aprobada — degradar a regular si las corrs de cursar
      // están ok (ya lo están, porque pasamos el bloqueo duro).
      return "regular";
    }
  }

  return manual;
}

/**
 * Checks if a subject can be marked as "aprobada" given correlativesParaFinal.
 */
export function canAprobar(subject, statusMap) {
  const corrsParaFinal = subject.correlativesParaFinal ?? [];
  for (const c of corrsParaFinal) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular" && !(depStatus === "regular" || depStatus === "aprobada")) return false;
    if (c.type === "aprobada" && depStatus !== "aprobada") return false;
  }
  return true;
}

/**
 * Returns which statuses are selectable in the menu for a given subject.
 * { cursando: bool, regular: bool, aprobada: bool }
 */
export function computeAllowedStatuses(subject, statusMap) {
  const corrs = subject.correlatives ?? [];

  let cursarOk = true;
  for (const c of corrs) {
    const dep = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular" && !(dep === "regular" || dep === "aprobada")) { cursarOk = false; break; }
    if (c.type === "aprobada" && dep !== "aprobada") { cursarOk = false; break; }
  }

  if (!cursarOk) return { disponible: false, cursando: false, regular: false, aprobada: false };

  const aprobada = canAprobar(subject, statusMap);
  return { disponible: true, cursando: true, regular: true, aprobada };
}
