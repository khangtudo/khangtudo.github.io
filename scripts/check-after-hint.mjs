import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const hintStart = html.indexOf('flip-hint-wrap');
console.log(html.substring(hintStart - 50, hintStart + 600));
