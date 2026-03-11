import React from 'react';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";

export default function AuthModal({ open, onClose, showToast }) {
  const [mode, setMode]         = useState("login"); // login | register | confirm | reset | newpassword
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  // Detectar cuando Supabase redirige tras reset de contraseña
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("newpassword");
        setError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const reset = () => {
    setMode("login"); setEmail(""); setPassword(""); setError(null); setLoading(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    setError(null);
    if (mode === "register" && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres."); return;
    }
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { setError("Correo o contraseña incorrectos."); return; }
      showToast?.("Sesión iniciada", "success");
      handleClose();
    } else if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        const msg = error.message.includes("already registered")
          ? "Ese correo ya tiene una cuenta."
          : (error.status === 429 || error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("too many"))
          ? "Demasiados intentos. Esperá unos minutos y volvé a intentarlo."
          : error.message;
        setError(msg); return;
      }
      showToast?.("Revisá tu correo para confirmar", "info");
      setMode("confirm");
    } else if (mode === "newpassword") {
      if (newPassword.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres."); setLoading(false); return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setLoading(false);
      if (error) { setError(error.message); return; }
      showToast?.("Contraseña actualizada", "success");
      setNewPassword("");
      handleClose();
    } else if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://subjects-tracker.vercel.app" });
      setLoading(false);
      if (error) {
        const msg = (error.status === 429 || error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("too many"))
          ? "Demasiados intentos. Esperá unos minutos y volvé a intentarlo."
          : error.message;
        setError(msg); return;
      }
      showToast?.("Te mandamos un mail para restablecer tu contraseña", "info");
      setMode("login");
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "var(--bg-elevated)", border: "1px solid var(--border)",
    borderRadius: "8px", padding: "0.75rem 1rem",
    fontSize: "0.88rem", color: "var(--text-primary)",
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const linkBtn = (label, onClick) => (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      color: "var(--text-secondary)", fontSize: "0.72rem",
      textDecoration: "underline", padding: 0,
    }}>{label}</button>
  );

  if (mode === "newpassword") return (
    <Modal open={open} onClose={() => {}} title="Nueva contraseña" hideClose lockClose>
      <div key="newpassword" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", animation: "panelIn 0.18s ease" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Ingresá tu nueva contraseña.
        </p>
        <input
          style={inputStyle}
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={e => { setNewPassword(e.target.value); setError(null); }}
          onFocus={e => e.target.style.borderColor = "var(--text-muted)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        {newPassword.length > 0 && newPassword.length < 6 && (
          <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", margin: 0 }}>Mínimo 6 caracteres</p>
        )}
        {error && <p style={{ fontSize: "0.75rem", color: "var(--status-bloqueada-dot)", margin: 0 }}>{error}</p>}
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading || newPassword.length < 6}
          style={{ opacity: (loading || newPassword.length < 6) ? 0.5 : 1, marginTop: "0.25rem" }}
        >
          {loading ? "..." : "Guardar contraseña"}
        </button>
      </div>
    </Modal>
  );

  if (mode === "confirm") return (
    <Modal open={open} onClose={handleClose} title="Verificá tu correo">
      <div key="confirm" style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: "panelIn 0.18s ease" }}>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Te mandamos un mail a <strong style={{ color: "var(--text-primary)" }}>{email}</strong>. Confirmá tu cuenta para continuar.
        </p>
        <button className="btn-ghost" onClick={() => setMode("login")} style={{ width: "100%" }}>
          Volver al inicio
        </button>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} title={
      mode === "login" ? "Iniciar sesión" :
      mode === "register" ? "Crear cuenta" :
      "Restablecer contraseña"
    }>
      <div key={mode} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", animation: "panelIn 0.18s ease" }}>
        <input
          style={inputStyle}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={e => e.target.style.borderColor = "var(--text-muted)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          autoFocus
        />

        {mode !== "reset" && (
          <input
            style={inputStyle}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={e => e.target.style.borderColor = "var(--text-muted)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        )}

        {mode === "register" && password.length > 0 && password.length < 6 && (
          <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", margin: 0 }}>
            Mínimo 6 caracteres
          </p>
        )}

        {error && <p style={{ fontSize: "0.75rem", color: "var(--status-bloqueada-dot)", margin: 0 }}>{error}</p>}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading || !email.trim() || (mode !== "reset" && !password.trim())}
          style={{ opacity: (loading || !email.trim() || (mode !== "reset" && !password.trim())) ? 0.5 : 1, marginTop: "0.25rem" }}
        >
          {loading ? "..." :
            mode === "login" ? "Ingresar" :
            mode === "register" ? "Crear cuenta" :
            "Enviar mail"}
        </button>

        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", margin: 0, display: "flex", justifyContent: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          {mode === "login" && <>
            {linkBtn("Registrate", () => { setMode("register"); setError(null); })}
            <span>·</span>
            {linkBtn("Olvidé mi contraseña", () => { setMode("reset"); setError(null); })}
          </>}
          {mode === "register" && <>
            ¿Ya tenés cuenta?{" "}
            {linkBtn("Ingresá", () => { setMode("login"); setError(null); })}
          </>}
          {mode === "reset" && <>
            {linkBtn("← Volver", () => { setMode("login"); setError(null); })}
          </>}
        </p>
      </div>
    </Modal>
  );
}
