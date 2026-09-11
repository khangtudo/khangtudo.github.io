import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const qrBtnRowIdx = html.indexOf('class="qr-btn-row"');
console.log(html.substring(qrBtnRowIdx, qrBtnRowIdx + 400));

const btnDownloadQrIdx = html.indexOf('btnDownloadVcf');
console.log('btnDownloadVcf in JS:', html.substring(btnDownloadQrIdx - 50, btnDownloadQrIdx + 250));
