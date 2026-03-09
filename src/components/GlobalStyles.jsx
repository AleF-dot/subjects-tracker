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
      @keyframes fadeOut   { from { opacity: 1 } to { opacity: 0 } }
      @keyframes popUp     { from { opacity: 0; transform: translateY(10px) scale(.97) } to { opacity: 1; transform: none } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: none } }
      @keyframes menuIn    { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: none } }
      @keyframes drawPath  { to { stroke-dashoffset: 0 } }
      @keyframes undrawPath { from { stroke-dashoffset: 0 } to { stroke-dashoffset: var(--path-len) } }

      /* Entrada al agregar */
      @keyframes cardEnter {
        0%   { opacity: 0; transform: scale(0.88) translateY(4px); }
        70%  { opacity: 1; transform: scale(1.02); }
        100% { opacity: 1; transform: none; }
      }

      /* Salida al eliminar — solo opacity + scale, sin max-height */
      @keyframes cardExit {
        0%   { opacity: 1; transform: none; }
        100% { opacity: 0; transform: scale(0.85) translateY(-4px); }
      }

      /* Flash de status — solo opacity, sin filter */
      @keyframes statusFlash {
        0%   { opacity: 1; }
        40%  { opacity: 0.6; }
        100% { opacity: 1; }
      }

      /* ── Subject cards ─────────────────────────────────────────────── */
      .subject-card {
        cursor: pointer;
        user-select: none;
        /* Solo transform en transition — compuesto por GPU, sin repaint */
        transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease;
        position: relative;
        /* will-change solo en hover, no siempre */
      }
      .subject-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        will-change: transform;
      }
      .subject-card:not(:hover) {
        will-change: auto;
      }
      .subject-card:active:not(:has(button:active)) {
        transform: scale(0.97);
        transition: transform 0.06s ease;
      }

      .subject-card.card-enter {
        animation: cardEnter 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .subject-card.card-exit {
        animation: cardExit 0.22s ease-in forwards;
        pointer-events: none;
      }

      .subject-card.card-status-flash {
        animation: statusFlash 0.3s ease-out forwards;
      }

      /* ── SVG arrows — promote to own layer ─────────────────────────── */
      svg[data-arrows] {
        will-change: contents;
      }
      svg[data-arrows] path {
        will-change: stroke-dashoffset, opacity;
      }

      /* ── Chevron button ─────────────────────────────────────────────── */
      .chevron-btn {
        transition: background 0.1s;
      }
      .chevron-btn:hover {
        background: rgba(0,0,0,0.06) !important;
      }
      .chevron-btn:active {
        background: rgba(0,0,0,0.13) !important;
        transition: background 0.04s;
      }

      /* ── Status menu ───────────────────────────────────────────────── */
      .status-menu {
        position: fixed; z-index: 800; background: #fff;
        border: 1px solid #E0DAD0; border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.13); overflow: hidden;
        min-width: 160px; animation: menuIn 0.12s ease;
        will-change: transform, opacity;
      }
      .status-menu-item {
        padding: 0.55rem 0.9rem; font-size: 0.8rem; cursor: pointer;
        display: flex; align-items: center; gap: 0.5rem;
        transition: background 0.08s, transform 0.08s; border: none; background: transparent;
        width: 100%; text-align: left;
      }
      .status-menu-item:hover { background: #F5F2EC; transform: translateX(2px); }
      .status-menu-item:active { transform: translateX(2px) scale(0.98); }
      .status-menu-item.active { background: #F0EDE7; font-weight: 500; }
      .status-menu-item + .status-menu-item { border-top: 1px solid #F0EDE7; }

      /* ── Buttons ───────────────────────────────────────────────────── */
      .btn-primary {
        background: #1a1a1a; color: #F5F2EC; border: none;
        padding: 0.65rem 1.4rem; border-radius: 6px; font-size: 0.82rem;
        font-weight: 500; cursor: pointer; letter-spacing: 0.03em;
        transition: background 0.12s, transform 0.1s, box-shadow 0.12s;
        will-change: transform;
      }
      .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
      .btn-primary:active { transform: scale(0.97); box-shadow: none; transition: transform 0.05s; }

      .btn-ghost {
        background: transparent; color: #888; border: 1px solid #D5D0C8;
        padding: 0.65rem 1.2rem; border-radius: 6px; font-size: 0.82rem;
        cursor: pointer; letter-spacing: 0.03em;
        transition: border-color 0.12s, color 0.12s, transform 0.1s;
      }
      .btn-ghost:hover { border-color: #999; color: #444; transform: translateY(-1px); }
      .btn-ghost:active { transform: scale(0.97); transition: transform 0.05s; }

      /* ── Inputs ────────────────────────────────────────────────────── */
      .input-field {
        width: 100%; background: #EFECE6; border: 1px solid #D5D0C8;
        border-radius: 6px; padding: 0.7rem 0.9rem; font-size: 0.88rem;
        color: #1a1a1a; outline: none; transition: border-color 0.12s, box-shadow 0.12s;
      }
      .input-field:focus { border-color: #999; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
      .input-field::placeholder { color: #bbb; }

      .select-field {
        width: 100%; background: #EFECE6; border: 1px solid #D5D0C8;
        border-radius: 6px; padding: 0.7rem 2rem 0.7rem 0.9rem; font-size: 0.88rem;
        color: #1a1a1a; outline: none; cursor: pointer; transition: border-color 0.12s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 0.8rem center;
      }
      .select-menu-item:focus { border-color: #999; }
      .select-field option { background: #F5F2EC; }
    `}</style>
  );
}
