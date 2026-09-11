import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const bgIdx = html.indexOf('.brand-group {');
console.log('--- .brand-group CSS ---');
console.log(html.substring(bgIdx, bgIdx + 250));

const bmtIdx = html.indexOf('.brand-main-title {');
console.log('--- .brand-main-title CSS ---');
console.log(html.substring(bmtIdx, bmtIdx + 300));

const hdrIdx = html.indexOf('class="brand-group"');
console.log('--- header HTML ---');
console.log(html.substring(hdrIdx - 50, hdrIdx + 450));

const railIdx = html.indexOf('class="big-logo"');
console.log('--- identity rail HTML ---');
console.log(html.substring(railIdx, railIdx + 400));
