import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Clean up CSS for Mobile vs Desktop
const oldCssRules = `    /* Base 1-Page App Shell */
    .app-shell {
      position: relative;
      z-index: 1;
      height: 100svh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: max(10px, var(--safe-t)) clamp(16px, 3vw, 32px) max(16px, var(--safe-b));
      max-width: 1280px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
      width: 100%;
    }
    .main-canvas-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
      position: relative;
    }
    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 340px 1fr 260px;
        gap: 32px;
        align-items: center;
        max-width: 1240px;
        margin: 0 auto;
      }
    }`;

const newCssRules = `    /* Base 1-Page App Shell */
    .app-shell {
      position: relative;
      z-index: 1;
      height: 100svh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: max(8px, var(--safe-t)) clamp(12px, 3vw, 24px) max(12px, var(--safe-b));
      max-width: 1360px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
      width: 100%;
    }

    /* Mobile: Column stack (Card on top, Dock on bottom) */
    .main-canvas-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
      gap: 12px;
    }

    /* Desktop (>=1024px): 3 Columns (Left: Brand | Center: Card Stage | Right: Action Dock) */
    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 340px minmax(420px, 1fr) 260px;
        gap: 40px;
        align-items: center;
        width: 100%;
        max-width: 1280px;
        margin: 0 auto;
      }
    }

    .card-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 0;
    }

    /* Card Perspective & Proportions */
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(300px, 86vw, 380px);
      height: 100%;
      max-height: min(58dvh, 480px);
      display: flex;
      align-items: center;
      margin: 0 auto;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 500px);
      max-height: min(42dvh, 320px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 400px;
        max-height: 520px;
      }
      .card-perspective.horizontal {
        max-width: 540px;
        max-height: 350px;
      }
    }`;

html = html.replace(oldCssRules, newCssRules);

// Replace Action Dock CSS
const oldDockCss = `    /* 4. Action Dock: 3 Primary Buttons */
    .action-dock {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
    }
    @media (min-width: 1024px) {
      .action-dock {
        display: flex;
        flex-direction: column;
        height: auto;
        justify-content: center;
        max-width: 240px;
        gap: 12px;
      }
    }`;

const newDockCss = `    /* 4. Action Dock: 3 Primary Buttons */
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
        max-width: 260px;
        gap: 14px;
        align-self: center;
        margin: 0;
      }
    }`;

html = html.replace(oldDockCss, newDockCss);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Cleaned up layout CSS for Mobile & Desktop!');
