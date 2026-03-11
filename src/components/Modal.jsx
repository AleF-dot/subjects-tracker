import React from 'react';
import { useEffect, useState } from "react";

export default function Modal({ open, onClose, children, title, hideClose = false, lockClose = false }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(false);
    } else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  useEffect(() => {
    if (!visible || !lockClose) return;
    const onKeyDown = (e) => { if (e.key === "Escape") e.stopPropagation(); };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [visible, lockClose]);

  if (!visible) return null;

  const closing = animating && !open;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 900,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "1rem",
      overflowY: "auto",
      animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
    }}>
      <div
        onClick={lockClose ? undefined : onClose}
        style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }}
      />
      <div style={{
        position: "relative",
        background: "var(--bg)", border: "1px solid #D5D0C8",
        borderRadius: "12px", padding: "2rem",
        width: "100%", maxWidth: "480px",
        margin: "auto",
        animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>{title}</h3>
          {!hideClose && <button onClick={onClose} style={{ background: "var(--bg-elevated)", border: "none", width: 28, height: 28, borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>✕</button>}
        </div>
        {children}
      </div>
    </div>
  );
}
