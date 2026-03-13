import React from 'react';
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const DALTON_OPTIONS = [
  { value: "none",          label: "Clásica"  },
  { value: "oceano",        label: "Vívida"   },
  { value: "deuteranopia",  label: "Cálida"   },
  { value: "achromatopsia", label: "Gris"     },
];

function ExtraModal({ open, onClose }) {
  const { daltonType, setDaltonType } = useTheme();
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  React.useEffect(() => {
    if (open) { setVisible(true); setAnimating(false); }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;
  const closing = animating && !open;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
      animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
    }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", zIndex: 1,
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "1.25rem 1.5rem",
        width: "100%", maxWidth: "320px",
        animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "0.75rem", right: "0.75rem",
            background: "var(--bg-elevated)", border: "none",
            width: 26, height: 26, borderRadius: "6px",
            cursor: "pointer", fontSize: "0.8rem", color: "var(--text-muted)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
        >✕</button>

        <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
          Paleta de colores
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {DALTON_OPTIONS.map(opt => {
            const active = daltonType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setDaltonType(opt.value)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: active ? "var(--bg-hover)" : "var(--bg-elevated)",
                  border: active ? "1px solid var(--text-muted)" : "1px solid var(--border)",
                  borderRadius: "8px", padding: "0.55rem 0.8rem",
                  cursor: "pointer", transition: "all 0.15s", boxSizing: "border-box",
                  textAlign: "left",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "var(--bg-elevated)"; }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                  <span style={{ fontSize: "0.78rem", color: active ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: active ? 500 : 400 }}>
                    {opt.label}
                  </span>
                </span>
                {active && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flexShrink: 0 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";

const MAIL = "subjectstracker@gmail.com";

const PRIVACY_TEXT = "Los datos del plan de estudios se guardan en el almacenamiento local del navegador. Si iniciás sesión, también se sincronizan en servidores de Supabase (AWS) para permitir el acceso desde múltiples dispositivos. Solo se almacena tu dirección de correo electrónico y los datos de tu plan académico. Podés usar la app sin cuenta — en ese caso ningún dato sale de tu dispositivo.";

function PrivacyModal({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  React.useEffect(() => {
    if (open) { setVisible(true); setAnimating(false); }
    else if (visible) {
      setAnimating(true);
      const t = setTimeout(() => { setVisible(false); setAnimating(false); }, 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;
  const closing = animating && !open;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
      animation: closing ? "fadeOut 0.18s ease forwards" : "fadeIn 0.15s ease",
    }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "var(--modal-backdrop)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", zIndex: 1,
        background: "var(--bg)", border: "1px solid var(--border)",
        borderRadius: "12px", padding: "1.25rem 1.5rem",
        width: "100%", maxWidth: "340px",
        animation: closing ? "modalOut 0.18s ease forwards" : "popUp 0.2s ease",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "0.75rem", right: "0.75rem",
            background: "var(--bg-elevated)", border: "none",
            width: 26, height: 26, borderRadius: "6px",
            cursor: "pointer", fontSize: "0.8rem", color: "var(--text-muted)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
        >✕</button>
        <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, paddingRight: "1.5rem" }}>
          {PRIVACY_TEXT}
        </p>
      </div>
    </div>
  );
}

export default function InfoModal() {
  const [open, setOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { session } = useAuth();
  const [deleteStep, setDeleteStep] = useState(0); // 0: idle, 1: confirm, 2: deleting
  const [deleteError, setDeleteError] = useState(null);

  const handleDeleteAccount = async () => {
    setDeleteStep(2);
    setDeleteError(null);
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      setDeleteError("No se pudo eliminar la cuenta. Intentá de nuevo.");
      setDeleteStep(1);
      return;
    }
    await supabase.auth.signOut();
    setDeleteStep(0);
    setOpen(false);
  };
  const [form, setForm] = useState({ name: "", message: "" });
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "Subjects Tracker", text: "Seguí tu plan de estudios y correlatividades — UNR / UTN", url }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const section = (title, children) => (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{
        fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--text-muted)", fontFamily: "'DM Mono', monospace", marginBottom: "0.45rem",
      }}>
        {title}
      </div>
      {children}
    </div>
  );

  const prose = (text) => (
    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{text}</p>
  );

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "var(--bg-elevated)", border: "1px solid var(--border)",
    borderRadius: "7px", padding: "0.55rem 0.7rem",
    fontSize: "0.78rem", color: "var(--text-primary)",
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const gmailHref = () => {
    const subject = encodeURIComponent(`Reporte, pregunta o sugerencia de ${form.name || "usuario"}`);
    const body = encodeURIComponent(form.message);
    return `mailto:${MAIL}?subject=${subject}&body=${body}`;
  };

  const handleSend = () => {
    if (!form.message.trim()) return;
    window.location.href = gmailHref();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "var(--menu-bg)",
          border: "1px solid var(--border-menu)",
          borderBottom: "none",
          borderRadius: "10px 10px 0 0",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.12)",
          cursor: "pointer",
          padding: "0.55rem 1.4rem 2rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          transform: "translateY(14px)",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 -8px 24px rgba(0,0,0,0.18)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(14px)"; e.currentTarget.style.boxShadow = "0 -4px 16px rgba(0,0,0,0.12)"; }}
      >
<span style={{
          fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
          fontFamily: "'DM Mono', monospace", color: "var(--text-muted)",
        }}>
          Información
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Información">
        <div style={{ display: "flex", flexDirection: "column" }}>

          {section("Acerca de", <>
            {prose("El tracker académico es una herramienta gratuita pensada para estudiantes de la UNR y UTN. Permite visualizar y gestionar el plan de estudios y sus correlatividades.")}
          </>)}

          {section("Apariencia", <>
            <button
              onClick={toggle}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", background: "var(--bg-elevated)",
                border: "1px solid var(--border)", borderRadius: "8px",
                padding: "0.6rem 0.8rem", cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
            >
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {dark ? "🌙" : "☀️"} {dark ? "Modo oscuro" : "Modo claro"}
              </span>
              <span style={{
                width: "36px", height: "20px", borderRadius: "10px",
                background: dark ? "var(--btn-primary-bg)" : "var(--border)",
                position: "relative", display: "inline-block",
                transition: "background 0.2s", flexShrink: 0,
              }}>
                <span style={{
                  position: "absolute", top: "3px",
                  left: dark ? "19px" : "3px",
                  width: "14px", height: "14px", borderRadius: "50%",
                  background: dark ? "var(--btn-primary-fg)" : "var(--bg-card)",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </span>
            </button>
          </>)}

          {section("Compartir", <>
            <button
              className="btn-ghost"
              onClick={handleShare}
              style={{ fontSize: "0.78rem", padding: "0.5rem 1rem", width: "100%" }}
            >
              {copied ? "Link copiado" : "Compartir el Tracker Académico ⤴"}
            </button>
          </>)}

          {section("Contacto", <>
            <div className="contact-row" style={{
              background: "var(--bg-elevated)", borderRadius: "8px", padding: "0.55rem 0.8rem",
            }}>
              <span style={{
                fontSize: "0.75rem", color: "var(--text-secondary)",
                fontFamily: "'DM Mono', monospace",
                flex: "1 1 auto", minWidth: 0,
                overflowWrap: "break-word", wordBreak: "break-all",
              }}>
                {MAIL}
              </span>
              <a
                href={`mailto:${MAIL}`}
                className="contact-btn"
                style={{
                  fontSize: "0.7rem", color: "#fff", background: "var(--text-muted)",
                  borderRadius: "5px", padding: "0.3rem 0.65rem",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--text-secondary)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--text-muted)"}
              >
                Abrir mail
              </a>
            </div>
          </>)}

          {section("Preguntas, reportes y sugerencias", <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                style={inputStyle}
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "var(--text-muted)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: "90px", lineHeight: 1.5 }}
                placeholder="Podes informar un error, hacer una consulta o sugerir una nueva función... Tu feedback es importante."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "var(--text-muted)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button
                className="btn-primary"
                onClick={handleSend}
                disabled={!form.message.trim()}
                style={{ opacity: form.message.trim() ? 1 : 0.4, marginTop: "0.15rem" }}
              >
                Enviar →
              </button>
              <p style={{ fontSize: "0.62rem", color: "var(--text-faint)", margin: 0, lineHeight: 1.4 }}>
                Se abrirá tu app de correo con el mensaje listo para enviar.
              </p>
            </div>
          </>)}

          {session && (<>
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "0.5rem 0 1.25rem" }} />
            <>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "0 0 1rem", lineHeight: 1.5 }}>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>Correo de la cuenta:</span>{" "}
                <span style={{ color: "var(--text-secondary)" }}>{session.user?.email}</span>
              </p>
              {deleteStep === 0 && (
                <button
                  onClick={() => setDeleteStep(1)}
                  style={{
                    width: "100%", padding: "0.6rem 1rem",
                    background: "transparent", border: "1px solid var(--status-bloqueada-dot)",
                    borderRadius: "8px", cursor: "pointer",
                    color: "var(--status-bloqueada-dot)", fontSize: "0.78rem",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  Eliminar mi cuenta
                </button>
              )}
              {deleteStep >= 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--status-bloqueada-dot)", lineHeight: 1.6, margin: 0 }}>
                    ¿Estás seguro? Esta acción es <strong>irreversible</strong>. Se eliminarán tu cuenta y todos tus datos de la nube. Los datos locales en este dispositivo no se borran.
                  </p>
                  {deleteError && (
                    <p style={{ fontSize: "0.75rem", color: "var(--status-bloqueada-dot)", margin: 0 }}>{deleteError}</p>
                  )}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-ghost"
                      onClick={() => { setDeleteStep(0); setDeleteError(null); }}
                      disabled={deleteStep === 2}
                      style={{ flex: 1, opacity: deleteStep === 2 ? 0.4 : 1 }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteStep === 2}
                      style={{
                        flex: 1, padding: "0.6rem 1rem",
                        background: "var(--status-bloqueada-dot)", border: "none",
                        borderRadius: "8px", cursor: deleteStep === 2 ? "not-allowed" : "pointer",
                        color: "#fff", fontSize: "0.78rem", opacity: deleteStep === 2 ? 0.6 : 1,
                        fontFamily: "inherit", transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => { if (deleteStep !== 2) e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={e => { if (deleteStep !== 2) e.currentTarget.style.opacity = "1"; }}
                    >
                      {deleteStep === 2 ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                  </div>
                </div>
              )}
            </>
          </>)}

          <p style={{ fontSize: "0.62rem", color: "var(--text-ghost)", margin: "0.25rem 0 0", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
            v1.5 · {new Date().getFullYear()}
          </p>
          <p style={{ fontSize: "0.62rem", margin: "0.4rem 0 0", textAlign: "center", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={() => setPrivacyOpen(true)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                color: "var(--text-faint)", fontSize: "0.62rem",
                fontFamily: "'DM Mono', monospace",
                textDecoration: "underline", textUnderlineOffset: "2px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-muted)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
            >
              Privacidad
            </button>
            <button
              onClick={() => setExtraOpen(true)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                color: "var(--text-faint)", fontSize: "0.62rem",
                fontFamily: "'DM Mono', monospace",
                textDecoration: "underline", textUnderlineOffset: "2px",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-muted)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
            >
              Extra
            </button>
          </p>
        </div>
      </Modal>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <ExtraModal open={extraOpen} onClose={() => setExtraOpen(false)} />
    </>
  );
}
