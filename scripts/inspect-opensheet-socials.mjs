import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const openSheetIdx = html.indexOf('function openSheet()');
console.log(html.substring(openSheetIdx, openSheetIdx + 800));
