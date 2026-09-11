import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Phóng to thẻ 3D và cột trung tâm trên Desktop
const oldStage = `    /* Card Stage (Center) */
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
    }`;

const newStage = `    /* Card Stage (Center) */
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

html = html.replace(oldStage, newStage);

// 2. Phóng to layout 3 cột trên desktop để tỷ lệ hài hòa toàn màn hình
const oldRow = `    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 320px 1fr 260px;
        gap: 36px;
        align-items: center;
        max-width: 1240px;
        margin: 0 auto;
      }
    }`;

const newRow = `    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 340px minmax(500px, 1fr) 280px;
        gap: clamp(32px, 4vw, 64px);
        align-items: center;
        max-width: 1320px;
        margin: 0 auto;
      }
    }`;

html = html.replace(oldRow, newRow);

// 3. Tăng cỡ chữ bên trong thẻ cho bõ công nhìn trên màn hình lớn
const oldPersonText = `    .person-text h2 {
      font-size: clamp(1.05rem, 2.5vw, 1.3rem);
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }
    .person-text p {
      font-size: clamp(0.78rem, 1.8vw, 0.86rem);
      color: var(--primary);
      margin-top: 2px;
    }`;

const newPersonText = `    .person-text h2 {
      font-size: clamp(1.2rem, 2.8vw, 1.6rem);
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }
    .person-text p {
      font-size: clamp(0.85rem, 2vw, 1.05rem);
      color: var(--primary);
      margin-top: 3px;
    }`;

html = html.replace(oldPersonText, newPersonText);

// 4. Tăng cỡ contact badge
const oldBadge = `    .contact-badge {
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
    }`;

const newBadge = `    .contact-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: clamp(0.84rem, 1.8vw, 1rem);
      color: var(--text);
      text-decoration: none;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 46px;
    }`;

html = html.replace(oldBadge, newBadge);

// 5. Nút dock trên desktop to và êm tay
const oldDockBtn = `    @media (min-width: 1024px) {
      .dock-btn { height: 50px; font-size: 0.88rem; }
    }`;

const newDockBtn = `    @media (min-width: 1024px) {
      .dock-btn { height: 54px; font-size: 0.95rem; border-radius: 14px; }
    }`;

html = html.replace(oldDockBtn, newDockBtn);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Scaled up desktop card stage, text, and dock buttons to pro-level!');
