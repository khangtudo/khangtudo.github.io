import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace CSS
const oldCssBlock = `.brand-main-title .brand-accent { color: var(--primary); }
    .brand-main-title .brand-name { color: #ffffff !important; }`;

const newCssBlock = `.brand-main-title {
      font-size: clamp(1.2rem, 3.5vw, 1.55rem);
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      line-height: 1.1;
    }
    .brand-main-title .brand-name { color: #ffffff; }
    .brand-main-title .brand-accent { color: var(--primary); }`;

// Check what CSS exists around .brand-main-title
const titleIdx = html.indexOf('.brand-main-title {');
console.log(html.substring(titleIdx, titleIdx + 400));
