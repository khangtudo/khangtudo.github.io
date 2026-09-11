import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const lastHint = html.lastIndexOf('flip-hint-wrap');
console.log(html.substring(lastHint - 100, lastHint + 800));
