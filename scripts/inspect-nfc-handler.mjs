import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const nfcJsIdx = html.indexOf('const btnDownloadNfc');
console.log(html.substring(nfcJsIdx, nfcJsIdx + 600));
