import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const modalIdx = html.indexOf('id="qrModal"');
console.log(html.substring(modalIdx, modalIdx + 600));

const nfcJsIdx = html.indexOf('btnDownloadNfc');
console.log(html.substring(nfcJsIdx, nfcJsIdx + 500));
