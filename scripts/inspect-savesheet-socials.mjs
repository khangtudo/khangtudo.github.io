import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const saveSheetIdx = html.indexOf("document.getElementById('btnSaveSheet').onclick");
console.log(html.substring(saveSheetIdx, saveSheetIdx + 800));
