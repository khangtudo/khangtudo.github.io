import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In CSS: update .brand-main-title span
const oldCssSpan = `.brand-main-title span { color: var(--primary); }`;
const newCssSpan = `.brand-main-title .brand-accent { color: var(--primary); }
    .brand-main-title .brand-name { color: #ffffff !important; }`;

if (html.includes(oldCssSpan)) {
  html = html.replace(oldCssSpan, newCssSpan);
  console.log('✅ Updated CSS selector for brand title accent!');
} else {
  console.error('oldCssSpan not found!');
}

// 2. In header brand-group:
const oldHeaderSpan = `<span>inid<span style="color:#38bdf8;">.me</span></span>`;
const newHeaderSpan = `<span style="display:inline-flex; align-items:center;"><span class="brand-name" style="color:#ffffff !important;">inid</span><span class="brand-accent" style="color:#38bdf8;">.me</span></span>`;

if (html.includes(oldHeaderSpan)) {
  html = html.replace(oldHeaderSpan, newHeaderSpan);
  console.log('✅ Updated header HTML: inid is pure white (#ffffff)!');
} else {
  console.error('oldHeaderSpan not found!');
}

// 3. In identity rail (left desktop rail):
const oldRailSpan = `<div style="font-size:2.2rem; font-weight:900; color:#fff; letter-spacing:-1px; line-height:1;">inid<span style="color:#38bdf8;">.me</span></div>`;
const newRailSpan = `<div style="font-size:2.2rem; font-weight:900; letter-spacing:-1px; line-height:1;"><span style="color:#ffffff !important;">inid</span><span style="color:#38bdf8;">.me</span></div>`;

if (html.includes(oldRailSpan)) {
  html = html.replace(oldRailSpan, newRailSpan);
  console.log('✅ Updated identity rail HTML: inid is pure white (#ffffff)!');
} else {
  console.error('oldRailSpan not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done patch!');
