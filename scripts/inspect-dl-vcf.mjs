import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const dlIdx = html.indexOf("document.getElementById('btnDownloadVcf').onclick");
console.log(html.substring(dlIdx, dlIdx + 400));
