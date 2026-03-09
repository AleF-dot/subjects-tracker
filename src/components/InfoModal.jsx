import { useState } from "react";
import Modal from "./Modal";

const MAIL = "subjectstracker@gmail.com";

export default function InfoModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMail = () => {
    navigator.clipboard.writeText(MAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

  return (
    <>
      {/* Botón del footer */}
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
        Info &amp; Privacidad
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Info & Privacidad">
        <div style={{ display: "flex", flexDirection: "column" }}>

          {section("Acerca de", <>
            {prose("Subjects Tracker es una herramienta gratuita pensada para estudiantes universitarios de la URN y UTN para visualizar y gestionar su plan de estudios y correlatividades.")}
            <p style={{ fontSize: "0.73rem", color: "#aaa", margin: "0.4rem 0 0", fontFamily: "'DM Mono', monospace" }}>
              Autoría: Alejandro Falcon
            </p>
          </>)}

          {section("Privacidad", <>
            {prose("Todos tus datos (materias, estados, correlatividades) se guardan exclusivamente en el almacenamiento local de tu navegador (localStorage). No se envía ninguna información a ningún servidor externo. Si limpiás los datos del navegador o usás modo incógnito, el progreso se pierde.")}
          </>)}

          {section("Reportar un problema / Contacto", <>
            {prose("Si encontrás un bug, tenés una sugerencia o querés ponerte en contacto, escribinos a:")}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              marginTop: "0.65rem",
              background: "#EFECE6", borderRadius: "8px", padding: "0.6rem 0.8rem",
            }}>
              <span style={{ fontSize: "0.78rem", color: "#555", flex: 1, fontFamily: "'DM Mono', monospace" }}>
                {MAIL}
              </span>
              <a
                href={`mailto:${MAIL}?subject=Subjects Tracker – Reporte`}
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
              <button
                onClick={handleCopyMail}
                style={{
                  fontSize: "0.7rem", color: "#6B7280", background: "none",
                  border: "1px solid #D5D0C8", borderRadius: "5px",
                  padding: "0.3rem 0.65rem", cursor: "pointer", flexShrink: 0,
                  transition: "color 0.15s, border-color 0.15s",
                }}
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </>)}

          <p style={{ fontSize: "0.62rem", color: "#ccc", margin: "0.5rem 0 0", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
            v1.0 · {new Date().getFullYear()}
          </p>

        </div>
      </Modal>
    </>
  );
}
