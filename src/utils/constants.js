export const STORAGE_KEY = "curriculum_v6";
export const PREV_STORAGE_KEY = "curriculum_v5";
export const YEAR_LABELS = ["1er Año", "2do Año", "3er Año", "4to Año", "5to Año"];
export const defaultData = { years: YEAR_LABELS.map((label, i) => ({ id: i + 1, label, subjects: [] })) };
export const uid = () => crypto.randomUUID();

export const STATUS = {
  disponible: { label: "Disponible", bg: "var(--status-disponible-bg)", border: "var(--status-disponible-border)", dot: "var(--status-disponible-dot)", color: "var(--status-disponible-color)" },
  cursando:   { label: "Cursando",   bg: "var(--status-cursando-bg)",   border: "var(--status-cursando-border)",   dot: "var(--status-cursando-dot)",   color: "var(--status-cursando-color)"   },
  regular:    { label: "Regular",    bg: "var(--status-regular-bg)",    border: "var(--status-regular-border)",    dot: "var(--status-regular-dot)",    color: "var(--status-regular-color)"    },
  aprobada:   { label: "Aprobada",   bg: "var(--status-aprobada-bg)",   border: "var(--status-aprobada-border)",   dot: "var(--status-aprobada-dot)",   color: "var(--status-aprobada-color)"   },
  bloqueada:  { label: "Bloqueada",  bg: "var(--status-bloqueada-bg)",  border: "var(--status-bloqueada-border)",  dot: "var(--status-bloqueada-dot)",  color: "var(--status-bloqueada-color)"  },
};
export const STATUS_ORDER = ["disponible", "cursando", "regular", "aprobada"];
