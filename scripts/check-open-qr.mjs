import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const qrIdx = html.indexOf('function openQr()');
console.log(html.substring(qrIdx, qrIdx + 600));
