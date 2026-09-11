import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const idx = html.indexOf('function updateI18n()');
console.log(html.substring(idx, idx + 800));
