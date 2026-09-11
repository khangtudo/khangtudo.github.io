import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const idRailIdx = html.indexOf('class="identity-rail"');
console.log('--- identity-rail HTML ---');
console.log(html.substring(idRailIdx, idRailIdx + 800));

const headerBrandIdx = html.indexOf('class="brand-group"');
console.log('--- header brand-group HTML ---');
console.log(html.substring(headerBrandIdx, headerBrandIdx + 400));
