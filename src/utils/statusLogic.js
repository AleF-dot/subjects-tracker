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
 * Detecta si agregar las correlatividades `newCorrelatives` y `newCorrelativesParaFinal`
 * a la materia `subjectId` crearía un ciclo en el grafo de dependencias.
 *
 * Construye un grafo completo con todos los subjects existentes, reemplazando
 * las correlativas de `subjectId` con las nuevas (para validar antes de guardar).
 *
 * Retorna `true` si hay ciclo, `false` si el grafo es acíclico.
 */
export function wouldCreateCycle(subjectId, newCorrelatives, newCorrelativesParaFinal, allSubjects) {
  // Construir mapa de adyacencia: id → [ids de los que depende]
  const deps = {};
  for (const s of allSubjects) {
    const corrIds = s.id === subjectId
      ? [
          ...(newCorrelatives ?? []).map(c => c.subjectId),
          ...(newCorrelativesParaFinal ?? []).map(c => c.subjectId),
        ]
      : [
          ...(s.correlatives ?? []).map(c => c.subjectId),
          ...(s.correlativesParaFinal ?? []).map(c => c.subjectId),
        ];
    deps[s.id] = corrIds;
  }

  // DFS desde subjectId buscando si podemos llegar de vuelta a él
  const visited = new Set();
  const stack   = [...(deps[subjectId] ?? [])];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === subjectId) return true;  // ciclo encontrado
    if (visited.has(current)) continue;
    visited.add(current);
    for (const dep of (deps[current] ?? [])) stack.push(dep);
  }
  return false;
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
