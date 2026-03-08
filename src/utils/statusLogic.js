/**
 * Computes the effective display status of a subject.
 *
 * correlatives        → bloquean la card si no satisfechas (bloqueo duro)
 * correlativesParaFinal → solo restringen el menú, nunca la card
 */
export function computeStatus(subject, statusMap) {
  const manual = statusMap[subject.id] ?? null;
  const corrs = subject.correlatives ?? [];

  for (const c of corrs) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular" && !(depStatus === "regular" || depStatus === "aprobada")) return "bloqueada";
    if (c.type === "aprobada" && depStatus !== "aprobada") return "bloqueada";
  }

  return manual && manual !== "bloqueada" ? manual : "disponible";
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
