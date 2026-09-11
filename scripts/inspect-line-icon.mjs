import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const lineIdx = html.indexOf('line:');
console.log(html.substring(lineIdx, lineIdx + 500));
