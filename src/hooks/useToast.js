import { useState } from "react";

export function useToast(duration = 2000) {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
  };

  return { toast, showToast };
}
