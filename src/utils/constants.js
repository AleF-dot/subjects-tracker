export const STORAGE_KEY = "curriculum_v5";
export const YEAR_LABELS = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];
export const defaultData = { years: YEAR_LABELS.map((label, i) => ({ id: i + 1, label, subjects: [] })) };
export const uid = () => Math.random().toString(36).slice(2, 9);

export const STATUS = {
  disponible: { label: "Disponible", color: "#6B7280", bg: "#F3F4F6", border: "#D1D5DB", dot: "#9CA3AF" },
  cursando:   { label: "Cursando",   color: "#0369A1", bg: "#E0F2FE", border: "#7DD3FC", dot: "#38BDF8" },
  regular:    { label: "Regular",    color: "#9A3412", bg: "#FEF3C7", border: "#FCD34D", dot: "#F59E0B" },
  aprobada:   { label: "Aprobada",   color: "#065F46", bg: "#D1FAE5", border: "#6EE7B7", dot: "#10B981" },
  bloqueada:  { label: "Bloqueada",  color: "#991B1B", bg: "#FEE2E2", border: "#FCA5A5", dot: "#EF4444" },
};
export const STATUS_ORDER = ["disponible", "cursando", "regular", "aprobada"];
