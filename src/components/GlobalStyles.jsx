import React from 'react';
export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

      /* ── Theme tokens ───────────────────────────────────────────────── */
      :root, [data-theme="light"] {
        --bg:           #E2DDD6;
        --bg-card:      #EAE6DF;
        --bg-elevated:  #DAD5CD;
        --bg-hover:     #D0CBC2;
        --border:       #BDB8B0;
        --border-soft:  #CCC8C0;
        --border-menu:  #C4BFB8;
        --text-primary: #1A1710;
        --text-secondary: #3E3A30;
        --text-muted:   #706A60;
        --text-faint:   #A09888;
        --text-ghost:   #C0B8A8;
        --btn-primary-bg: #1A1710;
        --btn-primary-fg: #E2DDD6;
        --btn-primary-hover: #2E2A20;
        --menu-bg:      #F0EBE2;
        --menu-hover:   #E6E0D8;
        --menu-active:  #DDD8D0;
        --modal-backdrop: rgba(20,18,14,0.5);
        --scrollbar:    #B0A898;
        /* status */
        --status-disponible-bg: #D8D4CC; --status-disponible-border: #908880; --status-disponible-dot: #686058; --status-disponible-color: #403830;
        --status-cursando-bg:   #CCDAEC; --status-cursando-border:   #4E7EB8; --status-cursando-dot:   #2860A8; --status-cursando-color:   #103870;
        --status-regular-bg:    #EAE098; --status-regular-border:    #B08818; --status-regular-dot:    #906808; --status-regular-color:    #503800;
        --status-aprobada-bg:   #AADEC0; --status-aprobada-border:   #1E8858; --status-aprobada-dot:   #0E6840; --status-aprobada-color:   #044028;
        --status-bloqueada-bg:  #E8C4C4; --status-bloqueada-border:  #B04848; --status-bloqueada-dot:  #903030; --status-bloqueada-color:  #581010;
        /* highlight */
        --hl-regular-border:      #B08818; --hl-regular-bg:      #EAE098;
        --hl-aprobada-border:     #1E8858; --hl-aprobada-bg:     #AADEC0;
        --hl-final-reg-border:    #1090B0; --hl-final-reg-bg:    #C0E8F4;
        --hl-final-apr-border:    #6030C0; --hl-final-apr-bg:    #DDD0F4;
      }

      [data-theme="dark"] {
        --bg:           #1A1A1F;
        --bg-card:      #25252D;
        --bg-elevated:  #2D2D38;
        --bg-hover:     #35353F;
        --border:       #3A3A48;
        --border-soft:  #2E2E3A;
        --border-menu:  #3A3A48;
        --text-primary: #EDEDF0;
        --text-secondary: #B0B0BF;
        --text-muted:   #7A7A8C;
        --text-faint:   #55556A;
        --text-ghost:   #3A3A50;
        --btn-primary-bg: #EDEDF0;
        --btn-primary-fg: #1A1A1F;
        --btn-primary-hover: #fff;
        --menu-bg:      #2D2D38;
        --menu-hover:   #35353F;
        --menu-active:  #3A3A48;
        --modal-backdrop: rgba(0,0,0,0.65);
        --scrollbar:    #3A3A48;
        /* status dark — más suaves para no quemar en fondo oscuro */
        --status-disponible-bg: #2A2A35; --status-disponible-border: #55556A; --status-disponible-dot: #7A7A8C; --status-disponible-color: #A0A0B5;
        --status-cursando-bg:   #1E2D4A; --status-cursando-border:   #3B82F6; --status-cursando-dot:   #60A5FA; --status-cursando-color:   #93C5FD;
        --status-regular-bg:    #2E2010; --status-regular-border:    #D97706; --status-regular-dot:    #FBBF24; --status-regular-color:    #FCD34D;
        --status-aprobada-bg:   #0D2A1E; --status-aprobada-border:   #059669; --status-aprobada-dot:   #34D399; --status-aprobada-color:   #6EE7B7;
        --status-bloqueada-bg:  #2A1010; --status-bloqueada-border:  #EF4444; --status-bloqueada-dot:  #F87171; --status-bloqueada-color:  #FCA5A5;
        /* highlight dark */
        --hl-regular-border:      #D97706; --hl-regular-bg:      #2E2010;
        --hl-aprobada-border:     #059669; --hl-aprobada-bg:     #0D2A1E;
        --hl-final-reg-border:    #06B6D4; --hl-final-reg-bg:    #0A2535;
        --hl-final-apr-border:    #7C3AED; --hl-final-apr-bg:    #1E1535;
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--text-primary);
        font-family: 'DM Sans', sans-serif;
        transition: background 0.25s ease, color 0.25s ease;
      }

      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 2px; }

      select, input, button { font-family: inherit; }
      select { appearance: none; -webkit-appearance: none; }

      /* ── Keyframes ─────────────────────────────────────────────────── */
      @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
      @keyframes fadeOut   { from { opacity: 1 } to { opacity: 0 } }
      @keyframes popUp     { from { opacity: 0; transform: translateY(10px) scale(.97) } to { opacity: 1; transform: none } }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: none } }
      @keyframes menuIn    { from { opacity: 0; transform: translateY(-4px) scale(.98) } to { opacity: 1; transform: none } }
      @keyframes drawPath  { to { stroke-dashoffset: 0 } }
      @keyframes toastIn   { from { opacity: 0; transform: translateX(-50%) translateY(8px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
      @keyframes modalOut  { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(6px) scale(.98) } }
      @keyframes gridFadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
      @keyframes syncPulse  { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
      @keyframes panelIn    { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      @keyframes undrawPath { from { stroke-dashoffset: 0 } to { stroke-dashoffset: var(--path-len) } }

      @keyframes cardEnter {
        0%   { opacity: 0; transform: scale(0.88) translateY(4px); }
        70%  { opacity: 1; transform: scale(1.02); }
        100% { opacity: 1; transform: none; }
      }
      @keyframes cardExit {
        0%   { opacity: 1; transform: none; }
        100% { opacity: 0; transform: scale(0.85) translateY(-4px); }
      }
      @keyframes statusFlash {
        0%   { opacity: 1; }
        40%  { opacity: 0.6; }
        100% { opacity: 1; }
      }

      /* ── Subject cards ─────────────────────────────────────────────── */
      .subject-card {
        cursor: pointer;
        user-select: none;
        transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease, background 0.25s ease, border-color 0.25s ease;
        position: relative;
      }
      .subject-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        will-change: transform;
      }
      .subject-card:not(:hover) { will-change: auto; }
      .subject-card:active:not(:has(button:active)) {
        transform: scale(0.97);
        transition: transform 0.06s ease;
      }
      .subject-card.card-enter  { animation: cardEnter 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .subject-card.card-exit   { animation: cardExit 0.22s ease-in forwards; pointer-events: none; }
      .subject-card.card-status-flash { animation: statusFlash 0.3s ease-out forwards; }

      /* ── SVG arrows ────────────────────────────────────────────────── */
      svg[data-arrows] { will-change: transform; }

      /* ── Chevron ───────────────────────────────────────────────────── */
      .chevron-btn { transition: background 0.1s; }
      .chevron-btn:hover  { background: rgba(128,128,128,0.1) !important; }
      .chevron-btn:active { background: rgba(128,128,128,0.2) !important; transition: background 0.04s; }

      /* ── Status menu ───────────────────────────────────────────────── */
      .status-menu {
        position: fixed; z-index: 800;
        background: var(--menu-bg);
        border: 1px solid var(--border-menu);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        overflow: hidden;
        min-width: 160px;
        animation: menuIn 0.12s ease;
        will-change: transform, opacity;
        transform: translateZ(0);
      }
      .status-menu-item {
        padding: 0.55rem 0.9rem; font-size: 0.8rem; cursor: pointer;
        display: flex; align-items: center; gap: 0.5rem;
        transition: background 0.08s, transform 0.08s;
        border: none; background: transparent;
        width: 100%; text-align: left;
        color: var(--text-primary);
      }
      .status-menu-item:hover  { background: var(--menu-hover); transform: translateX(2px); }
      .status-menu-item:active { transform: translateX(2px) scale(0.98); }
      .status-menu-item.active { background: var(--menu-active); font-weight: 500; }
      .status-menu-item + .status-menu-item { border-top: 1px solid var(--border-soft); }

      /* ── Buttons ───────────────────────────────────────────────────── */
      .btn-primary {
        background: var(--btn-primary-bg); color: var(--btn-primary-fg);
        border: none; padding: 0.65rem 1.4rem; border-radius: 6px;
        font-size: 0.82rem; font-weight: 500; cursor: pointer;
        letter-spacing: 0.03em;
        transition: background 0.12s, transform 0.1s, box-shadow 0.12s;
        will-change: transform;
      }
      .btn-primary:hover  { background: var(--btn-primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18); }
      .btn-primary:active { transform: scale(0.97); box-shadow: none; transition: transform 0.05s; }

      .btn-ghost {
        background: transparent; color: var(--text-muted);
        border: 1px solid var(--border);
        padding: 0.65rem 1.2rem; border-radius: 6px; font-size: 0.82rem;
        cursor: pointer; letter-spacing: 0.03em;
        transition: border-color 0.12s, color 0.12s, transform 0.1s;
      }
      .btn-ghost:hover  { border-color: var(--text-muted); color: var(--text-secondary); transform: translateY(-1px); }
      .btn-ghost:active { transform: scale(0.97); transition: transform 0.05s; }

      /* ── Inputs ────────────────────────────────────────────────────── */
      .input-field {
        width: 100%; background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 6px; padding: 0.7rem 0.9rem; font-size: 0.88rem;
        color: var(--text-primary); outline: none;
        transition: border-color 0.12s, box-shadow 0.12s;
      }
      .input-field:focus { border-color: var(--text-muted); box-shadow: 0 0 0 3px rgba(128,128,128,0.12); }
      .input-field::placeholder { color: var(--text-faint); }

      .select-field {
        width: 100%; background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: 6px; padding: 0.7rem 2rem 0.7rem 0.9rem; font-size: 0.88rem;
        color: var(--text-primary); outline: none; cursor: pointer;
        transition: border-color 0.12s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23999' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat; background-position: right 0.8rem center;
      }
      .select-field:focus { border-color: var(--text-muted); }
      .select-field option { background: var(--bg-elevated); }
    `}</style>
  );
}
