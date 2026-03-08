export const STORAGE_KEY = "curriculum_v6";
export const PREV_STORAGE_KEY = "curriculum_v5";
export const YEAR_LABELS = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];
export const defaultData = { years: YEAR_LABELS.map((label, i) => ({ id: i + 1, label, subjects: [] })) };
export const uid = () => Math.random().toString(36).slice(2, 9);

export const STATUS = {
  disponible: { label: "Disponible", color: "#4B5563", bg: "#E5E7EB", border: "#9CA3AF", dot: "#6B7280" },
  cursando:   { label: "Cursando",   color: "#0259A8", bg: "#BFDBFE", border: "#3B82F6", dot: "#2563EB" },
  regular:    { label: "Regular",    color: "#92400E", bg: "#FDE68A", border: "#F59E0B", dot: "#D97706" },
  aprobada:   { label: "Aprobada",   color: "#064E3B", bg: "#A7F3D0", border: "#10B981", dot: "#059669" },
  bloqueada:  { label: "Bloqueada",  color: "#7F1D1D", bg: "#FECACA", border: "#EF4444", dot: "#DC2626" },
};
export const STATUS_ORDER = ["disponible", "cursando", "regular", "aprobada"];
