import React from 'react';
import Modal from "./Modal";

export default function MergePromptModal({ open, onResolve }) {
  return (
    <Modal open={open} onClose={() => {}} title="¿Qué plan querés usar?" hideClose lockClose>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          Tenés un plan guardado localmente y otro en la nube. ¿Con cuál vas a seguir?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            className="btn-primary"
            onClick={() => onResolve("cloud")}
            style={{ width: "100%", textAlign: "left", padding: "0.85rem 1rem" }}
          >
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Usar el de la nube</div>
            <div style={{ fontSize: "0.72rem", opacity: 0.75, marginTop: "0.15rem" }}>
              El plan guardado en tu cuenta. Reemplaza el local.
            </div>
          </button>

          <button
            className="btn-ghost"
            onClick={() => onResolve("local")}
            style={{ width: "100%", textAlign: "left", padding: "0.85rem 1rem" }}
          >
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Usar el local</div>
            <div style={{ fontSize: "0.72rem", opacity: 0.75, marginTop: "0.15rem" }}>
              El plan que tenés en este dispositivo. Se sube a la nube.
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
