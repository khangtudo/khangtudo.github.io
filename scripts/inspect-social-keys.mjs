import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const brandIconsIdx = html.indexOf('const BRAND_ICONS =');
const endBrandIconsIdx = html.indexOf('let currentLang =') !== -1 ? html.indexOf('let currentLang =') : html.indexOf('const I18N =');
const sub = html.substring(brandIconsIdx, brandIconsIdx + 6000);

// extract all keys in BRAND_ICONS
const keyMatches = sub.match(/([a-zA-Z0-9_-]+):\s*{\s*name:/g);
console.log('Available keys in BRAND_ICONS:', keyMatches ? keyMatches.map(m => m.split(':')[0].trim()) : []);
