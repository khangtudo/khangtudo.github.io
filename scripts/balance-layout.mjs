import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Tối ưu Header: Giảm padding, thu gọn nút Tạo mới và Flag
const oldHeaderCss = `    /* 1. Header */
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
    }`;

const newHeaderCss = `    /* 1. Header */
    .utility-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: clamp(44px, 6vh, 56px);
      flex-shrink: 0;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .brand-group img {
      height: clamp(32px, 5vh, 44px);
      width: auto;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-create-sheet {
      background: var(--primary);
      color: #070a12;
      border: none;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: clamp(0.78rem, 2vw, 0.86rem);
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 38px;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .btn-create-sheet:hover { background: var(--primary-hover); transform: translateY(-1px); }

    .flag-wrap { position: relative; }
    .flag-btn {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      color: #fff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 38px;
      min-width: 38px;
    }`;

html = html.replace(oldHeaderCss, newHeaderCss);

// 2. Thẻ 3D: Căn chỉnh tỷ lệ vàng để nằm gọn gàng, thoáng đãng không đè nút
const oldStagePerspective = `    /* Card Stage (Center) */
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
      max-width: clamp(320px, 88vw, 380px);
      height: clamp(440px, 58vh, 500px);
      margin: 0 auto;
      position: relative;
    }
    .card-perspective.horizontal {
      max-width: clamp(350px, 94vw, 520px);
      height: clamp(280px, 38vh, 340px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 480px;
        height: 580px;
      }
      .card-perspective.horizontal {
        max-width: 620px;
        height: 380px;
      }
    }`;

const newStagePerspective = `    /* Card Stage (Center) */
    .card-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
    }
    .card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(310px, 86vw, 360px);
      height: min(52dvh, 460px);
      margin: 0 auto;
      position: relative;
    }
    .card-perspective.horizontal {
      max-width: clamp(340px, 94vw, 480px);
      height: min(38dvh, 310px);
    }
    @media (min-width: 1024px) {
      .card-perspective {
        max-width: 420px;
        height: min(64dvh, 540px);
      }
      .card-perspective.horizontal {
        max-width: 560px;
        height: min(44dvh, 360px);
      }
    }`;

html = html.replace(oldStagePerspective, newStagePerspective);

// 3. Tối ưu padding và font bên trong thẻ cho mobile
const oldCardFace = `    .card-face {
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
    }`;

const newCardFace = `    .card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      border-radius: 22px;
      padding: clamp(14px, 2vh, 22px) clamp(14px, 2.5vw, 20px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid var(--surface-border);
      box-shadow: 0 15px 35px -10px rgba(0,0,0,0.8);
      background: linear-gradient(145deg, #131b2e, #090d16);
    }`;

html = html.replace(oldCardFace, newCardFace);

// 4. Tối ưu nút Lật Thẻ và Action Dock
const oldDockCss = `    .flip-hint-wrap {
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
    }`;

const newDockCss = `    .flip-hint-wrap {
      display: flex;
      justify-content: center;
      margin-top: 8px;
      flex-shrink: 0;
    }
    .btn-flip-below {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--surface-border);
      color: var(--muted);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.74rem;
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
      max-width: 440px;
      margin: 0 auto;
      flex-shrink: 0;
      padding-top: 6px;
    }
    @media (min-width: 1024px) {
      .action-dock {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 250px;
        gap: 14px;
        align-self: center;
        margin: 0;
        padding-top: 0;
      }
    }
    .dock-btn {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      background: var(--surface);
      color: #fff;
      font-size: clamp(0.72rem, 2.6vw, 0.84rem);
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
    }`;

html = html.replace(oldDockCss, newDockCss);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Perfectly balanced mobile viewport heights and dock!');
