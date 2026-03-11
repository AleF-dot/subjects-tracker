import React from 'react';
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SYNC_DOT = {
  idle:    null,
  pending: "#FBBF24",
  success: "#34D399",
  error:   "#F87171",
};

export default function AuthButton({ showToast, syncStatus = "idle", forceOpen = false, onForceOpenHandled }) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      onForceOpenHandled?.();
    }
  }, [forceOpen]);
  const [displayStatus, setDisplayStatus] = useState(syncStatus);
  const successTimer = useRef(null);
  const prevStatus = useRef(syncStatus);

  // Cuando pasa de pending/error a idle, mostrar verde brevemente
  useEffect(() => {
    const prev = prevStatus.current;
    prevStatus.current = syncStatus;

    if (syncStatus === "idle" && (prev === "pending" || prev === "error")) {
      setDisplayStatus("success");
      clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setDisplayStatus("idle"), 1500);
    } else {
      setDisplayStatus(syncStatus);
    }
  }, [syncStatus]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast?.("Sesión cerrada", "error");
  };

  const isLoggedIn = !!session;
  const dotColor = isLoggedIn ? SYNC_DOT[displayStatus] : null;

  return (
    <>
      <button
        onClick={isLoggedIn ? handleLogout : () => setOpen(true)}
        title={isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
        style={{
          position: "fixed", bottom: "1rem", right: "1rem", zIndex: 600,
          width: "40px", height: "40px", borderRadius: "30%",
          border: "1px solid var(--border-menu)",
          background: "var(--menu-bg)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.14)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: isLoggedIn ? "var(--text-muted)" : "var(--text-secondary)",
          transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.18)";
          e.currentTarget.style.background = "var(--menu-hover)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.14)";
          e.currentTarget.style.background = "var(--menu-bg)";
        }}
      >
        <span style={{ display: "flex", animation: "fadeIn 0.2s ease" }} key={isLoggedIn ? "out" : "in"}>
          {isLoggedIn ? <IconLogout /> : <IconPerson />}
        </span>

        {dotColor && (
          <span style={{
            position: "absolute", top: "6px", right: "6px",
            width: "7px", height: "7px", borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 4px ${dotColor}`,
            animation: displayStatus === "pending" ? "syncPulse 1.2s ease infinite" : "fadeIn 0.2s ease",
          }} />
        )}
      </button>

      <AuthModal open={open} onClose={() => setOpen(false)} showToast={showToast} />
    </>
  );
}
