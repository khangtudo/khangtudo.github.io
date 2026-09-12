import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands.html', 'utf8');

const palmIdx = html.indexOf('isOpenPalm) {');
console.log(html.substring(palmIdx, palmIdx + 600));
