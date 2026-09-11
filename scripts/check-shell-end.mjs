import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');
const sheetStart = html.indexOf('id="editSheet"');
console.log(html.substring(sheetStart - 600, sheetStart + 100));
