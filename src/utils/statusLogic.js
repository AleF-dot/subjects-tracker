/**
 * Computes the effective display status of a subject,
 * considering its correlatives and the current manual status map.
 */
export function computeStatus(subject, statusMap) {
  const manual = statusMap[subject.id] ?? null;
  const corrs = subject.correlatives ?? [];

  for (const c of corrs) {
    const depStatus = statusMap[c.subjectId] ?? "disponible";

    if (c.type === "regular") {
      if (!(depStatus === "regular" || depStatus === "aprobada")) return "bloqueada";
    }
    if (c.type === "aprobada") {
      if (depStatus !== "aprobada") return "bloqueada";
    }
  }

  return manual && manual !== "bloqueada" ? manual : "disponible";
}
