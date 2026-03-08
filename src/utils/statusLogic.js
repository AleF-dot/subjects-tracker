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

/**
 * Checks correlatives para cursar/regularizar.
 * "cursando" requires nothing (you can always start attending).
 * "regular" requires all correlatives type "regular" → regular|aprobada, type "aprobada" → aprobada.
 * Returns { cursando: bool, regular: bool, aprobada: bool }
 */
export function computeAllowedStatuses(subject, statusMap) {
  const corrs = subject.correlatives ?? [];

  // cursando: siempre permitido (podés anotarte aunque no tengas correlativas)
  const cursando = true;

  // regular: necesita las correlativas de cursar satisfechas
  let regular = true;
  for (const c of corrs) {
    const dep = statusMap[c.subjectId] ?? "disponible";
    if (c.type === "regular" && !(dep === "regular" || dep === "aprobada")) { regular = false; break; }
    if (c.type === "aprobada" && dep !== "aprobada") { regular = false; break; }
  }

  // aprobada: correlativas de cursar + correlativas para final
  const aprobada = regular && canAprobar(subject, statusMap);

  return { cursando, regular, aprobada };
}
