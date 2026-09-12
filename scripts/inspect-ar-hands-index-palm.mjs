import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands/index.html';
let html = fs.readFileSync(p, 'utf8');

const palmIdx = html.indexOf('} else if (isOpenPalm) {');
console.log(html.substring(palmIdx, palmIdx + 600));
