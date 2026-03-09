import { useState } from "react";
import Modal from "./Modal";

const MAIL = "subjectstracker@gmail.com";

export default function InfoModal() {
  const [open, setOpen] = useState(false);
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
        color: "#aaa", fontFamily: "'DM Mono', monospace", marginBottom: "0.45rem",
      }}>
        {title}
      </div>
      {children}
    </div>
  );

  const prose = (text) => (
    <p style={{ fontSize: "0.78rem", color: "#666", lineHeight: 1.6, margin: 0 }}>{text}</p>
  );

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#EFECE6", border: "1px solid #D5D0C8",
    borderRadius: "7px", padding: "0.55rem 0.7rem",
    fontSize: "0.78rem", color: "#444",
    outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Subjects Tracker – Reporte de ${form.name || "usuario"}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name}\n\n${form.message}`
    );
    return `mailto:${MAIL}?subject=${subject}&body=${body}`;
  };

  const handleSend = () => {
    if (!form.message.trim()) return;
    window.location.href = mailtoHref();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.65rem", color: "#bbb", letterSpacing: "0.08em",
          textTransform: "uppercase", fontFamily: "'DM Mono', monospace",
          padding: "0.3rem 0.6rem", borderRadius: "4px",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#888"}
        onMouseLeave={e => e.currentTarget.style.color = "#bbb"}
      >
        Info / Privacidad
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Info / Privacidad">
        <div style={{ display: "flex", flexDirection: "column" }}>

          {section("Acerca de", <>
            {prose("Subjects Tracker es una herramienta gratuita para estudiantes universitarios de la UNR y UTN. Permite visualizar y gestionar el plan de estudios y sus correlatividades.")}
          </>)}

          {section("Privacidad", <>
            {prose("Todos los datos se guardan exclusivamente en el almacenamiento local del navegador. No se envía ninguna información a servidores externos. En modo incógnito o al limpiar los datos del navegador, estos se perderán.")}
          </>)}

          {section("Compartir", <>
            <button
              className="btn-ghost"
              onClick={handleShare}
              style={{ fontSize: "0.78rem", padding: "0.5rem 1rem", width: "100%" }}
            >
              {copied ? "✓ Link copiado" : "⤴ Compartir Subjects Tracker"}
            </button>
          </>)}

          {section("Contacto", <>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "#EFECE6", borderRadius: "8px", padding: "0.55rem 0.8rem",
            }}>
              <span style={{ fontSize: "0.75rem", color: "#555", flex: 1, fontFamily: "'DM Mono', monospace" }}>
                {MAIL}
              </span>
              <a
                href={`mailto:${MAIL}`}
                style={{
                  fontSize: "0.7rem", color: "#fff", background: "#6B7280",
                  borderRadius: "5px", padding: "0.3rem 0.65rem",
                  textDecoration: "none", flexShrink: 0,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#4B5563"}
                onMouseLeave={e => e.currentTarget.style.background = "#6B7280"}
              >
                Abrir mail
              </a>
            </div>
          </>)}

          {section("Reportar un problema", <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                style={inputStyle}
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "#9CA3AF"}
                onBlur={e => e.target.style.borderColor = "#D5D0C8"}
              />
              <textarea
                style={{ ...inputStyle, resize: "vertical", minHeight: "90px", lineHeight: 1.5 }}
                placeholder="Describí el problema o sugerencia..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "#9CA3AF"}
                onBlur={e => e.target.style.borderColor = "#D5D0C8"}
              />
              <button
                className="btn-primary"
                onClick={handleSend}
                disabled={!form.message.trim()}
                style={{ opacity: form.message.trim() ? 1 : 0.4, marginTop: "0.15rem" }}
              >
                Enviar →
              </button>
              <p style={{ fontSize: "0.62rem", color: "#bbb", margin: 0, lineHeight: 1.4 }}>
                Se abrirá tu cliente de correo con el mensaje listo para enviar.
              </p>
            </div>
          </>)}

          <p style={{ fontSize: "0.62rem", color: "#ccc", margin: "0.25rem 0 0", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
            v1.0 · {new Date().getFullYear()}
          </p>
        </div>
      </Modal>
    </>
  );
}
