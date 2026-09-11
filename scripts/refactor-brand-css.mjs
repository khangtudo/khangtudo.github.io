import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const oldCss = `    .brand-main-title {
      font-size: clamp(1.2rem, 3.5vw, 1.55rem);
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      line-height: 1.1;
    }
    .brand-main-title .brand-accent { color: var(--primary); }
    .brand-main-title .brand-name { color: #ffffff !important; }`;

const newCss = `    .brand-main-title {
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

if (html.includes(oldCss)) {
  html = html.replace(oldCss, newCss);
  console.log('✅ Cleaned up CSS: removed !important and standardized design token!');
} else {
  console.error('oldCss not found!');
}

// In HTML, also ensure inline styles use var(--primary) or classes cleanly
const oldHdrHtml = `<span style="display:inline-flex; align-items:center;"><span class="brand-name" style="color:#ffffff !important;">inid</span><span class="brand-accent" style="color:#38bdf8;">.me</span></span>`;
const newHdrHtml = `<span style="display:inline-flex; align-items:center;"><span class="brand-name">inid</span><span class="brand-accent">.me</span></span>`;

if (html.includes(oldHdrHtml)) {
  html = html.replace(oldHdrHtml, newHdrHtml);
  console.log('✅ Cleaned up header HTML inline styles!');
} else {
  console.error('oldHdrHtml not found!');
}

const oldRailHtml = `<div style="font-size:2.2rem; font-weight:900; letter-spacing:-1px; line-height:1;"><span style="color:#ffffff !important;">inid</span><span style="color:#38bdf8;">.me</span></div>`;
const newRailHtml = `<div class="brand-main-title" style="font-size:2.2rem; font-weight:900; letter-spacing:-1px; line-height:1;"><span class="brand-name">inid</span><span class="brand-accent">.me</span></div>`;

if (html.includes(oldRailHtml)) {
  html = html.replace(oldRailHtml, newRailHtml);
  console.log('✅ Cleaned up identity rail HTML!');
} else {
  console.error('oldRailHtml not found!');
}

fs.writeFileSync(p, html, 'utf8');
