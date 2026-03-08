/**
 * Computes the effective display status of a subject,
 * considering its correlatives and the current manual status map.
 *
 * correlatives        → para cursar / regularizar
 * correlativesParaFinal → para rendir el final (solo bloquea si el status manual es "aprobada")
 */
export function computeStatus(subject, statusMap) {
  const manual = statusMap[subject.id] ?? null;
  const corrs = subject.correlatives ?? [];

  // Check correlativas para cursar/regularizar — bloquean siempre
  for (const c of corrs) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular") {
      if (!(depStatus === "regular" || depStatus === "aprobada")) return "bloqueada";
    }
    if (c.type === "aprobada") {
      if (depStatus !== "aprobada") return "bloqueada";
    }
  }

  // Check correlativas para final — solo bloquean si el usuario intenta marcar como "aprobada"
  // En el status efectivo no bloqueamos la card (el usuario puede estar cursando/regular),
  // pero marcamos con "finalBloqueado" para que la UI lo muestre.
  // El bloqueo real de "aprobada" se maneja en el handler de setStatus.
  const corrsParaFinal = subject.correlativesParaFinal ?? [];
  if (manual === "aprobada") {
    for (const c of corrsParaFinal) {
      const depStatus = statusMap[c.subjectId] ?? "disponible";
      if (c.type === "regular") {
        if (!(depStatus === "regular" || depStatus === "aprobada")) return "bloqueada";
      }
      if (c.type === "aprobada") {
        if (depStatus !== "aprobada") return "bloqueada";
      }
    }
  }

  return manual && manual !== "bloqueada" ? manual : "disponible";
}

/**
 * Checks if a subject can be marked as "aprobada" given correlativesParaFinal.
 * Returns true if allowed, false if blocked.
 */
export function canAprobar(subject, statusMap) {
  const corrsParaFinal = subject.correlativesParaFinal ?? [];
  for (const c of corrsParaFinal) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular") {
      if (!(depStatus === "regular" || depStatus === "aprobada")) return false;
    }
    if (c.type === "aprobada") {
      if (depStatus !== "aprobada") return false;
    }
  }
  return true;
}
