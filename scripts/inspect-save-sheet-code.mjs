import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const btnSaveIdx = html.indexOf("document.getElementById('btnSaveSheet').onclick");
console.log(html.substring(btnSaveIdx, btnSaveIdx + 1500));
