import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Modal from "./Modal";

const MAIL = "subjectstracker@gmail.com";

export default function InfoModal() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();
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

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Reporte de ${form.name || "usuario"}`);
    const body = encodeURIComponent(
      `${form.message}`
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
          fontSize: "0.65rem", color: "var(--text-faint)", letterSpacing: "0.08em",
          textTransform: "uppercase", fontFamily: "'DM Mono', monospace",
          padding: "0.3rem 0.6rem", borderRadius: "4px",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-muted)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
      >
        Info / Privacidad
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Información">
        <div style={{ display: "flex", flexDirection: "column" }}>

          {section("Acerca de", <>
            {prose("Subjects Tracker es una herramienta gratuita para estudiantes universitarios de la UNR y UTN. Permite visualizar y gestionar el plan de estudios y sus correlatividades.")}
          </>)}

          {section("Privacidad", <>
            {prose("Todos los datos se guardan exclusivamente en el almacenamiento local del navegador. No se envía ninguna información a servidores externos. En modo incógnito o al limpiar los datos del navegador, estos se perderán.")}
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
              {copied ? "✓ Link copiado" : "Compartir Subjects Tracker ⤴"}
            </button>
          </>)}

          {section("Contacto", <>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "var(--bg-elevated)", borderRadius: "8px", padding: "0.55rem 0.8rem",
            }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", flex: 1, fontFamily: "'DM Mono', monospace" }}>
                {MAIL}
              </span>
              <a
                href={`mailto:${MAIL}`}
                style={{
                  fontSize: "0.7rem", color: "#fff", background: "var(--text-muted)",
                  borderRadius: "5px", padding: "0.3rem 0.65rem",
                  textDecoration: "none", flexShrink: 0,
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
                Se abrirá tu cliente de correo con el mensaje listo para enviar.
              </p>
            </div>
          </>)}

          <p style={{ fontSize: "0.62rem", color: "var(--text-ghost)", margin: "0.25rem 0 0", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
            v1.0 · {new Date().getFullYear()}
          </p>
        </div>
      </Modal>
    </>
  );
}
