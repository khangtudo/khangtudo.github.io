import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

const idx = html.indexOf('const rawZoomRatio');
console.log(html.substring(idx - 100, idx + 1200));
