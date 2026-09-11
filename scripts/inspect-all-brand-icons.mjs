import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const brandIconsIdx = html.indexOf('const BRAND_ICONS =');
const endBrandIconsIdx = html.indexOf('export const I18N =') !== -1 ? html.indexOf('export const I18N =') : html.indexOf('const I18N =');
console.log(html.substring(brandIconsIdx, endBrandIconsIdx));
