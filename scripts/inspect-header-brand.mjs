import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const brandGroupIdx = html.indexOf('class="brand-group"');
console.log(html.substring(brandGroupIdx - 50, brandGroupIdx + 500));
