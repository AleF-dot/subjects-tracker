export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #F5F2EC; color: #1a1a1a; font-family: 'DM Sans', sans-serif; }

      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #c8c2b6; border-radius: 2px; }

      select, input, button { font-family: inherit; }
      select { appearance: none; -webkit-appearance: none; }

      /* ── Keyframes ─────────────────────────────────────────────────── */
      @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
      @keyframes popUp     { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes menuIn    { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      @keyframes drawPath  { to { stroke-dashoffset: 0 } }

      /* Pulso al seleccionar — ring que se expande y desvanece */
      @keyframes selectPulse {
        0%   { box-shadow: 0 0 0 0px var(--pulse-color, rgba(59,130,246,0.5)); }
        50%  { box-shadow: 0 0 0 6px var(--pulse-color, rgba(59,130,246,0)); }
        100% { box-shadow: 0 0 0 6px var(--pulse-color, rgba(59,130,246,0)); }
      }

      /* Pop de entrada al agregar */
      @keyframes cardEnter {
        0%   { opacity: 0; transform: scale(0.82) translateY(8px); }
        65%  { opacity: 1; transform: scale(1.04) translateY(-2px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }

      /* Pop de salida al eliminar */
      @keyframes cardExit {
        0%   { opacity: 1; transform: scale(1); max-height: 120px; margin-bottom: 0; }
        30%  { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(0.75) translateY(-6px); max-height: 0; margin-bottom: -0.4rem; }
      }

      /* Flash de color al cambiar status */
      @keyframes statusFlash {
        0%   { filter: brightness(1); }
        25%  { filter: brightness(1.18) saturate(1.4); }
        100% { filter: brightness(1); }
      }

      /* Shimmer sutil al hover */
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      /* ── Subject cards ─────────────────────────────────────────────── */
      .subject-card {
        cursor: pointer;
        user-select: none;
        transition: filter 0.15s, transform 0.18s, opacity 0.18s, box-shadow 0.2s;
        position: relative;
        will-change: transform;
      }
      .subject-card:hover {
        filter: brightness(0.94) saturate(1.1);
        transform: translateY(-1px);
      }
      .subject-card:active {
        transform: scale(0.97) translateY(0);
        filter: brightness(0.9);
        transition: transform 0.07s, filter 0.07s;
      }
      .subject-card.bloqueada:hover {
        filter: brightness(0.94);
        transform: translateY(-1px);
      }

      /* Clase aplicada al seleccionar — pulso único */
      .subject-card.card-selected-pulse {
        animation: selectPulse 0.45s ease-out forwards;
      }

      /* Entrada al agregar */
      .subject-card.card-enter {
        animation: cardEnter 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* Salida al eliminar */
      .subject-card.card-exit {
        animation: cardExit 0.28s ease-in forwards;
        pointer-events: none;
        overflow: hidden;
      }

      /* Flash tras cambio de status */
      .subject-card.card-status-flash {
        animation: statusFlash 0.35s ease-out forwards;
      }

      /* ── Status menu ───────────────────────────────────────────────── */
      .status-menu {
        position: fixed; z-index: 800; background: #fff;
        border: 1px solid #E0DAD0; border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.13); overflow: hidden;
        min-width: 160px; animation: menuIn 0.15s ease;
      }
      .status-menu-item {
        padding: 0.55rem 0.9rem; font-size: 0.8rem; cursor: pointer;
        display: flex; align-items: center; gap: 0.5rem;
        transition: background 0.1s, transform 0.1s; border: none; background: transparent;
        width: 100%; text-align: left;
      }
      .status-menu-item:hover {
        background: #F5F2EC;
        transform: translateX(2px);
      }
      .status-menu-item:active { transform: translateX(2px) scale(0.98); }
      .status-menu-item.active { background: #F0EDE7; font-weight: 500; }
      .status-menu-item + .status-menu-item { border-top: 1px solid #F0EDE7; }

      /* ── Buttons ───────────────────────────────────────────────────── */
      .btn-primary {
        background: #1a1a1a; color: #F5F2EC; border: none;
        padding: 0.65rem 1.4rem; border-radius: 6px; font-size: 0.82rem;
        font-weight: 500; cursor: pointer; letter-spacing: 0.03em;
        transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      }
      .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
      .btn-primary:active { transform: translateY(0) scale(0.97); box-shadow: none; }

      .btn-ghost {
        background: transparent; color: #888; border: 1px solid #D5D0C8;
        padding: 0.65rem 1.2rem; border-radius: 6px; font-size: 0.82rem;
        cursor: pointer; letter-spacing: 0.03em; transition: all 0.15s;
      }
      .btn-ghost:hover { border-color: #999; color: #444; transform: translateY(-1px); }
      .btn-ghost:active { transform: translateY(0); }

      /* ── Inputs ────────────────────────────────────────────────────── */
      .input-field {
        width: 100%; background: #EFECE6; border: 1px solid #D5D0C8;
        border-radius: 6px; padding: 0.7rem 0.9rem; font-size: 0.88rem;
        color: #1a1a1a; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
      }
      .input-field:focus { border-color: #999; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
      .input-field::placeholder { color: #bbb; }

      .select-field {
        width: 100%; background: #EFECE6; border: 1px solid #D5D0C8;
        border-radius: 6px; padding: 0.7rem 2rem 0.7rem 0.9rem; font-size: 0.88rem;
        color: #1a1a1a; outline: none; cursor: pointer; transition: border-color 0.15s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 0.8rem center;
      }
      .select-field:focus { border-color: #999; }
      .select-field option { background: #F5F2EC; }
    `}</style>
  );
}
