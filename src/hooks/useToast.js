import { useState, useRef } from "react";

export function useToast(duration = 2500) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (msg, type = "ok", persistent = false) => {
    clearTimeout(timerRef.current);
    setToast({ msg, type, persistent, key: Date.now() }); // key nuevo = re-anima
    if (!persistent) {
      timerRef.current = setTimeout(() => setToast(null), duration);
    }
  };

  const updateToast = (msg, type, persistent = false) => {
    clearTimeout(timerRef.current);
    setToast(prev => prev ? { ...prev, msg, type, persistent } : { msg, type, persistent, key: Date.now() });
    if (!persistent) {
      timerRef.current = setTimeout(() => setToast(null), duration);
    }
  };

  const dismissToast = () => {
    clearTimeout(timerRef.current);
    setToast(null);
  };

  return { toast, showToast, updateToast, dismissToast };
}
