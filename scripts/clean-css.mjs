import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Trích xuất toàn bộ phần giữa <style> và </style>
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');

// Xây dựng bộ CSS tối giản, chuẩn xác 100%, không bị trùng lặp, không bị height: 0
const cleanCss = `
    :root {
      --bg: #070a12;
      --surface: rgba(16, 23, 38, 0.75);
      --surface-border: rgba(255, 255, 255, 0.1);
      --primary: #38bdf8;
      --primary-hover: #7dd3fc;
      --text: #f8fafc;
      --muted: #94a3b8;
      --danger: #ef4444;
      --success: #10b981;
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --safe-t: env(safe-area-inset-top, 0px);
      --safe-b: env(safe-area-inset-bottom, 0px);
      --keyboard-offset: 0px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100%;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      user-select: none;
    }

    .ambient-glow {
      position: fixed;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(7, 10, 18, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 0;
    }

    /* Base 1-Page App Shell */
    .app-shell {
      position: relative;
      z-index: 1;
      height: 100svh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: max(8px, var(--safe-t)) clamp(14px, 3vw, 32px) max(12px, var(--safe-b));
      max-width: 1360px;
      margin: 0 auto;
      box-sizing: border-box;
      width: 100%;
    }

    /* 1. Header */
    .utility-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 52px;
      flex-shrink: 0;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .brand-group img {
      height: clamp(38px, 6vw, 48px);
      width: auto;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-create-sheet {
      background: var(--primary);
      color: #070a12;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 40px;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .btn-create-sheet:hover { background: var(--primary-hover); transform: translateY(-1px); }

    .flag-wrap { position: relative; }
    .flag-btn {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 40px;
      min-width: 44px;
    }
    .flag-menu {
      position: absolute;
      right: 0;
      top: 48px;
      background: #101726;
      border: 1px solid var(--surface-border);
      border-radius: 14px;
      max-height: 250px;
      overflow-y: auto;
      width: 170px;
      display: none;
      z-index: 100;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      padding: 6px 0;
    }
    .flag-item {
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      cursor: pointer;
      min-height: 40px;
      width: 100%;
      background: transparent;
      border: none;
      color: var(--text);
      text-align: left;
    }
    .flag-item:hover, .flag-item:focus-visible { background: rgba(56, 189, 248, 0.15); color: var(--primary); }

    /* 2. Main Row: Mobile Stack vs Desktop 3-Column */
    .main-canvas-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 320px 1fr 260px;
        gap: 36px;
        align-items: center;
        max-width: 1240px;
        margin: 0 auto;
      }
    }

    /* Identity Rail Desktop */
    .identity-rail {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
    }
    @media (min-width: 1024px) {
      .identity-rail { display: flex; }
    }
    .big-logo img {
      height: 84px;
      width: auto;
      margin-bottom: 6px;
    }
    .badge-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.74rem;
      color: var(--primary);
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 4px 10px;
      border-radius: 20px;
      width: fit-content;
    }

    /* Card Stage (Center) */
    .card-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(300px, 86vw, 360px);
      height: clamp(380px, 52vh, 460px);
      margin: 0 auto;
      position: relative;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 500px);
      height: clamp(260px, 36vh, 310px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 380px;
        height: 480px;
      }
      .card-perspective.horizontal {
        max-width: 520px;
        height: 330px;
      }
    }
    .card-3d {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .card-3d.flipped { transform: rotateY(180deg); }

    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      border-radius: 22px;
      padding: clamp(16px, 3vh, 24px) clamp(16px, 3vw, 22px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--surface-border);
      box-shadow: 0 15px 35px -10px rgba(0,0,0,0.8);
      background: linear-gradient(145deg, #131b2e, #090d16);
    }
    .card-back {
      transform: rotateY(180deg);
      background: linear-gradient(145deg, #0f172a, #020617);
      text-align: center;
    }

    .person-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-avatar {
      width: clamp(48px, 12vw, 64px);
      height: clamp(48px, 12vw, 64px);
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
      background: #1e293b;
      flex-shrink: 0;
    }
    .person-text h2 {
      font-size: clamp(1.05rem, 2.5vw, 1.3rem);
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }
    .person-text p {
      font-size: clamp(0.78rem, 1.8vw, 0.86rem);
      color: var(--primary);
      margin-top: 2px;
    }

    .contacts-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 10px 0;
    }
    .contact-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: clamp(0.76rem, 2vw, 0.85rem);
      color: var(--text);
      text-decoration: none;
      padding: 8px 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 38px;
    }
    .contact-badge:hover { background: rgba(56, 189, 248, 0.15); border-color: var(--primary); }

    .card-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .social-icons-box {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .soc-circle-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: transform 0.15s;
    }
    .soc-circle-btn:hover { transform: scale(1.1); }

    .btn-toggle-orient-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #38bdf8;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.74rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s;
      font-weight: 600;
    }
    .btn-toggle-orient-card:hover { background: rgba(56, 189, 248, 0.2); color: #fff; }

    /* Back Face */
    .company-stack {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .company-logo {
      max-width: 60px;
      max-height: 60px;
      border-radius: 12px;
      object-fit: contain;
    }
    .company-stack h3 { font-size: 1.1rem; color: #fff; font-weight: 700; }
    .company-stack .slogan { font-size: 0.8rem; color: var(--primary); font-style: italic; }
    .company-stack .address { font-size: 0.76rem; color: var(--muted); max-width: 260px; line-height: 1.4; }

    .flip-hint-wrap {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .btn-flip-below {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--surface-border);
      color: var(--muted);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .btn-flip-below:hover {
      background: rgba(56, 189, 248, 0.12);
      color: var(--primary);
      border-color: rgba(56, 189, 248, 0.3);
    }

    /* 3. Action Dock: 3 Buttons */
    .action-dock {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }
    @media (min-width: 1024px) {
      .action-dock {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 240px;
        gap: 14px;
        align-self: center;
        margin: 0;
      }
    }
    .dock-btn {
      width: 100%;
      height: 46px;
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      background: var(--surface);
      color: #fff;
      font-size: clamp(0.72rem, 2.5vw, 0.84rem);
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      text-decoration: none;
      transition: all 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 4px;
      box-sizing: border-box;
    }
    @media (min-width: 1024px) {
      .dock-btn { height: 50px; font-size: 0.88rem; }
    }
    .dock-btn-primary {
      background: var(--primary);
      color: #070a12;
      font-weight: 700;
      border: none;
    }
    .dock-btn-primary:hover { background: var(--primary-hover); }
    .dock-btn:hover:not(.dock-btn-primary) { background: rgba(255,255,255,0.08); }

    /* Modals & Overlays */
    .overlay-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 200;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .overlay-backdrop.active { display: block; opacity: 1; }

    .sheet-panel {
      position: fixed;
      background: #0d1320;
      border: 1px solid var(--surface-border);
      z-index: 201;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    @media (max-width: 1023px) {
      .sheet-panel {
        bottom: 0; left: 0; right: 0;
        height: calc(75dvh - var(--keyboard-offset));
        max-height: calc(92dvh - var(--keyboard-offset));
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
      }
      .sheet-panel.active { transform: translateY(0); }
    }
    @media (min-width: 1024px) {
      .sheet-panel {
        top: 0; bottom: 0; right: 0;
        width: 420px;
        transform: translateX(100%);
        border-left: 1px solid var(--surface-border);
      }
      .sheet-panel.active { transform: translateX(0); }
    }

    .sheet-header {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sheet-header h2 { font-size: 1.05rem; font-weight: 700; color: #fff; }
    .sheet-close {
      background: none; border: none; color: var(--muted); font-size: 1.3rem; cursor: pointer; padding: 6px 10px; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;
    }
    .sheet-close:hover { color: #fff; }

    .sheet-gauge {
      padding: 12px 20px;
      background: rgba(0,0,0,0.25);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .progress-bar-bg {
      background: #06090e;
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
      margin: 6px 0;
    }
    .progress-bar-fill {
      height: 100%;
      width: 0%;
      background: var(--success);
      transition: width 0.2s, background 0.2s;
    }

    .sheet-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      user-select: text;
    }
    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-group label { font-size: 0.78rem; color: var(--muted); font-weight: 500; }
    .input-row {
      display: flex;
      align-items: center;
      background: #06090e;
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      overflow: hidden;
    }
    .input-row:focus-within { border-color: var(--primary); }
    .input-prefix {
      padding: 0 10px; font-size: 0.8rem; color: var(--muted); background: rgba(255,255,255,0.02); min-height: 42px; display: flex; align-items: center;
    }
    .input-row input { border: none !important; background: transparent !important; }
    input[type="text"], input[type="email"], input[type="tel"] {
      width: 100%;
      background: #06090e;
      border: 1px solid var(--surface-border);
      color: var(--text);
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.88rem;
      outline: none;
      min-height: 42px;
    }
    input:focus { border-color: var(--primary); }

    .sheet-footer {
      padding: 14px 20px max(14px, var(--safe-b)) 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
      background: #0d1320;
    }
    .btn-save-sheet {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      background: var(--primary);
      color: #070a12;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
    }
    .btn-save-sheet:hover { background: var(--primary-hover); }

    .qr-modal {
      position: fixed;
      inset: 0;
      z-index: 300;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .qr-modal.active { display: flex; }
    .qr-card {
      background: #fff;
      color: #070a12;
      border-radius: 20px;
      padding: 24px;
      max-width: 320px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9);
      position: relative;
    }
    .qr-close {
      position: absolute; top: 12px; right: 14px; background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748b; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;
    }
    #qrcode canvas, #qrcode img { margin: 12px auto; display: block; }
    .qr-btn-row { display: flex; gap: 8px; margin-top: 14px; }
    .btn-qr-action {
      flex: 1; height: 42px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a;
    }
    .btn-qr-action:hover { background: #e2e8f0; }

    model-viewer { display: none; width: 100%; height: 300px; }

    .toast {
      position: fixed;
      bottom: 24px; left: 50%; transform: translateX(-50%);
      background: rgba(16, 185, 129, 0.95);
      color: #fff; padding: 8px 18px; border-radius: 20px;
      font-size: 0.85rem; font-weight: 600;
      display: none; z-index: 1000;
    }

    @media (prefers-reduced-motion: reduce) {
      .card-3d { transition: none !important; }
      .card-3d.flipped { transform: rotateY(180deg) !important; }
      .sheet-panel, .overlay-backdrop, .dock-btn, .btn-create-sheet { transition: none !important; }
    }
`;

html = html.substring(0, styleStart + 7) + cleanCss + html.substring(styleEnd);
fs.writeFileSync(p, html, 'utf8');
console.log('✅ Replaced entire <style> block with clean, un-conflicted CSS!');
