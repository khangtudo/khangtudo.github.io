import fs from 'node:fs';

const htmlPath = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const i18nCode = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/assets/i18n.js', 'utf8');
const iconsCode = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/assets/social-icons.js', 'utf8');

const cleanI18n = i18nCode
  .replace('export const I18N =', 'const I18N =')
  .replace('export function getTranslation', 'function getTranslation');

const cleanIcons = iconsCode
  .replace('export const BRAND_ICONS =', 'const BRAND_ICONS =');

const inlineBlock = `// Inlined I18N & Icons - 100% immune to browser cache lag
  ${cleanI18n}
  ${cleanIcons}
`;

// Replace the two import lines
const target = `import { I18N, getTranslation } from './assets/i18n.js?v=20260911_2030';
  import { BRAND_ICONS } from './assets/social-icons.js?v=20260911_2030';`;

if (html.includes(target)) {
  html = html.replace(target, inlineBlock);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ Successfully inlined I18N and BRAND_ICONS into index.html!');
} else {
  console.log('❌ Target string not found in index.html');
}
