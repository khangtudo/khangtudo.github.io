import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const brandIconsIdx = html.indexOf('const BRAND_ICONS =');
console.log(html.substring(brandIconsIdx, brandIconsIdx + 1500));
