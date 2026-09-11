import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const idRailCssIdx = html.indexOf('.identity-rail');
console.log('--- identity-rail CSS ---');
console.log(html.substring(idRailCssIdx, idRailCssIdx + 700));

const brandGroupCssIdx = html.indexOf('.brand-group');
console.log('--- brand-group CSS ---');
console.log(html.substring(brandGroupCssIdx, brandGroupCssIdx + 400));
