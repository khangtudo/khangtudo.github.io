import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Tối ưu kích thước thẻ 3D trên Desktop
const oldPerspective = `.card-perspective {
      perspective: 1200px;
      width: 100%;
      max-width: 360px;
      height: 100%;
      max-height: min(56dvh, 460px);
      display: flex;
      align-items: center;
    }
    .card-perspective.horizontal {
      max-width: 440px;
      max-height: min(44dvh, 310px);
    }`;

const newPerspective = `.card-perspective {
      perspective: 1400px;
      width: 100%;
      max-width: clamp(320px, 28vw, 420px);
      height: 100%;
      max-height: min(65dvh, 560px);
      display: flex;
      align-items: center;
      margin: 0 auto;
    }
    .card-perspective.horizontal {
      max-width: clamp(400px, 38vw, 560px);
      max-height: min(48dvh, 360px);
    }`;

html = html.replace(oldPerspective, newPerspective);

// 2. Tăng kích cỡ chữ và avatar trên Desktop
const oldPersonText = `.card-avatar {
      width: clamp(48px, 10vw, 64px);
      height: clamp(48px, 10vw, 64px);
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
      background: #1e293b;
      flex-shrink: 0;
    }
    .person-text h2 {
      font-size: clamp(1.05rem, 2.5vw, 1.25rem);
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }
    .person-text p {
      font-size: clamp(0.78rem, 1.8vw, 0.85rem);
      color: var(--primary);
      margin-top: 2px;
    }`;

const newPersonText = `.card-avatar {
      width: clamp(54px, 5vw, 76px);
      height: clamp(54px, 5vw, 76px);
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
      background: #1e293b;
      flex-shrink: 0;
    }
    .person-text h2 {
      font-size: clamp(1.15rem, 1.6vw, 1.5rem);
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }
    .person-text p {
      font-size: clamp(0.85rem, 1.1vw, 1rem);
      color: var(--primary);
      margin-top: 3px;
    }`;

html = html.replace(oldPersonText, newPersonText);

// 3. Tăng kích cỡ contact badge và nút bấm
const oldContactBadge = `.contact-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: clamp(0.78rem, 1.8vw, 0.84rem);
      color: var(--text);
      text-decoration: none;
      padding: 8px 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 40px;
    }`;

const newContactBadge = `.contact-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: clamp(0.84rem, 1vw, 0.95rem);
      color: var(--text);
      text-decoration: none;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 44px;
    }`;

html = html.replace(oldContactBadge, newContactBadge);

// 4. Cải thiện độ nổi bật của Logo bên trái và nút bên phải
const oldBigLogo = `.big-logo img {
        height: 76px;
        width: auto;
        margin-bottom: 8px;
      }`;
const newBigLogo = `.big-logo img {
        height: 96px;
        width: auto;
        margin-bottom: 12px;
      }`;

html = html.replace(oldBigLogo, newBigLogo);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Scaled up desktop card stage and text sizes!');
