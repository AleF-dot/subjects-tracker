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

      @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
      @keyframes popUp     { from { opacity: 0; transform: translateY(14px) scale(.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
      @keyframes menuIn    { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      @keyframes drawPath  { to { stroke-dashoffset: 0 } }

      .subject-card {
        cursor: pointer; user-select: none;
        transition: filter 0.15s, transform 0.18s, opacity 0.18s, box-shadow 0.18s;
        position: relative;
      }
      .subject-card:hover { filter: brightness(0.96); }
      .subject-card.bloqueada { cursor: pointer; }
      .subject-card.bloqueada:hover { filter: brightness(0.96); }

      .status-menu {
        position: fixed; z-index: 800; background: #fff;
        border: 1px solid #E0DAD0; border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12); overflow: hidden;
        min-width: 160px; animation: menuIn 0.15s ease;
      }
      .status-menu-item {
        padding: 0.55rem 0.9rem; font-size: 0.8rem; cursor: pointer;
        display: flex; align-items: center; gap: 0.5rem;
        transition: background 0.1s; border: none; background: transparent;
        width: 100%; text-align: left;
      }
      .status-menu-item:hover { background: #F5F2EC; }
      .status-menu-item.active { background: #F0EDE7; font-weight: 500; }
      .status-menu-item + .status-menu-item { border-top: 1px solid #F0EDE7; }

      .btn-primary { background:#1a1a1a; color:#F5F2EC; border:none; padding:0.65rem 1.4rem; border-radius:6px; font-size:0.82rem; font-weight:500; cursor:pointer; letter-spacing:0.03em; transition:background 0.15s, transform 0.1s; }
      .btn-primary:hover { background:#333; transform:translateY(-1px); }
      .btn-primary:active { transform:translateY(0); }
      .btn-ghost { background:transparent; color:#888; border:1px solid #D5D0C8; padding:0.65rem 1.2rem; border-radius:6px; font-size:0.82rem; cursor:pointer; letter-spacing:0.03em; transition:all 0.15s; }
      .btn-ghost:hover { border-color:#999; color:#444; }

      .input-field { width:100%; background:#EFECE6; border:1px solid #D5D0C8; border-radius:6px; padding:0.7rem 0.9rem; font-size:0.88rem; color:#1a1a1a; outline:none; transition:border-color 0.15s; }
      .input-field:focus { border-color:#999; }
      .input-field::placeholder { color:#bbb; }

      .select-field { width:100%; background:#EFECE6; border:1px solid #D5D0C8; border-radius:6px; padding:0.7rem 2rem 0.7rem 0.9rem; font-size:0.88rem; color:#1a1a1a; outline:none; cursor:pointer; transition:border-color 0.15s; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.8rem center; }
      .select-field:focus { border-color:#999; }
      .select-field option { background:#F5F2EC; }
    `}</style>
  );
}
