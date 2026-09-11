import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const target = 'Professional Digital Laboratory';
const replacement = 'Professional Digital Laboratory Since 1993';

let count = 0;
while (html.includes(target + ' Since 1993') === false && html.includes(target)) {
  html = html.replace(target, replacement);
  count++;
}

// In case some were already replaced or not
html = html.replaceAll('Professional Digital Laboratory Since 1993 Since 1993', 'Professional Digital Laboratory Since 1993');
html = html.replaceAll('Professional Digital Laboratory', 'Professional Digital Laboratory Since 1993');
html = html.replaceAll('Professional Digital Laboratory Since 1993 Since 1993', 'Professional Digital Laboratory Since 1993');

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Updated slogan across all occurrences to: Professional Digital Laboratory Since 1993');
